import type { IList, IStoreActions } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { minLength, useForm } from "../../lib/form";

export const NewListForm: Component<{
  onSubmit: IStoreActions["add"];
  buttonLabel?: string;
  list?: IList;
}> = (props) => {
  const fieldNames = ["name", "description"] as const;
  const {
    initFormInput: _initFormInput,
    initForm: _initForm,
    errors,
  } = useForm({
    initialValues: {
      name: props.list?.name || "",
      description: props.list?.description || "",
    },
    fieldNames,
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
        <button class="buttonPrimary submit" type="submit">
          {props.buttonLabel || "Submit"}
        </button>
        <div class="cancel">
          <A href="/">Cancel</A>
        </div>
      </div>
    </form>
  );
};
