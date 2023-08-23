import type { IList, IListItem } from "../../store/types";
import type { Component } from "solid-js";

import { createEffect, on } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./PlayTimer.module.css";

export const PlayTimer: Component<{
  goNext: () => void;
  list: IList;
  item: IListItem;
}> = (props) => {
  const [_, actions] = useStoreContext();

  const timerProgress = () => props.item.timerProgress || 0;
  const timerSeconds = () =>
    props.item.timerSeconds ? parseInt(props.item.timerSeconds) : 0;

  let timer: NodeJS.Timer | undefined;

  const clearTimer = () => {
    if (timer) {
      clearInterval(timer);
    }
  };

  const resetTimer = () => {
    actions.updateItem(props.list.id, props.item.id, {
      timerProgress: 0,
    });
    clearTimer();
  };

  const startTimer = () => {
    clearTimer();

    if (timerProgress() !== timerSeconds()) {
      timer = setInterval(() => {
        if (timerProgress() < timerSeconds()) {
          actions.updateItem(props.list.id, props.item.id, {
            timerProgress: timerProgress() + 1,
          });
        } else {
          clearTimer();
          if (props.item.timerAutoswitch) {
            props.goNext();
          }
        }
      }, 1000);
    }
  };

  const toggleAutoswitch = () => {
    actions.updateItem(props.list.id, props.item.id, {
      timerAutoswitch: !props.item.timerAutoswitch,
    });
  };

  const toggleAutostart = () => {
    actions.updateItem(props.list.id, props.item.id, {
      timerAutostart: !props.item.timerAutostart,
    });
  };

  createEffect(
    on(
      () => props.item.id,
      () => {
        if (props.item.timerAutostart) {
          startTimer();
        }
      },
    ),
  );

  return (
    <div>
      <div class={styles.container}>
        <div>
          {timerProgress()}/{timerSeconds()}
        </div>
        <button type="button" onClick={resetTimer}>
          Reset timer
        </button>
        <button type="button" onClick={startTimer}>
          Start timer
        </button>
        <button type="button" onClick={clearTimer}>
          Pause timer
        </button>
      </div>

      <div class={`inputGroup inputGroup__checkbox`}>
        <input
          checked={props.item.timerAutoswitch}
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
          checked={props.item.timerAutostart}
          onChange={toggleAutostart}
          id="timerAutoStart"
          type="checkbox"
        />
        <label for="timerAutoStart">Automatically start timer</label>
      </div>
    </div>
  );
};
