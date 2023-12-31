import type {
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
  initialValues,
  errorClass,
}: {
  initialValues: Record<T, string | boolean>;
  errorClass: string;
}) {
  const fieldNames: T[] = Object.keys(initialValues) as T[];
  const fields: IFormFieldRecord<T> = {} as IFormFieldRecord<T>;
  const [errors, setErrors] = createStore<IFormErrorRecord<T>>({});
  const [values, setValues] =
    createSignal<Record<T, string | boolean>>(initialValues);

  const onInput = (name: T, ref: IFormInputElement) => {
    let value: string | boolean = ref.value;
    if (ref.type === "checkbox") {
      value = (ref as HTMLInputElement).checked;
    }

    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) {
      setErrors({ [name]: undefined } as typeof errors);
      errorClass && ref.classList.toggle(errorClass, false);
    }
  };

  const setErrorMessage = (name: T) => {
    const field = fields?.[name];
    if (field?.element && field?.validators) {
      const { element, validators } = field;
      const message = getInputError(element, validators);
      if (message) {
        errorClass && element.classList.toggle(errorClass, true);
        setErrors({ [element.name]: message } as typeof errors);
      }
      return message;
    }
  };

  const initInputElement = (name: T, element: IFormInputElement) => {
    const initialValue = initialValues?.[name];
    let value = initialValue;
    if (element.type === "checkbox") {
      const checkboxElement = element as HTMLInputElement;
      if (typeof initialValue === "boolean") {
        value = initialValue || checkboxElement.checked || false;
        checkboxElement.checked = value;
      }
    } else if (typeof initialValue === "string") {
      value = initialValue || element.value || "";
      element.value = value;
    }
    setValues((v) => ({
      ...v,
      [name]: value,
    }));
    element.oninput = () => onInput(name, element);
    element.onblur = () => setErrorMessage(name);
  };

  const initFormInput = (
    ref: IFormInputElement,
    accessor: () => Array<IValidatorFn> | boolean,
  ) => {
    const accessorValue = accessor();
    const validators = Array.isArray(accessorValue) ? accessorValue : [];
    const name = ref.name as T;

    const elementRef = fields?.[name]?.element;
    if (elementRef !== ref) {
      fields[name] = { element: ref, validators };
      initInputElement(name, ref);
    } else {
      fields[name] = { ...fields[name], validators };
    }
  };

  const initForm = (
    ref: HTMLFormElement,
    accessor: () => (ref: HTMLFormElement) => void,
  ) => {
    const callback = accessor();

    const formElements = ref.elements as Record<T, IFormInputElement>;
    for (const name of fieldNames) {
      const elementRef = formElements[name];
      const existingRef = fields?.[name]?.element;

      if (elementRef !== existingRef) {
        fields[name] = { element: elementRef, validators: [] };

        initInputElement(name, elementRef);
      }
    }

    ref.setAttribute("novalidate", "");
    ref.onsubmit = async (e) => {
      e.preventDefault();
      let errored = false;

      const formElements = ref.elements as Record<T, IFormInputElement>;
      for (const name of fieldNames) {
        const elementRef = formElements[name];
        const field = fields[name];
        if (elementRef && field) {
          const { element } = field;

          const message = setErrorMessage(name);

          if (!errored && message) {
            element.focus();
            errored = true;
          }
        }
      }

      !errored && callback(ref);
    };
  };

  const setValue = (name: T, newValue: string | boolean) => {
    const element = fields[name]?.element;
    if (element) {
      let value = newValue;
      if (element.type === "checkbox") {
        const checkboxElement = element as HTMLInputElement;
        if (typeof newValue === "boolean") {
          value = newValue;
          checkboxElement.checked = value;
        }
      } else if (typeof newValue === "string") {
        value = newValue;
        element.value = value;
      }
      setValues((v) => ({
        ...v,
        [name]: value,
      }));
    }
  };

  return { initFormInput, initForm, errors, values, setValue };
}
