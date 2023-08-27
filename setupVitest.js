import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@solid-primitives/storage", async () => {
  const mod = await vi.importActual("@solid-primitives/storage");
  return {
    ...mod,
    makePersisted: vi.fn().mockImplementation((store) => store),
  };
});

vi.mock("solid-transition-group", async () => {
  const mod = await vi.importActual("solid-transition-group");
  return {
    ...mod,
    Transition: vi.fn().mockImplementation((p) => p.children),
  };
});

const noop = () => {};
Object.defineProperty(window, "scrollTo", { value: noop, writable: true });
