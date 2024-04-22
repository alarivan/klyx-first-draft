import type {
  IList,
  IListDataObject,
  IListItem,
  IListItemDataObject,
} from "./types";

import { COUNTER_TYPE_ENUM } from "./types";

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
  counterType = COUNTER_TYPE_ENUM.NONE,
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
  const newList = createList(list);
  const newItems = items.map(createListItem);
  return { ...newList, items: newItems };
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

export const stripIds = <T extends IList | IListItem>(value: T): T => {
  const { id: _id, ...rest } = value;
  return rest as T;
};
