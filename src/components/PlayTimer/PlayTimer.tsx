import type { IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { useBeforeLeave } from "@solidjs/router";
import { createEffect, on } from "solid-js";

import { useStoreContext } from "../../store/context";
import { useListItemGuardContext } from "../ListItemGuard";
import { TimerBar } from "../TimerBar";
import { TimerForm } from "../TimerForm";

import styles from "./PlayTimer.module.css";

export const PlayTimer: Component<{
  goNext: () => void;
}> = (props) => {
  const guard = useListItemGuardContext();
  const [_, actions] = useStoreContext();
  const item = () => guard().item.data;

  const timerProgress = () => item().timerProgress || 0;
  const timerSeconds = () => {
    const ts = item().timerSeconds;
    return ts ? parseInt(ts) : 0;
  };

  let timer: NodeJS.Timeout | undefined;

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  const resetTimer = () => {
    actions.updateItem(guard().list.id, item().id, {
      timerProgress: 0,
    });
    clearTimer();
  };

  const startTimer = () => {
    clearTimer();

    if (timerProgress() !== timerSeconds()) {
      timer = setInterval(() => {
        if (timerProgress() < timerSeconds()) {
          actions.updateItem(guard().list.id, item().id, {
            timerProgress: timerProgress() + 1,
          });
        } else {
          clearTimer();
          if (item().timerAutoswitch) {
            props.goNext();
          }
        }
      }, 1000);
    }
  };

  const toggleAutoswitch = () => {
    actions.updateItem(guard().list.id, item().id, {
      timerAutoswitch: !item().timerAutoswitch,
    });
  };

  const toggleAutostart = () => {
    actions.updateItem(guard().list.id, item().id, {
      timerAutostart: !item().timerAutostart,
    });
  };

  createEffect(
    on(
      () => item().id,
      () => {
        if (item().timerAutostart) {
          startTimer();
        }
      },
    ),
  );
  useBeforeLeave(() => {
    clearTimer();
  });

  const saveTimerSeconds = (values: {
    timerSeconds: IListItemDataObject["timerSeconds"];
  }) => {
    actions.updateItem(guard().list.id, item().id, values);
    clearTimer();
  };

  return (
    <div class={styles.container}>
      <h3>Timer</h3>
      <div class={styles.main}>
        <div class={styles.timerForm}>
          <TimerForm
            onSubmit={saveTimerSeconds}
            timerSeconds={item().timerSeconds}
          />
        </div>
        <TimerBar progress={timerProgress()} total={timerSeconds()} />
      </div>
      <div class={styles.actions}>
        <button
          type="button"
          class="action action__secondary"
          onClick={resetTimer}
        >
          Reset timer
        </button>
        <button
          type="button"
          class="action action__secondary"
          onClick={startTimer}
        >
          Start timer
        </button>
        <button
          type="button"
          class="action action__secondary"
          onClick={clearTimer}
        >
          Pause timer
        </button>
      </div>

      <div class={styles.checkboxes}>
        <div class={`inputGroup inputGroup__checkbox`}>
          <input
            checked={item().timerAutoswitch}
            onChange={toggleAutoswitch}
            id="nextOnComplete"
            type="checkbox"
          />
          <label for="nextOnComplete">
            Automatically go next when timer is finished
          </label>
        </div>
        <div class={`inputGroup inputGroup__checkbox`}>
          <input
            checked={item().timerAutostart}
            onChange={toggleAutostart}
            id="timerAutoStart"
            type="checkbox"
          />
          <label for="timerAutoStart">Automatically start timer</label>
        </div>
      </div>
    </div>
  );
};
