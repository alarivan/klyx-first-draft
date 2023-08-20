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
  name = null,
  description = null,
  completed = false,
  counterLimit = null,
  counterType = "none",
  counterAutoswitch = true,
  timerSeconds = null,
}: IListItemDataObject): IListItem => {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    completed,
    counterLimit,
    counterAutoswitch,
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

export const isComleted = (item: IListItem) => {
  let completed = item.completed;

  if (
    item.counterType === "limited" &&
    item.counterLimit &&
    item.timerSeconds
  ) {
    completed =
      parseInt(item.counterLimit) === item.counterProgress &&
      parseInt(item.timerSeconds) === item.timerProgress;
  } else if (item.counterType === "limited" && item.counterLimit) {
    completed = parseInt(item.counterLimit) === item.counterProgress;
  } else if (item.timerSeconds && item.timerProgress) {
    completed = parseInt(item.timerSeconds) === item.timerProgress;
  }

  return completed;
};
