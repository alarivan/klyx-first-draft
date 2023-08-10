import type { Component } from "solid-js";

import { A, useNavigate, useParams } from "@solidjs/router";
import { createEffect } from "solid-js";

import { useStoreContext } from "../../store/context";

export const PlayDone: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  createEffect(() => {
    const list = maybeList();
    if (!list) {
      navigate("/", { replace: true });
    }
  });

  return (
    <div>
      <h1>Done</h1>
      <h3>{maybeList()?.name}</h3>
      <A href="/">Go home</A>
      <br />
      <A href={`/list/${params.listId}`}>Go to list</A>
      <br />
      <A href={`/list/${params.listId}/play`}>Restart</A>
    </div>
  );
};
