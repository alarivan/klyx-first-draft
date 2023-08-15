import type { IValidatorFn } from "../../lib/form";
import type { IList, IStoreActions } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useForm } from "../../lib/form";

export const NewListForm: Component<{
  onSubmit: IStoreActions["add"];
}> = (props) => {
  const fieldNames = ["name", "description"] as const;
  const {
    initFormInput: _initFormInput,
    formSubmit: _formSubmit,
    errors,
  } = useForm({
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

  const lg: IValidatorFn = (r) => {
    if (r.value.length < 3) {
      return `${r.name} should be longer than 3`;
    }
    return undefined;
  };

  return (
    <form use:_formSubmit={submitForm}>
      <div class="inputGroup">
        <input
          name="name"
          type="text"
          placeholder="List name"
          required
          use:_initFormInput={[lg]}
        />
        <Show when={errors.name}>
          <div class="inputError">{errors.name}</div>
        </Show>
      </div>
      <div class="inputGroup">
        <textarea
          name="description"
          aria-label="list description"
          rows="3"
          use:_initFormInput={[lg]}
        />
      </div>
      <div class="formActions">
        <button class="buttonPrimary submit" type="submit">
          Add list
        </button>
        <div class="cancel">
          <A href="/">Cancel</A>
        </div>
      </div>
    </form>
  );
};