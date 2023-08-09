import type { IListItemCreateObject } from "../../store/types";
import type { Component } from "solid-js";

import { useNavigate, useParams } from "@solidjs/router";

import { NewItemForm } from "../../components/NewItemForm";
import { useStoreContext } from "../../store/context";

import styles from "./NewItem.module.css";

export const NewItem: Component = () => {
  const params = useParams();
  const [_, actions] = useStoreContext();
  const navigate = useNavigate();

  const onSubmit = (values: IListItemCreateObject) => {
    actions.addItem(params.listId, values);
    navigate(`/list/${params.listId}`)
  }

  return (
    <NewItemForm listId={params.listId} onSubmit={onSubmit} />
  );
};
