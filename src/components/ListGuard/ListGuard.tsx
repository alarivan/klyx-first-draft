import type { IList } from "../../store/types";
import type { Accessor, JSX } from "solid-js";

import { Navigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";

export function ListGuard<T extends IList>(props: {
  children: (item: Accessor<NonNullable<T>>) => JSX.Element;
}): JSX.Element {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      {props.children as unknown as JSX.Element}
    </Show>
  );
}
