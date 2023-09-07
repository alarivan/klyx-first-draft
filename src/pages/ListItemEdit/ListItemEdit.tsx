import type { IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { useParams } from "@solidjs/router";

import { ListItemGuard } from "../../components/ListItemGuard";
import { NewItemForm } from "../../components/NewItemForm";
import { useStoreContext } from "../../store/context";

export const ListItemEdit: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();

  const onSubmit = (values: IListItemDataObject) => {
    actions.updateItem(params.listId, params.itemId, values);
    history.back();
  };

  return (
    <ListItemGuard>
      {(value) => (
        <NewItemForm
          listId={value().list.id}
          item={value().item.data}
          onSubmit={onSubmit}
          buttonLabel="Save item"
        />
      )}
    </ListItemGuard>
  );
};
