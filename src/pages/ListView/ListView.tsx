import type { Component } from "solid-js";

import { A, Navigate, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./ListView.module.css";

export const ListView: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const list = actions.find(params.listId);

  return (
    <Show when={list} fallback={<Navigate href="/" />}>
      <h1>{list?.name}</h1>
      <p>{list?.description}</p>
      <A href={`/list/${params.listId}/item/new`}>Add item</A>
      <For each={list?.items}>{(item) => <h4>{item.name}</h4>}</For>
    </Show>
  );
};
