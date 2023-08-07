import type { Component } from "solid-js";

import { NewListForm } from "../../components/NewListForm";
import { useStoreContext } from "../../store/context";

import styles from "./NewList.module.css";

export const NewList: Component = () => {
  const [_, actions] = useStoreContext();

  return (
    <NewListForm onSubmit={actions.add} />
  );
};
