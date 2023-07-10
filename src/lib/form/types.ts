// @see https://github.com/microsoft/TypeScript/issues/14829#issuecomment-504042546
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExcludeFromTypeInference<T> = [T][T extends any ? 0 : never];

export type IFormInputElement = HTMLInputElement | HTMLTextAreaElement;

export type IValidatorFn = (
  element: IFormInputElement,
) => Promise<string | undefined>;

export type IFormField = {
  element: IFormInputElement;
  validators: Array<IValidatorFn>;
};

export type IFormFieldRecord<T extends string> = Partial<Record<T, IFormField>>;

export type IFormErrorRecord<T extends string> = Partial<
  Record<T, string | undefined>
>;
