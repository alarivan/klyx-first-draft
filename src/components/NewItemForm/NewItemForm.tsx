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
  const fieldNames = [
    "name",
    "description",
    "counterType",
    "counterLimit",
    "timerSeconds",
  ] as const;
  const {
    initFormInput: _initFormInput,
    formSubmit: _formSubmit,
    errors,
    values,
  } = useForm({
    fieldNames,
    errorClass: "err",
  });

  const submitForm = (e: HTMLFormElement) => {
    const elements = e.elements as unknown as {
      name: HTMLInputElement;
      description: HTMLTextAreaElement;
      counterType: HTMLSelectElement;
      counterLimit?: HTMLInputElement;
      timerSeconds: HTMLInputElement;
    };
    const values = fieldNames.reduce((acc, name) => {
      if (elements?.[name]?.value) {
        if (name === "counterType") {
          acc[name] = elements[name]
            .value as IListItemDataObject["counterType"];
        } else if (name === "counterLimit") {
          acc[name] = elements?.[name]?.value;
        } else {
          acc[name] = elements[name].value;
        }
      }
      return acc;
    }, {} as IListItemDataObject);

    props.onSubmit(values);
  };

  const minLength = (num: number): IValidatorFn => {
    return (element) => {
      if (element.value.length < num) {
        return `${element.name} should be longer than ${num}`;
      }
      return undefined;
    };
  };

  return (
    <form use:_formSubmit={submitForm}>
      <div class="field-block">
        <label for="name">Item name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Item name"
          required
          use:_initFormInput={[minLength(3)]}
        />
        <Show when={errors.name}>{errors.name}</Show>
      </div>
      <div class="field-block">
        <label for="description">Description</label>
        <textarea
          id="description"
          name="description"
          aria-label="item description"
          rows="3"
          use:_initFormInput
        />
      </div>
      <div class="field-block">
        <label for="counterType">Counter</label>
        <select id="counterType" name="counterType" use:_initFormInput>
          <option value="none">None</option>
          <option value="limited">Limited</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>
      <Show when={values().counterType === "limited"}>
        <label for="counterLimit">Counter limit</label>
        <div class="field-block">
          <input
            id="counterLimit"
            name="counterLimit"
            type="number"
            value="0"
            min="0"
            use:_initFormInput
          />
        </div>
      </Show>
      <div class="field-block">
        <label for="timerSeconds">Timer</label>
        <input
          id="timerSeconds"
          name="timerSeconds"
          type="number"
          value="0"
          use:_initFormInput
        />
      </div>
      <button type="submit">Add item</button>
      <A href={`/list/${props.listId}`}>Cancel</A>
    </form>
  );
};
