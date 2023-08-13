import type {
  ExcludeFromTypeInference,
  IFormErrorRecord,
  IFormFieldRecord,
  IFormInputElement,
  IValidatorFn,
} from "./types";

import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";

function checkValidity(element: IFormInputElement) {
  element.setCustomValidity("");
  element.checkValidity();

  return element.validationMessage;
}

function checkCustomValidity(
  element: IFormInputElement,
  validators: IValidatorFn[],
) {
  for (const validator of validators) {
    const text = validator(element);
    if (text) {
      return text;
    }
  }

  return "";
}

function getInputError(
  element: IFormInputElement,
  validators: IValidatorFn[] = [],
) {
  let error = checkValidity(element);

  if (!error) {
    error = checkCustomValidity(element, validators);
  }

  return error;
}

export function useForm<T extends string>({
  fieldNames,
  errorClass,
}: {
  fieldNames: readonly T[];
  errorClass: string;
}) {
  const [errors, setErrors] = createStore<
    IFormErrorRecord<ExcludeFromTypeInference<T>>
  >({});
  const fields: IFormFieldRecord<T> = {} as IFormFieldRecord<T>;
  const [values, setValues] = createSignal<
    Partial<Record<ExcludeFromTypeInference<T>, string>>
  >({});

  const initFormInput = (
    ref: IFormInputElement,
    accessor: () => Array<IValidatorFn> | boolean,
  ) => {
    const accessorValue = accessor();
    const validators = Array.isArray(accessorValue) ? accessorValue : [];
    const name = ref.name as ExcludeFromTypeInference<T>;

    const config = { element: ref, validators };
    fields[name] = config;
    setValues((v) => ({ ...v, [name]: ref.value }));

    ref.onblur = () => {
      const message = getInputError(ref, validators);
      if (message) {
        errorClass && ref.classList.toggle(errorClass, true);
        setErrors({ [name]: message } as typeof errors);
      }
    };
    ref.oninput = () => {
      setValues((v) => ({ ...v, [name]: ref.value }));
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
          const { element, validators } = field;
          const message = getInputError(element, validators);

          if (message) {
            setErrors({ [element.name]: message } as typeof errors);
            errorClass && element.classList.toggle(errorClass, true);
          }

          if (!errored && message) {
            element.focus();
            errored = true;
          }
        }
      }

      !errored && callback(ref);
    };
  };

  return { initFormInput, formSubmit, errors, values };
}
