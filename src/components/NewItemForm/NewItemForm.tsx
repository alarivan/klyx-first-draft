import type { IListItem, IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useForm } from "../../lib/form";
import { textareaAutoHeight as _textareaAutoHeight } from "../../lib/textareaAutoHeight";
import { COUNTER_TYPE_ENUM } from "../../store/types";

export const NewItemForm: Component<{
  listId: string;
  buttonLabel?: string;
  item?: IListItem;
  onSubmit: (values: IListItemDataObject) => void;
}> = (props) => {
  const initialValues = {
    name: props.item?.name || "",
    description: props.item?.description || "",
    counterLimit: props.item?.counterLimit || "0",
    counterType: props.item?.counterType || COUNTER_TYPE_ENUM.NONE,
    timerSeconds: props.item?.timerSeconds || "0",
    timerAutostart: props.item?.timerAutostart || false,
  };
  const fieldNames = Object.keys(initialValues) as unknown as Array<
    keyof typeof initialValues
  >;
  const {
    initFormInput: _initFormInput,
    initForm: _initForm,
    errors,
    values,
  } = useForm({
    initialValues,
    errorClass: "error",
  });

  const onFormSubmit = (e: HTMLFormElement) => {
    const elements = e.elements as unknown as {
      name: HTMLInputElement;
      description: HTMLTextAreaElement;
      counterType: HTMLSelectElement;
      counterLimit?: HTMLInputElement;
      timerSeconds: HTMLInputElement;
      timerAutostart: HTMLInputElement;
    };
    const values = fieldNames.reduce((acc, name) => {
      const element = elements?.[name];
      if (!element) return acc;

      if (name === "timerAutostart") {
        acc["timerAutostart"] = (element as HTMLInputElement).checked || false;
        return acc;
      } else if (name === "counterType") {
        acc[name] =
          (element.value as IListItemDataObject["counterType"]) ||
          COUNTER_TYPE_ENUM.NONE;
        return acc;
      } else {
        acc[name] = element.value || null;
      }

      return acc;
    }, {} as IListItemDataObject);

    props.onSubmit(values);
  };

  return (
    <form use:_initForm={onFormSubmit}>
      <div class="inputGroup">
        <label for="name">Name</label>
        <input id="name" name="name" type="text" />
      </div>
      <div class="inputGroup">
        <label for="description">Description</label>
        <textarea
          id="description"
          name="description"
          aria-label="item description"
          rows="4"
          use:_textareaAutoHeight
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
        <label for="timerSeconds">Timer (seconds)</label>
        <input
          use:_initFormInput
          id="timerSeconds"
          name="timerSeconds"
          max={3599}
          min={0}
          type="number"
        />
        <Show when={errors.timerSeconds}>
          <div class="inputError">{errors.timerSeconds}</div>
        </Show>
      </div>
      <div class="inputGroup inputGroup__checkbox">
        <input id="timerAutostart" type="checkbox" />
        <label for="timerAutostart">Automatically start timer</label>
      </div>
      <div class="formActions">
        <button class="action action__fancy submit" type="submit">
          {props.buttonLabel || "Submit"}
        </button>
        <div class="cancel">
          <A
            class="a-reset action action__secondary"
            href={`/list/${props.listId}`}
          >
            Cancel
          </A>
        </div>
      </div>
    </form>
  );
};
