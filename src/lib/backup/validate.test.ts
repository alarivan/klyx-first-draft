import { validateStore } from "./validate";

describe("validate store", () => {
  test.each([
    {
      value: "",
      message: "Unexpected end of JSON input",
    },
    {
      value: "{}",
      message: "'lists' is not an Array",
    },
    {
      value: JSON.stringify({ lists: [{ id: null }] }),
      message: "Invalid list id",
    },
    {
      value: JSON.stringify({ lists: [null] }),
      message: "List is not an object",
    },
    {
      value: JSON.stringify({
        lists: [{ id: "1", name: "valid", description: null, items: [null] }],
      }),
      message: "Error: item is not an object. list id: 1",
    },
    {
      value: JSON.stringify({
        lists: [{ id: "1", name: "valid", description: null, items: "" }],
      }),
      message: "Error: items is not an Array. list id: 1",
    },
  ])("returns error & false for invalid value:$value", ({ value, message }) => {
    expect(validateStore(value)).toEqual([new Error(message), false]);
  });

  test.each([
    { list: { id: "1" }, key: "name" },
    { list: { id: "1", name: "12" }, key: "name" },
    { list: { id: "1", name: "valid" }, key: "description" },
  ])("returns error & false for list with invalid $key", ({ key, list }) => {
    expect(validateStore(JSON.stringify({ lists: [list] }))).toEqual([
      new Error(`Invalid list ${key} for id: ${list.id}`),
      false,
    ]);
  });

  const createStateWithItem = (item: Record<string, unknown>, key: string) => {
    return {
      list: {
        id: "1",
        name: "valid",
        description: null,
        items: [{ id: "1", ...item }],
      },
      key,
    };
  };

  test.each([
    createStateWithItem({ id: 1 }, "id"),
    createStateWithItem({ name: 1 }, "name"),
    createStateWithItem({ name: null, description: 1 }, "description"),
    createStateWithItem(
      { name: null, description: null, counterLimit: 1 },
      "counterLimit",
    ),
    createStateWithItem(
      { name: null, description: null, counterLimit: null, timerSeconds: 1 },
      "timerSeconds",
    ),
    createStateWithItem(
      {
        name: null,
        description: null,
        counterLimit: null,
        timerSeconds: null,
        completed: null,
      },
      "completed",
    ),
    createStateWithItem(
      {
        name: null,
        description: null,
        counterLimit: null,
        timerSeconds: null,
        completed: false,
      },
      "counterAutoswitch",
    ),
    createStateWithItem(
      {
        name: null,
        description: null,
        counterLimit: null,
        timerSeconds: null,
        completed: false,
        counterAutoswitch: false,
      },
      "timerAutoswitch",
    ),
    createStateWithItem(
      {
        name: null,
        description: null,
        counterLimit: null,
        timerSeconds: null,
        completed: false,
        counterAutoswitch: false,
        timerAutoswitch: false,
      },
      "timerAutostart",
    ),
    createStateWithItem(
      {
        name: null,
        description: null,
        counterLimit: null,
        timerSeconds: null,
        completed: false,
        counterAutoswitch: false,
        timerAutoswitch: false,
        timerAutostart: false,
      },
      "counterProgress",
    ),
    createStateWithItem(
      {
        name: null,
        description: null,
        counterLimit: null,
        timerSeconds: null,
        completed: false,
        counterAutoswitch: false,
        timerAutoswitch: false,
        timerAutostart: false,
        counterProgress: null,
      },
      "timerProgress",
    ),
    createStateWithItem(
      {
        name: null,
        description: null,
        counterLimit: null,
        timerSeconds: null,
        completed: false,
        counterAutoswitch: false,
        timerAutoswitch: false,
        timerAutostart: false,
        timerProgress: null,
        counterProgress: null,
        counterType: "a",
      },
      "counterType",
    ),
  ])("returns error & false for list with invalid $key", ({ key, list }) => {
    const item = list.items[0] as Record<string, unknown>;
    expect(validateStore(JSON.stringify({ lists: [list] }))).toEqual([
      new Error(
        `Error: Invalid item ${key} = ${item[key]} for id: 1. list id: 1`,
      ),
      false,
    ]);
  });

  it("returns error false & valid true for valid store", () => {
    const expected = {
      lists: [
        {
          id: "1",
          name: "valid",
          description: null,
          items: [
            {
              id: "1",
              name: null,
              description: null,
              counterLimit: null,
              timerSeconds: null,
              completed: false,
              counterAutoswitch: false,
              timerAutoswitch: false,
              timerAutostart: false,
              timerProgress: null,
              counterProgress: null,
              counterType: "none",
            },
          ],
        },
      ],
    };
    expect(validateStore(JSON.stringify(expected))).toEqual([false, expected]);
  });
});
