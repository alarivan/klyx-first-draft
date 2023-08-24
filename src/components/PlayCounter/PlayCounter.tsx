import type { Component } from "solid-js";

import { FiMinus, FiPlus } from "solid-icons/fi";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";
import { useListItemGuardContext } from "../ListItemGuard";

import styles from "./PlayCounter.module.css";

export const PlayCounter: Component<{
  goNext: () => void;
}> = (props) => {
  const guard = useListItemGuardContext();
  const item = () => guard().item.data;

  const [_, actions] = useStoreContext();
  const progress = () => item().counterProgress || 0;

  const state = () => {
    if (item().counterType === "limited") {
      return `${progress()}/${item().counterLimit}`;
    }
    return progress();
  };

  const compareToLimit = (
    n: number,
    cond = (a: number, limit: number) => a >= limit,
  ) => {
    const counterLimit = item().counterLimit;
    return counterLimit !== null && cond(n, parseInt(counterLimit));
  };

  const disableDecrease = () => progress() <= 0;
  const disableIncrease = () => compareToLimit(progress());

  const increase = () => {
    const next = progress() + 1;
    if (compareToLimit(next)) {
      if (compareToLimit(next, (next, l) => next <= l)) {
        actions.updateItem(guard().list.id, item().id, {
          counterProgress: next,
        });
      }

      if (item().counterAutoswitch) {
        props.goNext();
      }
    } else {
      actions.updateItem(guard().list.id, item().id, {
        counterProgress: next,
      });
    }
  };
  const decrease = () => {
    const next = progress() - 1;
    if (next >= 0) {
      actions.updateItem(guard().list.id, item().id, {
        counterProgress: next,
      });
    }
  };

  const handleNextOnComplete = () => {
    actions.updateItem(guard().list.id, item().id, {
      counterAutoswitch: !item().counterAutoswitch,
    });
  };

  const handleReset = () => {
    actions.updateItem(guard().list.id, item().id, {
      counterProgress: 0,
    });
  };

  return (
    <div class={styles.container}>
      <div class={styles.main}>
        <button
          aria-label="Decrease counter"
          class="action action__secondary"
          disabled={disableDecrease()}
          type="button"
          onClick={decrease}
        >
          <FiMinus size={32} />
        </button>
        <div class={styles.state}> {state()}</div>
        <button
          aria-label="Increase counter"
          class="action action__secondary"
          disabled={disableIncrease()}
          type="button"
          onClick={increase}
        >
          <FiPlus size={32} />
        </button>
      </div>
      <div class={styles.extra}>
        <button
          onClick={handleReset}
          type="button"
          class="action action__secondary"
        >
          Reset counter
        </button>
        <Show when={item().counterType === "limited"}>
          <div
            class={`inputGroup inputGroup__checkbox ${styles.nextOnComplete}`}
          >
            <input
              checked={item().counterAutoswitch}
              onChange={handleNextOnComplete}
              id="nextOnComplete"
              type="checkbox"
            />
            <label for="nextOnComplete">
              Automatically go next when counter is completed
            </label>
          </div>
        </Show>
      </div>
    </div>
  );
};
