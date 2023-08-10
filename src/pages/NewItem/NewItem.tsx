import type { IListItemCreateObject } from "../../store/types";
import type { Component } from "solid-js";

import { useNavigate, useParams } from "@solidjs/router";
import { createEffect } from "solid-js";

import { NewItemForm } from "../../components/NewItemForm";
import { useStoreContext } from "../../store/context";

import styles from "./NewItem.module.css";

export const NewItem: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const list = actions.find(params.listId);
  createEffect(() => {
    if (!list) {
      navigate("/", { replace: true });
    }
  });

  const onSubmit = (values: IListItemCreateObject) => {
    actions.addItem(params.listId, values);
    navigate(`/list/${params.listId}`);
  };

  return <NewItemForm listId={params.listId} onSubmit={onSubmit} />;
};
