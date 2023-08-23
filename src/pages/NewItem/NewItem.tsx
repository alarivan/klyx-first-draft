import type { IListItemDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { useNavigate, useParams } from "@solidjs/router";

import { NewItemForm } from "../../components/NewItemForm";
import { useStoreContext } from "../../store/context";

export const NewItem: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const onSubmit = (values: IListItemDataObject) => {
    actions.addItem(params.listId, values);
    navigate(`/list/${params.listId}`);
  };

  return (
    <NewItemForm
      listId={params.listId}
      onSubmit={onSubmit}
      buttonLabel="Add item"
    />
  );
};
