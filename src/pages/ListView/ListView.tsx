import type { Component } from "solid-js";

import { A, Navigate, useParams } from "@solidjs/router";
import { For, Show } from "solid-js";

import { ListHeader } from "../../components/ListHeader";
import { useStoreContext } from "../../store/context";

export const ListView: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      {(list) => (
        <>
          <ListHeader list={list()} />
          <A href={`/list/${params.listId}/item/new`}>Add item</A>
          <A href={`/list/${params.listId}/play`}>Start</A>
          <For each={list()?.items}>{(item) => <h4>{item.name}</h4>}</For>
        </>
      )}
    </Show>
  );
};
