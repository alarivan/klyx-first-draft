import type { IListItemCreateObject } from "../../store/types";
import type { Component } from "solid-js";

import { Navigate, useNavigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { NewItemForm } from "../../components/NewItemForm";
import { useStoreContext } from "../../store/context";

import styles from "./NewItem.module.css";

export const NewItem: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  const onSubmit = (values: IListItemCreateObject) => {
    actions.addItem(params.listId, values);
    navigate(`/list/${params.listId}`);
  };

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      <NewItemForm listId={params.listId} onSubmit={onSubmit} />
    </Show>
  );
};
