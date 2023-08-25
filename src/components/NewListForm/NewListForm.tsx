import type { IList, IStoreActions } from "../../store/types";
import type { Component } from "solid-js";

import { Show } from "solid-js";

import { minLength, useForm } from "../../lib/form";

export const NewListForm: Component<{
  onSubmit: IStoreActions["add"];
  onCancel: () => void;
  buttonLabel?: string;
  list?: IList;
}> = (props) => {
  const initialValues = {
    name: props.list?.name || "",
    description: props.list?.description || "",
  };
  const fieldNames = Object.keys(initialValues) as unknown as Array<
    keyof typeof initialValues
  >;
  const {
    initFormInput: _initFormInput,
    initForm: _initForm,
    errors,
  } = useForm({
    initialValues,
    errorClass: "err",
  });

  const submitForm = (e: HTMLFormElement) => {
    const elements = e.elements as unknown as {
      name: HTMLInputElement;
      description: HTMLTextAreaElement;
    };
    const values: Pick<IList, "name" | "description"> = fieldNames.reduce(
      (acc, name) => {
        if (elements[name].value) {
          acc[name] = elements[name].value;
        }
        return acc;
      },
      {} as Pick<IList, "name" | "description">,
    );
    props.onSubmit(values);
  };

  return (
    <form use:_initForm={submitForm}>
      <div class="inputGroup">
        <label for="name">List name*</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          use:_initFormInput={[minLength(3)]}
        />
        <Show when={errors.name}>
          <div class="inputError">{errors.name}</div>
        </Show>
      </div>
      <div class="inputGroup">
        <label for="description">Description</label>
        <textarea
          id="description"
          name="description"
          aria-label="list description"
          rows="3"
        />
      </div>
      <div class="formActions">
        <button class="action action__fancy submit" type="submit">
          {props.buttonLabel || "Submit"}
        </button>
        <button
          onClick={props.onCancel}
          class="action action__secondary"
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
