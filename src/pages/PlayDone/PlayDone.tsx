import type { Component } from "solid-js";

import { A, Navigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";

export const PlayDone: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      {(list) => (
        <div>
          <h1>Done</h1>
          <h3>{list().name}</h3>
          <A href="/">Go home</A>
          <br />
          <A href={`/list/${params.listId}`}>Go to list</A>
          <br />
          <A href={`/list/${params.listId}/play`}>Restart</A>
        </div>
      )}
    </Show>
  );
};
