import type { Component } from "solid-js";

import { A, Navigate, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./ListView.module.css";

export const ListView: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      {(list) => (
        <>
          <h1>{list().name}</h1>
          <Show when={list().description} fallback={<Navigate href="/" />}>
            <p>{list().description}</p>
          </Show>
          <A href={`/list/${params.listId}/item/new`}>Add item</A>
          <A href={`/list/${params.listId}/play`}>Start</A>
          <For each={list()?.items}>{(item) => <h4>{item.name}</h4>}</For>
        </>
      )}
    </Show>
  );
};
