import type { IList, IListItemWithIndex } from "../../store/types";
import type { JSX, Accessor } from "solid-js";

import { Navigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { useStoreContext } from "../../store/context";
import { ListGuard } from "../ListGuard";

export function ListItemGuard<
  T extends { list: IList; item: IListItemWithIndex },
>(props: {
  children: (item: Accessor<NonNullable<T>>) => JSX.Element;
}): JSX.Element {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const maybeValue = (list: IList) => {
    if (params.itemId) {
      const item = actions.findItem(params.listId, params.itemId);
      if (item) {
        return { list, item };
      }
    } else if (list?.items[0]) {
      return { list, item: { data: list.items[0], index: 0 } };
    }

    return undefined;
  };

  return (
    <ListGuard>
      {(list) => (
        <Show
          when={maybeValue(list())}
          fallback={<Navigate href={`/list/${params.listId}`} />}
        >
          {props.children as unknown as JSX.Element}
        </Show>
      )}
    </ListGuard>
  );
}
