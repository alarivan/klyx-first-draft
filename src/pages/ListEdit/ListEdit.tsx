import type { IListDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { Navigate, useNavigate, useParams } from "@solidjs/router";
import { Show } from "solid-js";

import { NewListForm } from "../../components/NewListForm";
import { useStoreContext } from "../../store/context";

export const ListEdit: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const maybeList = () => actions.find(params.listId);

  const onSubmit = (values: IListDataObject) => {
    actions.update(params.listId, values);
    navigate(`/list/${params.listId}`);
  };

  return (
    <Show when={maybeList()} fallback={<Navigate href="/" />}>
      {(list) => (
        <NewListForm
          buttonLabel="Save list"
          onSubmit={onSubmit}
          list={list()}
        />
      )}
    </Show>
  );
};
