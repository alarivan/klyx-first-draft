export interface IListItem {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
}

export interface IListItemCreateObject {
  name: IListItem["name"];
  description?: IListItem["description"];
  completed?: IListItem["completed"];
}

export interface IList {
  id: string;
  name: string;
  description?: string;
  currentItem?: string;
  items: Array<IListItem>;
}

export type IStore = { lists: Array<IList> };

export type IListItemWithIndex = { item: IListItem; index: number };

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
  addItem(listId: IList["id"], item: IListItemCreateObject): void;
  removeItem(listId: IList["id"], itemId: IListItem["id"]): void;
  updateItem(
    listId: IList["id"],
    itemId: IListItem["id"],
    item: Pick<IListItem, "name" | "description" | "completed">,
  ): void;
  findItem(
    listId: IList["id"],
    itemId: IListItem["id"],
  ): IListItemWithIndex | undefined;
};

export type IStoreContextValue = [state: IStore, actions: IStoreActions];
