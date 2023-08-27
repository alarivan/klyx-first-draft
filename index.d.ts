/// <reference types="dom-screen-wake-lock" />
import type { IValidatorFn } from "./src/lib/form";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      _initForm: (ref: HTMLFormElement) => void;
      _initFormInput: Array<IValidatorFn> | boolean;
      _sortable: boolean;
    }
  }
}
