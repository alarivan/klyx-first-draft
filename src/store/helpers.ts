import type {
  IList,
  IListDataObject,
  IListItem,
  IListItemDataObject,
} from "./types";

export const createList = ({
  name,
  description = null,
}: IListDataObject): IList => {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    currentItem: null,
    items: [],
  };
};

export const createListItem = ({
  name,
  description = null,
  completed = false,
  counterLimit = null,
  counterType = "none",
  timerSeconds = null,
}: IListItemDataObject): IListItem => {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    completed,
    counterLimit,
    counterProgress: counterType === "none" ? null : 0,
    counterType,
    timerSeconds,
    timerProgress: timerSeconds ? 0 : null,
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
