import type { IValidatorFn } from "./types";

export const minLength = (num: number): IValidatorFn => {
  return (element) => {
    if (element.value.length < num) {
      return `${element.name} should be longer than ${num}`;
    }
    return undefined;
  };
};
