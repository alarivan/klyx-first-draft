export interface IListItem {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  counterType?: "limited" | "unlimited";
  counterLimit?: number;
  counterProgress?: number;
  timerSeconds?: number;
  timerProgress?: number;
}

export interface IListItemDataObject {
  name: IListItem["name"];
  description?: IListItem["description"];
  completed?: IListItem["completed"];
  counterType?: IListItem["counterType"];
  counterLimit?: IListItem["counterLimit"];
  counterProgress?: IListItem["counterProgress"];
  timerSeconds?: IListItem["timerSeconds"];
  timerProgress?: IListItem["timerProgress"];
}

export interface IList {
  id: string;
  name: string;
  description?: string;
  currentItem?: string;
  items: Array<IListItem>;
}

export type IStore = { lists: Array<IList> };

export type IListItemWithIndex = { data: IListItem; index: number };

export type IStoreActions = {
  add(list: Pick<IList, "name" | "description">): void;
  remove(removeId: IList["id"]): void;
  update(
    updateId: IList["id"],
    list: Pick<IList, "name" | "description">,
  ): void;
  find(findId: IList["id"]): IList | undefined;
  play(playId: IList["id"]): void;
  resetStatus(listId: IList["id"]): void;
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
