import type { IValidatorFn } from "./src/lib/form";

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      _formSubmit: (ref: HTMLFormElement) => void;
      _validate: Array<IValidatorFn> | boolean;
    }
  }
}
