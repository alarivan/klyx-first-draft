import type { IValidatorFn } from "../../lib/form";
import type { IListItemCreateObject } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useForm } from "../../lib/form";

import styles from "./NewItemForm.module.css";

export const NewItemForm: Component<{
  listId: string;
  onSubmit: (values: IListItemCreateObject) => void;
}> = (props) => {
  const fieldNamesConst = ["name", "description"] as const;
  const fieldNames = fieldNamesConst as unknown as string[];
  const { validate, formSubmit, errors } = useForm({
    fieldNames,
    errorClass: "err",
  });

  const submitForm = (e: HTMLFormElement) => {
    const elements = e.elements as unknown as {
      name: HTMLInputElement;
      description: HTMLTextAreaElement;
    };
    const values = fieldNamesConst.reduce((acc, name) => {
      if (elements[name].value) {
        acc[name] = elements[name].value;
      }
      return acc;
    }, {} as IListItemCreateObject);

    props.onSubmit(values);
  };

  const lg: IValidatorFn = (r) => {
    if (r.value.length < 3) {
      return `${r.name} should be longer than 3`;
    }
    return undefined;
  };

  return (
    <form use:formSubmit={submitForm}>
      <div class="field-block">
        <input
          name="name"
          type="text"
          placeholder="Item name"
          required
          use:validate={[lg]}
        />
        <Show when={errors.name}>{errors.name}</Show>
      </div>
      <div class="field-block">
        <textarea
          name="description"
          aria-label="item description"
          rows="3"
          use:validate={[lg]}
        />
        <Show when={errors.description}>{errors.description}</Show>
      </div>
      <button type="submit">Add item</button>
      <A href={`/list/${props.listId}`}>Cancel</A>
    </form>
  );
};
