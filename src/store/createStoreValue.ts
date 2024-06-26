import type { IStore, IStoreContextValue } from "./types";

import { makePersisted } from "@solid-primitives/storage";
import { createStore, produce } from "solid-js/store";

import { LOCAL_STORAGE_STORE_KEY } from "./constants";
import {
  createList,
  createListItem,
  createListWithItems,
  isCompleted,
} from "./helpers";

export const createStoreValue = (initialState?: IStore) => {
  const [state, setState] = makePersisted(
    createStore<IStore>(initialState || { lists: [] }),
    { name: LOCAL_STORAGE_STORE_KEY },
  );
  const value: IStoreContextValue = [
    state,
    {
      addWithItems(list, items) {
        setState(
          produce((state) => {
            state.lists.push(createListWithItems(list, items));
          }),
        );
      },
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
      resetItemsState(listId) {
        setState(
          "lists",
          (list) => list.id === listId,
          (list) => ({
            items: list.items.map((item) => ({
              ...item,
              counterProgress: item.counterType === "none" ? null : 0,
              timerProgress: item.timerSeconds ? 0 : null,
              completed: false,
            })),
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
      updateItem(listId, itemId, newItem) {
        setState(
          "lists",
          (list) => list.id === listId,
          "items",
          (item) => item.id === itemId,
          produce((item) => {
            const {
              counterLimit,
              counterProgress,
              timerSeconds,
              timerProgress,
              ...rest
            } = newItem;

            // update progress
            if (
              typeof counterLimit !== "undefined" &&
              counterLimit !== item.counterLimit
            ) {
              item.counterProgress = null;
            } else if (typeof counterProgress !== "undefined") {
              item.counterProgress = counterProgress;
            }

            if (
              typeof newItem.timerSeconds !== "undefined" &&
              timerSeconds !== item.timerSeconds
            ) {
              item.timerProgress = null;
            } else if (typeof timerProgress !== "undefined") {
              item.timerProgress = timerProgress;
            }
            //

            if (counterLimit === "0") {
              item.counterLimit = null;
            } else if (typeof counterLimit !== "undefined") {
              item.counterLimit = counterLimit;
            }

            if (timerSeconds === "0") {
              item.timerSeconds = null;
            } else if (typeof newItem.timerSeconds !== "undefined") {
              item.timerSeconds = newItem.timerSeconds;
            }

            Object.assign(item, rest);

            if (newItem.completed === false) {
              if (item.timerSeconds) {
                item.timerProgress = null;
              }

              if (item.counterType === "limited") {
                item.counterProgress = null;
              }
            } else if (newItem.completed === true) {
              if (item.timerSeconds) {
                item.timerProgress = parseInt(item.timerSeconds);
              }

              if (item.counterType === "limited" && item.counterLimit) {
                item.counterProgress = parseInt(item.counterLimit);
              }
            } else {
              item.completed = isCompleted(item);
            }
          }),
        );
      },
      findItem(listId, itemId) {
        const list = state.lists.find(({ id }) => id === listId);
        if (list) {
          const index = list.items.findIndex(({ id }) => id === itemId);
          if (index !== -1) {
            return { data: list.items[index], index };
          }
        }

        return undefined;
      },
    },
  ];

  return value;
};
