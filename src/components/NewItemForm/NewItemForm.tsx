import type { IValidatorFn } from "../../lib/form";
import type { IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useForm } from "../../lib/form";

export const NewItemForm: Component<{
  listId: string;
  onSubmit: (values: IListItemDataObject) => void;
}> = (props) => {
  const fieldNamesConst = ["name", "description"] as const;
  const fieldNames = fieldNamesConst as unknown as string[];
  const {
    validate: _validate,
    formSubmit: _formSubmit,
    errors,
  } = useForm({
    fieldNames,
    errorClass: "err",
  });

  const submitForm = () => (e: HTMLFormElement) => {
    const elements = e.elements as unknown as {
      name: HTMLInputElement;
      description: HTMLTextAreaElement;
    };
    const values = fieldNamesConst.reduce((acc, name) => {
      if (elements[name].value) {
        acc[name] = elements[name].value;
      }
      return acc;
    }, {} as IListItemDataObject);

    props.onSubmit(values);
  };

  const lg: IValidatorFn = (r) => {
    if (r.value.length < 3) {
      return `${r.name} should be longer than 3`;
    }
    return undefined;
  };

  return (
    <form use:_formSubmit={submitForm()}>
      <div class="field-block">
        <input
          name="name"
          type="text"
          placeholder="Item name"
          required
          use:_validate={[lg]}
        />
        <Show when={errors.name}>{errors.name}</Show>
      </div>
      <div class="field-block">
        <textarea
          name="description"
          aria-label="item description"
          rows="3"
          use:_validate={[lg]}
        />
        <Show when={errors.description}>{errors.description}</Show>
      </div>
      <button type="submit">Add item</button>
      <A href={`/list/${props.listId}`}>Cancel</A>
    </form>
  );
};
