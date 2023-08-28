import { createListWithItems } from "../../store/helpers";

import { saveAsFile } from "./saveAsFile";

const list = () =>
  createListWithItems({ name: "list1", description: "list1desc" }, [
    { name: "item1", description: "item1desc" },
  ]);
const store = { lists: [list()] };

describe("saveAsFile", () => {
  const createObjectURL = vi.fn();
  beforeEach(() => {
    window.URL.createObjectURL = createObjectURL;
  });

  it("triggers file download", () => {
    const link = document.createElement("a");
    link.click = vi.fn();
    vi.spyOn(document, "createElement").mockReturnValue(link);

    saveAsFile(JSON.stringify(store));

    expect(link).not.toBeInTheDocument();
    expect(link.click).toHaveBeenCalledOnce();
  });

  describe(" when webkitURL exists in window", () => {
    it("triggers file download", () => {
      window.webkitURL = {
        createObjectURL: createObjectURL,
      } as unknown as {
        new(url: string | URL, base?: string | URL | undefined): URL;
        prototype: URL;
        createObjectURL(obj: Blob | MediaSource): string;
        revokeObjectURL(url: string): void;
      };

      const link = document.createElement("a");
      link.click = vi.fn();
      vi.spyOn(document, "createElement").mockReturnValue(link);

      saveAsFile(JSON.stringify(store));

      expect(link).not.toBeInTheDocument();
      expect(link.click).toHaveBeenCalledOnce();
    });
  });
});
