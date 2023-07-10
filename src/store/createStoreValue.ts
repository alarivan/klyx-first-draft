import type { IStore, IStoreContextValue } from "./types";

import { createStore, produce } from "solid-js/store";

import { createList, createListItem } from "./helpers";

export const createStoreValue = (initialState?: IStore) => {
  const [state, setState] = createStore<IStore>(initialState || { lists: [] });
  const value: IStoreContextValue = [
    state,
    {
      add(list) {
        setState(
          produce((state) => {
            state.lists.push(createList(list));
          }),
        );
      },
      remove(removeId: string) {
        setState((prevState) => ({
          lists: prevState.lists.filter(({ id }) => id !== removeId),
        }));
      },
      update(updateId, { name, description }) {
        setState(
          "lists",
          (list) => list.id === updateId,
          () => ({ name, description }),
        );
      },
      find(findId) {
        return state.lists.find(({ id }) => id === findId);
      },
      play(playId) {
        setState(
          "lists",
          (list) => list.id === playId,
          (list) => ({ currentItem: list.items[0]?.id }),
        );
      },
      resetStatus(listId) {
        setState(
          "lists",
          (list) => list.id === listId,
          (list) => ({
            items: list.items.map((item) => ({ ...item, completed: false })),
          }),
        );
      },
      reorderItems(listId, items) {
        setState(
          "lists",
          (list) => list.id === listId,
          () => ({ items }),
        );
      },
      addItem(listId, newItem) {
        setState(
          "lists",
          (list) => list.id === listId,
          (list) => ({ items: [...list.items, createListItem(newItem)] }),
        );
      },
      removeItem(listId, itemId) {
        setState(
          "lists",
          (list) => list.id === listId,
          (list) => ({ items: list.items.filter(({ id }) => id !== itemId) }),
        );
      },
      updateItem(listId, itemId, item) {
        setState(
          "lists",
          (list) => list.id === listId,
          "items",
          (item) => item.id === itemId,
          () => item,
        );
      },
      findItem(listId, itemId) {
        const list = state.lists.find(({ id }) => id === listId);
        if (list) {
          return list.items.find(({ id }) => id === itemId);
        }
        return undefined;
      },
    },
  ];

  return value;
};
