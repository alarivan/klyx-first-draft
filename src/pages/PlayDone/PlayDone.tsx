import type { Component } from "solid-js";

import { A, useParams } from "@solidjs/router";

import { ListGuard } from "../../components/ListGuard";

export const PlayDone: Component = () => {
  const params = useParams();

  return (
    <ListGuard>
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
    </ListGuard>
  );
};
