import type { IValidatorFn } from "./src/lib/form";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      formSubmit: (ref: HTMLFormElement) => void;
      validate: Array<IValidatorFn> | boolean;
    }
  }
}
