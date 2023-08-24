import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { Show } from "solid-js";

import { useListItemGuardContext } from "../../components/ListItemGuard";

import styles from "./PlayDone.module.css";

export const PlayDone: Component = () => {
  const guard = useListItemGuardContext();
  const itemsLength = () => guard().list.items.length;

  return (
    <div class={styles.container}>
      <h1>Done</h1>
      <b>
        {itemsLength()}/{itemsLength()}
      </b>
      <h2>{guard().list.name}</h2>
      <Show when={guard().list.description}>
        <p>{guard().list.description}</p>
      </Show>
      <div class={styles.actions}>
        <A class="a-reset action a-reset action__primary" href="/">
          Go home
        </A>
        <br />
        <A
          class="a-reset action a-reset action__primary"
          href={`/list/${guard().list.id}`}
        >
          Go to list
        </A>
        <br />
        <A
          class="a-reset action a-reset action__primary"
          href={`/list/${guard().list.id}/play`}
        >
          Restart
        </A>
      </div>
    </div>
  );
};
