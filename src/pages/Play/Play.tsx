import type { Component } from "solid-js";

import { Navigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { PlayView } from "../../components/PlayView";
import { useStoreContext } from "../../store/context";

import styles from "./Play.module.css";

export const Play: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  const maybeItem = () => {
    if (params.itemId) {
      return actions.findItem(params.listId, params.itemId);
    }

    const list = maybeList();
    if (list?.items[0]) {
      return { data: list.items[0], index: 0 };
    }

    return undefined;
  };

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      {(list) => (
        <Show
          when={maybeItem()}
          fallback={<Navigate href={`/list/${params.listId}`} />}
        >
          {(item) => <PlayView list={list()} item={item()} />}
        </Show>
      )}
    </Show>
  );
};
