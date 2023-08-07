import { render, screen, cleanup } from "@solidjs/testing-library";
import { describe, expect, it, afterEach } from "vitest";

import { StoreProvider, useStoreContext } from "./context";

afterEach(cleanup);

describe("StoreProvider", () => {
  it("renders provider with children", () => {
    render(() => <StoreProvider>children</StoreProvider>);

    expect(screen.getByText("children")).toBeInTheDocument();
  });

  it("renders provider with children and initialStore", () => {
    render(() => <StoreProvider initalStore={{ lists: [] }}>children</StoreProvider>);

    expect(screen.getByText("children")).toBeInTheDocument();
  });
});

describe("useStoreContext", () => {
  it("throws an error when used outside of provider", () => {
    expect(() => useStoreContext()).toThrow();
  });

  it("renders inside provider", () => {
    const Component = () => {
      useStoreContext();
      return <>test</>;
    };
    render(() => (
      <StoreProvider>
        <Component />
      </StoreProvider>
    ));

    expect(screen.getByText("test")).toBeInTheDocument();
  });
});
