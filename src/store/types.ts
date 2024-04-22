export enum COUNTER_TYPE_ENUM {
  NONE = "none",
  LIMITED = "limited",
  UNLIMITED = "unlimited",
}
export interface IListItem {
  id: string;
  name: string | null;
  description: string | null;
  completed: boolean;
  counterType: COUNTER_TYPE_ENUM;
  counterLimit: string | null;
  counterAutoswitch: boolean;
  counterProgress: number | null;
  timerSeconds: string | null;
  timerProgress: number | null;
  timerAutoswitch: boolean;
  timerAutostart: boolean;
}

export interface IListDataObject {
  name: IList["name"];
  description?: IList["description"];
  currentItem?: IList["currentItem"];
}

export interface IListItemDataObject {
  name?: IListItem["name"];
  description?: IListItem["description"];
  completed?: IListItem["completed"];
  counterType?: IListItem["counterType"];
  counterLimit?: IListItem["counterLimit"];
  counterAutoswitch?: IListItem["counterAutoswitch"];
  counterProgress?: IListItem["counterProgress"];
  timerSeconds?: IListItem["timerSeconds"];
  timerProgress?: IListItem["timerProgress"];
  timerAutoswitch?: IListItem["timerAutoswitch"];
  timerAutostart?: IListItem["timerAutostart"];
}

export interface IList {
  id: string;
  name: string;
  description: string | null;
  currentItem: string | null;
  items: Array<IListItem>;
}

export type IStore = { lists: Array<IList> };

export type IListItemWithIndex = { data: IListItem; index: number };

export type IStoreActions = {
  addWithItems(list: IListDataObject, items: IListItemDataObject[]): void;
  add(list: IListDataObject): void;
  remove(removeId: IList["id"]): void;
  update(updateId: IList["id"], list: IListDataObject): void;
  find(findId: IList["id"]): IList | undefined;
  play(playId: IList["id"]): void;
  resetItemsState(listId: IList["id"]): void;
  reorderItems(listId: IList["id"], items: IList["items"]): void;
  addItem(listId: IList["id"], item: IListItemDataObject): void;
  removeItem(listId: IList["id"], itemId: IListItem["id"]): void;
  updateItem(
    listId: IList["id"],
    itemId: IListItem["id"],
    item: IListItemDataObject,
  ): void;
  findItem(
    listId: IList["id"],
    itemId: IListItem["id"],
  ): IListItemWithIndex | undefined;
};

export type IStoreContextValue = [state: IStore, actions: IStoreActions];
