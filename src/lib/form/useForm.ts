import { SetStoreFunction, createStore } from "solid-js/store";

import {
  ExcludeFromTypeInference,
  IFormErrorRecord,
  IFormField,
  IFormFieldRecord,
  IFormInputElement,
  IValidatorFn,
} from "./types";

function checkValid<E extends SetStoreFunction<IFormErrorRecord<string>>>(
  { element, validators = [] }: IFormField,
  setErrors: E,
  errorClass: string,
) {
  return async () => {
    element.setCustomValidity("");
    element.checkValidity();
    let message = element.validationMessage;
    if (!message) {
      for (const validator of validators) {
        const text = await validator(element);
        if (text) {
          element.setCustomValidity(text);
          break;
        }
      }
      message = element.validationMessage;
    }
    if (message) {
      errorClass && element.classList.toggle(errorClass, true);
      setErrors({ [element.name]: message });
    }
  };
}

export function useForm<T extends string>({
  fieldNames,
  errorClass,
}: {
  fieldNames: T[];
  errorClass: string;
}) {
  const [errors, setErrors] = createStore<
    IFormErrorRecord<ExcludeFromTypeInference<T>>
  >({});
  const fields: IFormFieldRecord<T> = {} as IFormFieldRecord<T>;

  const validate = (
    ref: IFormInputElement,
    accessor: () => Array<IValidatorFn> | boolean,
  ) => {
    const accessorValue = accessor();
    const validators = Array.isArray(accessorValue) ? accessorValue : [];
    let config;
    const name = ref.name as ExcludeFromTypeInference<T>;
    fields[name] = config = { element: ref, validators };
    ref.onblur = checkValid(config, setErrors, errorClass);
    ref.oninput = () => {
      if (!errors[name]) return;
      setErrors({ [name]: undefined } as typeof errors);
      errorClass && ref.classList.toggle(errorClass, false);
    };
  };

  const formSubmit = (
    ref: HTMLFormElement,
    accessor: () => (ref: HTMLFormElement) => void,
  ) => {
    const callback = accessor();
    ref.setAttribute("novalidate", "");
    ref.onsubmit = async (e) => {
      e.preventDefault();
      let errored = false;

      for (const k of fieldNames) {
        const field = fields[k];
        if (field) {
          await checkValid<typeof setErrors>(field, setErrors, errorClass)();
          if (!errored && field?.element.validationMessage) {
            field.element.focus();
            errored = true;
          }
        }
      }
      !errored && callback(ref);
    };
  };

  return { validate, formSubmit, errors };
}
