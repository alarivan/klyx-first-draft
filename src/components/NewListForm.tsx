import { Component, Show } from "solid-js";

import { IValidatorFn, useForm } from "../lib/form";
import { IList, IStoreActions } from "../store/types";

import styles from "./NewListForm.module.css";

export const NewListForm: Component<{
  onSubmit: IStoreActions["add"];
  onCancel: () => void;
}> = (props) => {

  const fieldNamesConst = ["name", "description"] as const;
  const fieldNames = fieldNamesConst as unknown as string[];
  const { validate, formSubmit, errors } = useForm({
    fieldNames,
    errorClass: "err",
  });

  const submitForm = (e: HTMLFormElement) => {
    const elements = e.elements as unknown as {name: HTMLInputElement, description: HTMLTextAreaElement}
    const values: Pick<IList, "name" | "description"> = fieldNamesConst.reduce((acc, name) => {
      if(elements[name].value) {
        acc[name] = elements[name].value
      }
      return acc;
    }, {} as Pick<IList, "name" | "description">)

    props.onSubmit(values);
  };

  const lg: IValidatorFn = (r) => {
    console.log(r);
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
          placeholder="List name"
          required
          use:validate={[lg]}
        />
        <Show when={errors.name}>{errors.name}</Show>
      </div>
      <div class="field-block">
        <textarea name="description" aria-label="list description" rows="3" use:validate={[lg]} />
        <Show when={errors.description}>{errors.description}</Show>
      </div>
      <button type="submit">Add list</button>
      <button type="button" onClick={() => props.onCancel()}>
        Cancel
      </button>
    </form>
  );
};
