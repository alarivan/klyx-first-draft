import type { Component } from "solid-js";

import { Navigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./ListView.module.css";

export const ListView: Component = () => {
  const params = useParams()
  const [_, actions] = useStoreContext();

  const list = actions.find(params.listId)


  return (
    <Show when={list} fallback={<Navigate href="/" />}>
      <h1>{list?.name}</h1>
      <p>{list?.description}</p>
    </Show>
  );
};
