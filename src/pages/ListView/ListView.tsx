import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { For } from "solid-js";

import { ListGuard } from "../../components/ListGuard";
import { ListHeader } from "../../components/ListHeader";

export const ListView: Component = () => {
  return (
    <ListGuard>
      {(list) => (
        <>
          <ListHeader list={list()} />
          <A href={`/list/${list().id}/item/new`}>Add item</A>
          <A href={`/list/${list().id}/play`}>Start</A>
          <For each={list()?.items}>
            {(item) => (
              <>
                <h4>{item.name}</h4>
                <A href={`/list/${list().id}/item/${item.id}/edit`}>
                  Edit item
                </A>
              </>
            )}
          </For>
        </>
      )}
    </ListGuard>
  );
};
