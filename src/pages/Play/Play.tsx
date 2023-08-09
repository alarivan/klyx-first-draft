import type { Component } from "solid-js";

import { useNavigate, useParams } from "@solidjs/router";
import { createEffect } from "solid-js";

import { useStoreContext } from "../../store/context";

import styles from "./Play.module.css";

export const Play: Component = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [_, actions] = useStoreContext();

  const list = actions.find(params.listId);
  const item = params.itemId
    ? actions.findItem(params.listId, params.itemId)
    : { data: list?.items[0], index: 0 };

  createEffect(() => {
    if (!list) {
      navigate("/");
    }
    if (list && !item) {
      navigate(`/list/${params.listId}`);
    }
  });

  return (
    <>
      <div>{list?.name}</div>
      <div>{item?.data?.name}</div>
    </>
  );
};
