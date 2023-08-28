import type { IStore } from "../../store/types";

import {
  LOCAL_STORAGE_BACKUP_STORE_KEY,
  LOCAL_STORAGE_STORE_KEY,
} from "../../store";

export function restoreFromBackup(store: IStore) {
  const currentStore = localStorage.getItem(LOCAL_STORAGE_STORE_KEY);
  if (currentStore) {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_STORE_KEY, currentStore);
  }
  localStorage.setItem(LOCAL_STORAGE_STORE_KEY, JSON.stringify(store));
}

export function swapCurrentStoreWithBackup() {
  const currentStore = localStorage.getItem(LOCAL_STORAGE_STORE_KEY);
  const currentBackuptStore = localStorage.getItem(
    LOCAL_STORAGE_BACKUP_STORE_KEY,
  );

  if (currentStore && currentBackuptStore) {
    localStorage.setItem(LOCAL_STORAGE_BACKUP_STORE_KEY, currentStore);
    localStorage.setItem(LOCAL_STORAGE_STORE_KEY, currentBackuptStore);
    return true;
  }

  return false;
}
