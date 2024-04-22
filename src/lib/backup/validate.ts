import type { IStore } from "../../store/types";

import { COUNTER_TYPE_ENUM } from "../../store/types";

function formatItemErrorMessage(key: string, value: unknown, id: unknown) {
  return `Invalid item ${key} = ${value} for id: ${id}`;
}

function isObject(value: unknown) {
  return typeof value === "object" && value !== null;
}

function isStringOrNull(value: unknown) {
  return typeof value === "string" || value === null;
}

function isValidListName(name: unknown) {
  if (typeof name !== "string") return false;

  if (name.length < 3) return false;

  return true;
}

function validateItem(item: unknown) {
  if (!isObject(item)) {
    throw new Error("item is not an object");
  }
  const itemObj = item as Record<string, unknown>;

  if (typeof itemObj.id !== "string") {
    throw new Error(formatItemErrorMessage("id", itemObj.id, itemObj.id));
  }

  const validateStringOrNull = [
    "name",
    "description",
    "counterLimit",
    "timerSeconds",
  ];
  validateStringOrNull.forEach((key) => {
    const isValid = isStringOrNull(itemObj[key]);
    if (!isValid) {
      throw new Error(formatItemErrorMessage(key, itemObj[key], itemObj.id));
    }
    return isValid;
  });

  const validateBoolean = [
    "completed",
    "counterAutoswitch",
    "timerAutoswitch",
    "timerAutostart",
  ];
  validateBoolean.forEach((key) => {
    const isValid = typeof itemObj[key] === "boolean";
    if (!isValid) {
      throw new Error(formatItemErrorMessage(key, itemObj[key], itemObj.id));
    }
    return isValid;
  });

  const validateNumberOrNull = ["counterProgress", "timerProgress"];
  validateNumberOrNull.forEach((key) => {
    const isValid = typeof itemObj[key] === "number" || itemObj[key] === null;
    if (!isValid) {
      throw new Error(formatItemErrorMessage(key, itemObj[key], itemObj.id));
    }
    return isValid;
  });

  const isValidCounterType =
    typeof itemObj["counterType"] === "string" &&
    [
      COUNTER_TYPE_ENUM.NONE,
      COUNTER_TYPE_ENUM.LIMITED,
      COUNTER_TYPE_ENUM.UNLIMITED,
    ].find((v) => itemObj["counterType"] === v);
  if (!isValidCounterType) {
    throw new Error(
      formatItemErrorMessage("counterType", itemObj.counterType, itemObj.id),
    );
  }

  return true;
}

function validateItems(items: unknown) {
  if (!Array.isArray(items)) {
    throw new Error("items is not an Array");
  }

  return items.every(validateItem);
}

export function validateList(list: unknown): boolean {
  if (!isObject(list)) {
    throw new Error("List is not an object");
  }
  const listObj = list as Record<string, unknown>;

  if (typeof listObj.id !== "string") {
    throw new Error("Invalid list id");
  }
  if (!isValidListName(listObj.name)) {
    throw new Error(`Invalid list name for id: ${listObj.id}`);
  }

  if (!isStringOrNull(listObj.description)) {
    throw new Error(`Invalid list description for id: ${listObj.id}`);
  }

  try {
    validateItems(listObj.items);
  } catch (e) {
    throw new Error(`${e}. list id: ${listObj.id}`);
  }

  return true;
}

export function validateStore(
  store: string,
): [error: unknown | false, store: IStore | false] {
  try {
    const json = JSON.parse(store);

    if (!Array.isArray(json.lists)) {
      throw new Error(`'lists' is not an Array`);
    }
    json.lists.every((list: unknown) => validateList(list));

    return [false, json];
  } catch (e) {
    return [e, false];
  }
}
