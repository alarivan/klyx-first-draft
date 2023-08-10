import type { IList, IListItem, IListItemDataObject } from "./types";

import { createUniqueId } from "solid-js";

export const createList = ({
  name,
  description,
}: Pick<IList, "name" | "description">): IList => {
  return { id: createUniqueId(), name, description, items: [] };
};

export const createListItem = ({
  name,
  description,
  completed = false,
  counterLimit,
  counterType,
  timerSeconds,
}: IListItemDataObject): IListItem => {
  return {
    id: createUniqueId(),
    name,
    description,
    completed,
    counterLimit,
    counterProgress: counterType ? 0 : undefined,
    counterType,
    timerSeconds,
    timerProgress: timerSeconds ? 0 : undefined,
  };
};

export const createListWithItems = (
  list: Pick<IList, "name" | "description">,
  items: IListItemDataObject[] = [],
): IList => {
  return items.reduce((list: IList, item) => {
    return { ...list, items: [...list.items, createListItem(item)] };
  }, createList(list));
};
