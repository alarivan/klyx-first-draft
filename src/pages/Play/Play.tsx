import type { Component } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { createMemo, Show } from "solid-js";

import { BottomActionsLayout } from "../../components/BottomActionsLayout";
import { useListItemGuardContext } from "../../components/ListItemGuard";
import { PlayActions } from "../../components/PlayActions";
import { PlayContent } from "../../components/PlayContent";
import { PlayCounter } from "../../components/PlayCounter";
import { PlayHeader } from "../../components/PlayHeader";
import { PlayTimer } from "../../components/PlayTimer";

export const Play: Component = () => {
  const guard = useListItemGuardContext();
  const navigate = useNavigate();
  const nextId = createMemo(() => {
    const nextIndex = guard().item.index + 1;
    return nextIndex !== guard().list.items.length
      ? guard().list.items[nextIndex].id
      : "done";
  });

  const prevId = createMemo(() => {
    const prevIndex = guard().item.index - 1;
    return prevIndex >= 0 ? guard().list.items[prevIndex].id : null;
  });

  const goNext = () => {
    const id = nextId();
    navigate(`/list/${guard().list.id}/play/${id}`);
  };
  const goPrev = () => {
    const id = prevId();
    if (id) {
      navigate(`/list/${guard().list.id}/play/${id}`);
    }
  };

  return (
    <BottomActionsLayout
      actions={<PlayActions goNext={goNext} goPrev={goPrev} />}
    >
      <PlayHeader />
      <PlayContent />
      <Show when={guard().item.data.counterType !== "none"}>
        <>
          <hr />
          <PlayCounter goNext={goNext} />
        </>
      </Show>
      <Show when={guard().item.data.timerSeconds}>
        <>
          <hr />
          <PlayTimer goNext={goNext} />
        </>
      </Show>
    </BottomActionsLayout>
  );
};
