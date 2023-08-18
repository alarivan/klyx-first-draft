import type { Mock } from "vitest";

import { Router, useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vitest";

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { ListItemSummaryLine } from "./ListItemSummaryLine";

const list = createListWithItems({ name: "list1", description: "list1desc" }, [
  { name: "item1" },
  {
    name: "item2",
    description: "item2desc",
    counterType: "limited",
    counterLimit: "10",
    timerSeconds: "60",
  },
]);
const itemMinimal = list.items[0];
const itemFull = list.items[1];

vi.mock("@solidjs/router", async () => {
  const type = await import("@solidjs/router");
  const mod: typeof type = await vi.importActual("@solidjs/router");
  return {
    ...mod,
    useParams: vi.fn(),
  };
});

const mockUseParams = useParams as Mock;

describe("ListItemSummaryLine", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component with all data", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [list] }}>
          <ListItemSummaryLine listId={list.id} item={itemFull} index={1} />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();
    expect(screen.getByText("Counter:")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Timer:")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("item2desc")).toBeInTheDocument();
  });

  it("renders with minimal data", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <ListItemSummaryLine listId={list.id} item={itemMinimal} index={0} />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.queryByText("Counter:")).not.toBeInTheDocument();
    expect(screen.queryByText("Timer:")).not.toBeInTheDocument();
    expect(screen.queryByText("item1desc")).not.toBeInTheDocument();
  });

  it("renders expand button for long description", () => {
    render(() => (
      <Router>
        <StoreProvider initalStore={{ lists: [] }}>
          <ListItemSummaryLine
            listId={list.id}
            item={{
              ...itemMinimal,
              description:
                "Dolor mollit anim est excepteur aliqua exercitation tempor commodo occaecat dolore proident quis duis mollit proident nulla proident aute aliqua aliqua cillum esse exercitation consequat labore exercitation adipisicing amet mollit quis nostrud excepteur excepteur eu aute fugiat proident sint aliqua ipsum esse id exercitation enim elit eiusmod elit amet aliqua occaecat et commodo excepteur in adipisicing minim mollit Lorem ad do deserunt aute exercitation.",
            }}
            index={0}
          />
        </StoreProvider>
      </Router>
    ));

    expect(screen.getByText(/Dolor mollit/)).toBeInTheDocument();
    expect(screen.getByLabelText("Expand description")).toBeInTheDocument();
  });
});
