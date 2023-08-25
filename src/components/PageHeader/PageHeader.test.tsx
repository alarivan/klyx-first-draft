import { screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { renderInRouter } from "../../test/utils";

import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders component", () => {
    renderInRouter(() => <PageHeader />);

    expect(screen.getByTitle("Home")).toBeInTheDocument();
    expect(screen.getByTitle("Settings")).toBeInTheDocument();
  });
});
