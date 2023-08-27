import type { Mock } from "vitest";

import { fireEvent, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { createWakeLock } from "../../lib/wakeLock";
import { renderInRouter } from "../../test/utils";

import { PageHeader } from "./PageHeader";

vi.mock("../../lib/wakeLock", async () => {
  const type = await import("../../lib/wakeLock");
  const mod: typeof type = await vi.importActual("../../lib/wakeLock");
  return {
    ...mod,
    createWakeLock: vi.fn(),
  };
});

const createWakeLockMock = createWakeLock as Mock;

describe("PageHeader", () => {
  beforeEach(() => {
    createWakeLockMock.mockReturnValue([() => false, false, vi.fn(), vi.fn()]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component", () => {
    renderInRouter(() => <PageHeader />);

    expect(screen.getByTitle("Home")).toBeInTheDocument();
    expect(screen.getByTitle("Settings")).toBeInTheDocument();
  });

  describe("when wake lock is available ", () => {
    const requestMock = vi.fn();
    const releaseMock = vi.fn();
    beforeEach(() => {
      createWakeLockMock.mockReturnValue([
        () => true,
        true,
        requestMock,
        releaseMock,
      ]);
    });

    it("renders wake checkbox when wake lock is available", () => {
      renderInRouter(() => <PageHeader />);

      expect(screen.getByLabelText("Keep screen awake")).toBeChecked();
    });

    it("calls request mock when not active", () => {
      createWakeLockMock.mockReturnValue([
        () => false,
        true,
        requestMock,
        releaseMock,
      ]);
      renderInRouter(() => <PageHeader />);

      const toggle = screen.getByLabelText("Keep screen awake");
      fireEvent.click(toggle);

      expect(requestMock).toHaveBeenCalled();
    });

    it("calls release mock when active", () => {
      renderInRouter(() => <PageHeader />);

      const toggle = screen.getByLabelText("Keep screen awake");
      fireEvent.click(toggle);

      expect(releaseMock).toHaveBeenCalled();
    });
  });
});
