import type { Mock } from "vitest";

import { fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import {
  restoreFromBackup,
  saveAsFile,
  swapCurrentStoreWithBackup,
} from "../../lib/backup";
import { LOCAL_STORAGE_STORE_KEY } from "../../store";
import { renderInRouter } from "../../test/utils";

import { Settings } from "./Settings";

vi.mock("../../lib/backup", async () => {
  const type = await import("../../lib/backup");
  const mod: typeof type = await vi.importActual("../../lib/backup");
  return {
    ...mod,
    saveAsFile: vi.fn(),
    restoreFromBackup: vi.fn(),
    swapCurrentStoreWithBackup: vi.fn(),
  };
});

const saveAsFileMock = saveAsFile as Mock;
const restoreFromBackupMock = restoreFromBackup as Mock;
const swapCurrentStoreWithBackupMock = swapCurrentStoreWithBackup as Mock;

describe("Settings", () => {
  const originalLocation = window.location;
  const reloadFn = vi.fn();

  beforeAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: reloadFn },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    renderInRouter(() => <Settings />);

    const color = screen.getByLabelText("Choose theme color");
    fireEvent.change(color, { target: { value: "#000" } });

    expect(color).toHaveValue("#000000");
  });

  describe("when store exists in local storage", () => {
    beforeEach(() => {
      global.localStorage.setItem(
        LOCAL_STORAGE_STORE_KEY,
        JSON.stringify({ lists: [] }),
      );
    });

    afterEach(() => {
      global.localStorage.clear();
    });

    it("downloads backup", () => {
      renderInRouter(() => <Settings />);

      const downloadBackup = screen.getByText("Download backup of your data");
      fireEvent.click(downloadBackup);

      expect(saveAsFileMock).toHaveBeenCalledWith(
        JSON.stringify({ lists: [] }),
      );
    });
  });

  describe("when store doesn't exists in local storage", () => {
    it("doesn not download back up", () => {
      renderInRouter(() => <Settings />);

      const downloadBackup = screen.getByText("Download backup of your data");
      fireEvent.click(downloadBackup);

      expect(saveAsFileMock).not.toHaveBeenCalled();
    });
  });

  describe("when restore input is valid", () => {
    it("restores from backup", () => {
      renderInRouter(() => <Settings />);

      const textField = screen.getByLabelText("Paste backup file contents");
      fireEvent.change(textField, {
        target: { value: JSON.stringify({ lists: [] }) },
      });

      const restore = screen.getByRole("button", { name: "Restore" });
      fireEvent.click(restore);

      expect(restoreFromBackupMock).toHaveBeenCalled();
      expect(reloadFn).toHaveBeenCalledOnce();
    });
  });

  describe("when restore input is not valid", () => {
    it("restores from backup", () => {
      renderInRouter(() => <Settings />);

      const restore = screen.getByRole("button", { name: "Restore" });
      fireEvent.click(restore);

      expect(restoreFromBackupMock).not.toHaveBeenCalled();
      expect(reloadFn).not.toHaveBeenCalledOnce();
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe("when successfully swapped stores", () => {
    beforeAll(() => {
      swapCurrentStoreWithBackupMock.mockReturnValue(true);
    });

    it("swaps stores", () => {
      renderInRouter(() => <Settings />);

      const swap = screen.getByText("Switch back to the previous store");
      fireEvent.click(swap);

      expect(reloadFn).toHaveBeenCalledOnce();
      expect(swapCurrentStoreWithBackupMock).toHaveBeenCalled();
    });
  });

  describe("when did not successfully swap stores", () => {
    beforeAll(() => {
      swapCurrentStoreWithBackupMock.mockReturnValue(false);
    });

    it("swaps stores", () => {
      renderInRouter(() => <Settings />);

      const swap = screen.getByText("Switch back to the previous store");
      fireEvent.click(swap);

      expect(swapCurrentStoreWithBackupMock).toHaveBeenCalled();
      expect(reloadFn).not.toHaveBeenCalledOnce();
    });
  });
});
