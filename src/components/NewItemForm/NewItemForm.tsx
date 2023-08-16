import type { IListItem, IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { minLength, useForm } from "../../lib/form";

export const NewItemForm: Component<{
  listId: string;
  buttonLabel?: string;
  item?: IListItem;
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
    errorClass: "error",
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

  return (
    <form use:_formSubmit={submitForm}>
      <div class="inputGroup">
        <label for="name">Item name*</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={props.item?.name || ""}
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
          aria-label="item description"
          rows="3"
          value={props.item?.description || ""}
          use:_initFormInput
        />
      </div>
      <div class="inputGroup">
        <label for="counterType">Counter</label>
        <select
          id="counterType"
          name="counterType"
          value={props.item?.counterType || "none"}
          use:_initFormInput
        >
          <option value="none">None</option>
          <option value="limited">Limited</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>
      <Show
        when={
          values().counterType === "limited" ||
          props.item?.counterType === "limited"
        }
      >
        <label for="counterLimit">Counter limit</label>
        <div class="inputGroup">
          <input
            id="counterLimit"
            name="counterLimit"
            type="number"
            value={props.item?.counterLimit || "0"}
            min="0"
            use:_initFormInput
          />
        </div>
      </Show>
      <div class="inputGroup">
        <label for="timerSeconds">Timer</label>
        <input
          id="timerSeconds"
          name="timerSeconds"
          type="number"
          value={props.item?.timerSeconds || "0"}
          use:_initFormInput
        />
      </div>
      <div class="formActions">
        <button class="buttonPrimary submit" type="submit">
          {props.buttonLabel || "Submit"}
        </button>
        <div class="cancel">
          <A href={`/list/${props.listId}`}>Cancel</A>
        </div>
      </div>
    </form>
  );
};
