import type { IList } from "../../store/types";
import type { Component } from "solid-js";

import { useNavigate } from "@solidjs/router";

import { NewListForm } from "../../components/NewListForm";
import { useStoreContext } from "../../store/context";

export const NewList: Component = () => {
  const [_, actions] = useStoreContext();
  const navigate = useNavigate();

  const onSubmit = (values: Pick<IList, "name" | "description">) => {
    actions.add(values);
    navigate("/");
  };

  return <NewListForm onSubmit={onSubmit} />;
};
