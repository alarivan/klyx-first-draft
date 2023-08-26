import type { IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { Show } from "solid-js";

import { useForm } from "../../lib/form";

import styles from "./TimerForm.module.css";

export const TimerForm: Component<{
  onSubmit: (values: {
    timerSeconds: IListItemDataObject["timerSeconds"];
  }) => void;
  timerSeconds: IListItemDataObject["timerSeconds"];
}> = (props) => {
  const {
    initFormInput: _initFormInput,
    initForm: _initForm,
    errors,
  } = useForm({
    initialValues: {
      timerSeconds: props.timerSeconds || "0",
    },

    errorClass: "error",
  });

  const onFormSubmit = (e: HTMLFormElement) => {
    const elements = e.elements as unknown as {
      timerSeconds: HTMLInputElement;
    };

    const element = elements.timerSeconds;
    props.onSubmit({ timerSeconds: element.value });
  };

  return (
    <div class={styles.container}>
      <form use:_initForm={onFormSubmit}>
        <div class="inputGroup">
          <label for="timerSeconds">Timer (seconds)</label>
          <div class={styles.timerInput}>
            <input
              use:_initFormInput
              id="timerSeconds"
              name="timerSeconds"
              max={3599}
              min={0}
              type="number"
            />

            <button type="submit" class="action action__secondary">
              Update timer
            </button>
          </div>
          <Show when={errors.timerSeconds}>
            <div class="inputError">{errors.timerSeconds}</div>
          </Show>
        </div>
      </form>
    </div>
  );
};
