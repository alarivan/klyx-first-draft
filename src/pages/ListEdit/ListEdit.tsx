import type { IListDataObject } from "../../store/types";
import type { Component } from "solid-js";

import { useNavigate, useParams } from "@solidjs/router";

import { ListGuard } from "../../components/ListGuard";
import { NewListForm } from "../../components/NewListForm";
import { useStoreContext } from "../../store/context";

export const ListEdit: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const onSubmit = (values: IListDataObject) => {
    actions.update(params.listId, values);
    navigate(`/list/${params.listId}`);
  };

  return (
    <ListGuard>
      {(list) => (
        <NewListForm
          buttonLabel="Save list"
          onSubmit={onSubmit}
          list={list()}
        />
      )}
    </ListGuard>
  );
};
