import { COUNTER_TYPE_ENUM } from "./types";

export const LOCAL_STORAGE_STORE_KEY = "klyx-store";
export const LOCAL_STORAGE_BACKUP_STORE_KEY = "klyx-store-1";

export const LIST_ITEM_DEFAULT_VALUES = {
  name: null,
  description: null,
  completed: false,
  counterLimit: null,
  counterType: COUNTER_TYPE_ENUM.NONE,
  counterAutoswitch: true,
  counterProgress: null,
  timerSeconds: null,
  timerAutoswitch: true,
  timerAutostart: false,
  timerProgress: null,
};
