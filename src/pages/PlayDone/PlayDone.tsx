import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useListGuardContext } from "../../components/ListGuard";

import styles from "./PlayDone.module.css";

export const PlayDone: Component = () => {
  const list = useListGuardContext();
  const itemsLength = () => list().items.length;

  return (
    <div class={styles.container}>
      <h1>Done</h1>
      <b>
        {itemsLength()}/{itemsLength()}
      </b>
      <h2>{list().name}</h2>
      <Show when={list().description}>
        <p>{list().description}</p>
      </Show>
      <div class={styles.actions}>
        <A class="a-reset action a-reset action__primary" href="/">
          Go home
        </A>
        <br />
        <A
          class="a-reset action a-reset action__primary"
          href={`/list/${list().id}`}
        >
          Go to list
        </A>
        <br />
        <A
          class="a-reset action a-reset action__primary"
          href={`/list/${list().id}/play`}
        >
          Restart
        </A>
      </div>
    </div>
  );
};
