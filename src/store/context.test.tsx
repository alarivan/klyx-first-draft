import "@testing-library/jest-dom";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider, useStoreContext } from "./context";

describe("StoreProvider", () => {
  it("renders provider with children", () => {
    render(() => <StoreProvider>children</StoreProvider>);

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
