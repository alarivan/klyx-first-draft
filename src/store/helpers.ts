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
  counterProgress = null,
  timerSeconds = null,
  timerAutoswitch = true,
  timerAutostart = false,
  timerProgress = null,
}: IListItemDataObject): IListItem => {
  return {
    id: crypto.randomUUID(),
    name,
    description,
    completed,
    counterLimit,
    counterAutoswitch,
    counterProgress: counterType === "none" ? null : counterProgress || 0,
    counterType,
    timerSeconds,
    timerProgress: timerSeconds ? timerProgress || 0 : null,
    timerAutoswitch,
    timerAutostart,
  };
};

export const createListWithItems = (
  list: IListDataObject,
  items: IListItemDataObject[] = [],
): IList => {
  return items.reduce((list: IList, item) => {
    return { ...list, items: [...list.items, createListItem(item)] };
  }, createList(list));
};

export const isCompleted = (item: IListItem) => {
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
  } else if (item.timerSeconds) {
    completed = parseInt(item.timerSeconds) === item.timerProgress;
  }

  return completed;
};
