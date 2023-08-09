import type { IList, IListItem, IListItemCreateObject } from "./types";

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
}: IListItemCreateObject): IListItem => {
  return {
    id: createUniqueId(),
    name,
    description,
    completed,
  };
};

export const createListWithItems = (
  list: Pick<IList, "name" | "description">,
  items: IListItemCreateObject[] = [],
): IList => {
  return items.reduce((list: IList, item) => {
    return { ...list, items: [...list.items, createListItem(item)] };
  }, createList(list));
};
