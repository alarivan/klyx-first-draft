import type { Component } from "solid-js";

import { A, useNavigate, useParams } from "@solidjs/router";
import { For, createEffect } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./ListView.module.css";

export const ListView: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const list = actions.find(params.listId);

  createEffect(() => {
    if (!list) {
      navigate("/");
    }
  });

  return (
    <>
      <h1>{list?.name}</h1>
      <p>{list?.description}</p>
      <A href={`/list/${params.listId}/item/new`}>Add item</A>
      <A href={`/list/${params.listId}/play`}>Start</A>
      <For each={list?.items}>{(item) => <h4>{item.name}</h4>}</For>
    </>
  );
};
