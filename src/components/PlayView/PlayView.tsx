import type { IList, IListItemWithIndex } from "../../store/types";
import type { Component } from "solid-js";

import { A } from "@solidjs/router";
import { createMemo, Show } from "solid-js";

import styles from "./PlayView.module.css";

export const PlayView: Component<{ list: IList; item: IListItemWithIndex }> = (
  props,
) => {
  const nextId = createMemo(() => {
    const nextIndex = props.item.index + 1;
    return nextIndex !== props.list.items.length
      ? props.list.items[nextIndex].id
      : "done";
  });

  const prevId = createMemo(() => {
    const prevIndex = props.item.index - 1;
    return prevIndex >= 0 ? props.list.items[prevIndex].id : null;
  });

  return (
    <>
      <div>{props.list.name}</div>
      <div>{props.item.data.name}</div>
      <Show when={prevId()}>
        <A href={`/list/${props.list.id}/play/${prevId()}`}>prev</A>
      </Show>
      <A href={`/list/${props.list.id}/play/${nextId()}`}>next</A>
    </>
  );
};
