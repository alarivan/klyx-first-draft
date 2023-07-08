import { createUniqueId } from "solid-js";

import { IList, IListItem } from "./types";

export const createList = ({
  name,
  description,
}: Pick<IList, "name" | "description">): IList => {
  return { id: createUniqueId(), name, description, items: [] };
};

export const createListItem = ({
  name,
  description,
}: Pick<IList, "name" | "description">): IListItem => {
  return { id: createUniqueId(), name, description, completed: false };
};
