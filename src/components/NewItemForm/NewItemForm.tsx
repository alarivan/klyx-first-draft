import type { IListItem, IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useForm } from "../../lib/form";

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
    initForm: _initForm,
    errors,
    values,
  } = useForm({
    initialValues: {
      name: props.item?.name || "",
      description: props.item?.description || "",
      counterLimit: props.item?.counterLimit || "0",
      counterType: props.item?.counterType || "none",
      timerSeconds: props.item?.timerSeconds || "0",
    },
    fieldNames,
    errorClass: "error",
  });

  const onFormSubmit = (e: HTMLFormElement) => {
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
      } else {
        if (name === "counterType") {
          acc[name] = "none";
        } else {
          acc[name] = null;
        }
      }

      return acc;
    }, {} as IListItemDataObject);

    props.onSubmit(values);
  };

  return (
    <form use:_initForm={onFormSubmit}>
      <div class="inputGroup">
        <label for="name">Item name*</label>
        <input id="name" name="name" type="text" />
      </div>
      <div class="inputGroup">
        <label for="description">Description</label>
        <textarea
          id="description"
          name="description"
          aria-label="item description"
          rows="3"
        />
      </div>
      <div class="inputGroup">
        <label for="counterType">Counter</label>
        <select id="counterType" name="counterType">
          <option value="none">None</option>
          <option value="limited">Limited</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>
      <Show when={values().counterType === "limited"}>
        <label for="counterLimit">Counter limit</label>
        <div class="inputGroup">
          <input
            id="counterLimit"
            name="counterLimit"
            type="number"
            min="1"
            use:_initFormInput
          />
          <Show when={errors.counterLimit}>
            <div class="inputError">{errors.counterLimit}</div>
          </Show>
        </div>
      </Show>
      <div class="inputGroup">
        <label for="timerSeconds">Timer</label>
        <input
          use:_initFormInput
          id="timerSeconds"
          name="timerSeconds"
          type="number"
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
