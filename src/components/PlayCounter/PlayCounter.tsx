import type { IList, IListItem } from "../../store/types";
import type { Component } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { FiMinus, FiPlus } from "solid-icons/fi";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./PlayCounter.module.css";

export const PlayCounter: Component<{
  list: IList;
  item: IListItem;
  index: number;
}> = (props) => {
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();
  const progress = () => props.item.counterProgress || 0;

  const state = () => {
    if (props.item.counterType === "limited") {
      return `${progress()}/${props.item.counterLimit}`;
    }
    return progress();
  };

  const compareToLimit = (
    n: number,
    cond = (a: number, limit: number) => a >= limit,
  ) =>
    props.item.counterLimit !== null &&
    cond(n, parseInt(props.item.counterLimit));

  const disableDecrease = () => progress() <= 0;
  const disableIncrease = () => compareToLimit(progress());

  const increase = () => {
    const next = progress() + 1;
    if (compareToLimit(next)) {
      if (compareToLimit(next, (next, l) => next <= l)) {
        actions.updateItem(props.list.id, props.item.id, {
          counterProgress: next,
        });
      }

      if (props.item.counterAutoswitch) {
        const nextItem = props.list.items[props.index + 1];
        if (nextItem) {
          navigate(`/list/${props.list.id}/play/${nextItem.id}`);
        } else {
          navigate(`/list/${props.list.id}/play/done`);
        }
      }
    } else {
      actions.updateItem(props.list.id, props.item.id, {
        counterProgress: next,
      });
    }
  };
  const decrease = () => {
    const next = progress() - 1;
    if (next >= 0) {
      actions.updateItem(props.list.id, props.item.id, {
        counterProgress: next,
      });
    }
  };

  const handleNextOnComplete = () => {
    actions.updateItem(props.list.id, props.item.id, {
      counterAutoswitch: !props.item.counterAutoswitch,
    });
  };

  const handleReset = () => {
    actions.updateItem(props.list.id, props.item.id, {
      counterProgress: 0,
    });
  };

  return (
    <div class={styles.container}>
      <div class={styles.main}>
        <button
          aria-label="Decrease counter"
          class="action action_secondary"
          disabled={disableDecrease()}
          type="button"
          onClick={decrease}
        >
          <FiMinus size={32} />
        </button>
        <div class={styles.state}> {state()}</div>
        <button
          aria-label="Increase counter"
          class="action action_secondary"
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
          class="action action_secondary"
        >
          Reset counter
        </button>
        <Show when={props.item.counterType === "limited"}>
          <div class={styles.nextOnComplete}>
            <input
              checked={props.item.counterAutoswitch}
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
