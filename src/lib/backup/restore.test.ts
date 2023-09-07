import {
  LOCAL_STORAGE_BACKUP_STORE_KEY,
  LOCAL_STORAGE_STORE_KEY,
} from "../../store";
import { createListWithItems } from "../../store/helpers";

import { INITIAL_STORE_STATE } from "./initialStoreState";
import {
  restoreFromBackup,
  restoreToInitalState,
  swapCurrentStoreWithBackup,
} from "./restore";

const list = () =>
  createListWithItems({ name: "list1", description: "list1desc" }, [
    { name: "item1", description: "item1desc" },
  ]);
const store = { lists: [list()] };

describe("restore", () => {
  beforeEach(() => {
    global.localStorage.clear();
  });
  describe("Restore", () => {
    describe("when store doesn't exist in local storage", () => {
      it("restores from backup & doesn't save backup local storage store", () => {
        restoreFromBackup(store);
        expect(global.localStorage.getItem(LOCAL_STORAGE_STORE_KEY)).toEqual(
          JSON.stringify(store),
        );
        expect(
          global.localStorage.getItem(LOCAL_STORAGE_BACKUP_STORE_KEY),
        ).toEqual(null);
      });
    });

    describe("when store exists in local storage", () => {
      beforeEach(() => {
        global.localStorage.setItem(
          LOCAL_STORAGE_STORE_KEY,
          JSON.stringify(store),
        );
      });

      it("restores from backup & saves previous store", () => {
        const newStore = { lists: [list()] };
        restoreFromBackup(newStore);

        expect(global.localStorage.getItem(LOCAL_STORAGE_STORE_KEY)).toEqual(
          JSON.stringify(newStore),
        );
        expect(
          global.localStorage.getItem(LOCAL_STORAGE_BACKUP_STORE_KEY),
        ).toEqual(JSON.stringify(store));
      });

      it("resetores to the initial state", () => {
        restoreToInitalState();

        expect(global.localStorage.getItem(LOCAL_STORAGE_STORE_KEY)).toEqual(
          JSON.stringify(INITIAL_STORE_STATE),
        );
        expect(
          global.localStorage.getItem(LOCAL_STORAGE_BACKUP_STORE_KEY),
        ).toEqual(JSON.stringify(store));
      });
    });
  });

  describe("swapCurrentStoreWithBackup", () => {
    describe("when both stores exist", () => {
      const store1 = { lists: [list()] };
      const store2 = { lists: [list()] };
      beforeEach(() => {
        global.localStorage.setItem(
          LOCAL_STORAGE_STORE_KEY,
          JSON.stringify(store1),
        );
        global.localStorage.setItem(
          LOCAL_STORAGE_BACKUP_STORE_KEY,
          JSON.stringify(store2),
        );
      });

      it("swaps stores and returns true", () => {
        expect(swapCurrentStoreWithBackup()).toEqual(true);

        expect(global.localStorage.getItem(LOCAL_STORAGE_STORE_KEY)).toEqual(
          JSON.stringify(store2),
        );
        expect(
          global.localStorage.getItem(LOCAL_STORAGE_BACKUP_STORE_KEY),
        ).toEqual(JSON.stringify(store1));
      });
    });

    describe("when store doesn't exist", () => {
      beforeEach(() => {
        global.localStorage.setItem(
          LOCAL_STORAGE_STORE_KEY,
          JSON.stringify(store),
        );
      });

      it("doesn't change localStorage and returns false", () => {
        expect(swapCurrentStoreWithBackup()).toEqual(false);

        expect(global.localStorage.getItem(LOCAL_STORAGE_STORE_KEY)).toEqual(
          JSON.stringify(store),
        );
        expect(
          global.localStorage.getItem(LOCAL_STORAGE_BACKUP_STORE_KEY),
        ).toEqual(null);
      });
    });
  });
});
