import type { Component } from "solid-js";

import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, Show } from "solid-js";

import { PlayView } from "../../components/PlayView";
import { useStoreContext } from "../../store/context";

import styles from "./Play.module.css";

export const Play: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
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

  createEffect(() => {
    const item = maybeItem();
    const list = maybeList();
    if (!list) {
      navigate("/", { replace: true });
    }
    if (list && !item) {
      navigate(`/list/${params.listId}`, { replace: true });
    }
  });

  return (
    <Show when={maybeList() && maybeItem()}>
      <PlayView list={maybeList()!} item={maybeItem()!} />
    </Show>
  );
};
