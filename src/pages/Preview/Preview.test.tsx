import type { IList } from "../../store/types";
import type { Mock } from "vitest";

import { Navigate, Router, useSearchParams } from "@solidjs/router";
import { render } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createStoreValue } from "../../store/createStoreValue";
import { createListWithItems, stripIds } from "../../store/helpers";

import { Preview } from "./Preview";

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useSearchParams: vi.fn(),
    Navigate: vi.fn(),
  };
});

vi.mock("../../store/createStoreValue", async () => {
  const type = await import("../../store/createStoreValue");
  const mod: typeof type = await vi.importActual(
    "../../store/createStoreValue",
  );
  return {
    ...mod,
    createStoreValue: vi.fn(),
  };
});

const mockCreateStoreValue = createStoreValue as Mock;
const mockUseSearchParams = useSearchParams as Mock;
const mockNavigateComponent = Navigate as Mock;

const list = (): IList =>
  createListWithItems({ name: "list1", description: "list1desc" }, [
    { name: "item1", description: "item1desc" },
  ]);

describe("Preview", () => {
  const addWithItemsMock = vi.fn();
  beforeEach(() => {
    mockCreateStoreValue.mockReturnValue([
      null,
      { addWithItems: addWithItemsMock },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("valid list", () => {
    it("adds list from search params", async () => {
      const currentList = list();
      mockUseSearchParams.mockReturnValue([
        { list: JSON.stringify(currentList) },
      ]);
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [] }}>
            <Preview />
          </StoreProvider>
        </Router>
      ));

      expect(addWithItemsMock).toHaveBeenCalledWith(
        stripIds(currentList),
        currentList.items.map(stripIds),
      );

      expect(mockNavigateComponent).toHaveBeenCalledWith({
        href: `/`,
      });
    });
  });

  describe("invalid list", () => {
    it("does not add list from search params", async () => {
      mockUseSearchParams.mockReturnValue([
        { list: JSON.stringify({ invalid: "invalid" }) },
      ]);
      render(() => (
        <Router>
          <StoreProvider initalStore={{ lists: [] }}>
            <Preview />
          </StoreProvider>
        </Router>
      ));

      expect(addWithItemsMock).not.toHaveBeenCalled();
      expect(mockNavigateComponent).toHaveBeenCalledWith({
        href: `/`,
      });
    });
  });
});
