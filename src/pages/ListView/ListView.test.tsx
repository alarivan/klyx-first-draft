import { useParams } from "@solidjs/router";
import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it, Mock } from 'vitest';
import "@testing-library/jest-dom"

import { StoreProvider } from "../../store/context";
import { createListWithItems } from "../../store/helpers";

import { ListView } from "./ListView";


const list = createListWithItems({ name: "list1", description: "list1desc" })

vi.mock('@solidjs/router', () => {
  return {
    Navigate: vi.fn().mockReturnValue('Im navigatin'),
    useParams: vi.fn()
  }
})

const mockUseParams = useParams as Mock

describe("ListView", () => {
  beforeEach(() => {
    mockUseParams.mockReturnValue({ listId: list.id })
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  it("renders list when list is in store", () => {
    render(() =>
      <StoreProvider initalStore={{ lists: [list] }}>
        <ListView />
      </StoreProvider>
    );


    expect(screen.getByText("list1")).toBeInTheDocument();
    expect(screen.getByText("list1desc")).toBeInTheDocument();
  });

  it("render navigation without lists", () => {
    render(() =>
      <StoreProvider initalStore={{ lists: [] }}>
        <ListView />
      </StoreProvider>
    );


    expect(screen.getByText("Im navigatin")).toBeInTheDocument();
  });
});
