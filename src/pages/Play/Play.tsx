import type { Component } from "solid-js";

import { useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

import { BottomActionsLayout } from "../../components/BottomActionsLayout";
import { useListItemGuardContext } from "../../components/ListItemGuard";
import { PlayActions } from "../../components/PlayActions";
import { PlayContent } from "../../components/PlayContent";
import { PlayCounter } from "../../components/PlayCounter";
import { PlayHeader } from "../../components/PlayHeader";
import { PlayTimer } from "../../components/PlayTimer";
import { useStoreContext } from "../../store/context";

export const Play: Component = () => {
  const guard = useListItemGuardContext();
  const [_, actions] = useStoreContext();
  const navigate = useNavigate();
  const showTimer = () => {
    const ts = guard().item.data.timerSeconds;
    return ts && ts !== "0";
  };

  const nextId = () => {
    const nextIndex = guard().item.index + 1;
    return nextIndex !== guard().list.items.length
      ? guard().list.items[nextIndex].id
      : "done";
  };

  const prevId = () => {
    const prevIndex = guard().item.index - 1;
    return prevIndex >= 0 ? guard().list.items[prevIndex].id : null;
  };

  const goNext = (complete: boolean = false) => {
    if (complete) {
      actions.updateItem(guard().list.id, guard().item.data.id, {
        completed: true,
      });
    }

    const id = nextId();
    navigate(`/list/${guard().list.id}/play/${id}`);
  };
  const goPrev = () => {
    const id = prevId();
    if (id) {
      navigate(`/list/${guard().list.id}/play/${id}`);
    } else {
      navigate(`/list/${guard().list.id}`);
    }
  };

  return (
    <BottomActionsLayout
      actions={
        <PlayActions
          goNext={goNext}
          goPrev={goPrev}
          isPrevAvailable={!!prevId()}
        />
      }
    >
      <PlayHeader />
      <hr />
      <PlayContent />
      <Show when={guard().item.data.counterType !== "none"}>
        <>
          <hr />
          <PlayCounter goNext={goNext} />
        </>
      </Show>
      <Show when={showTimer()}>
        <>
          <hr />
          <PlayTimer goNext={goNext} />
        </>
      </Show>
    </BottomActionsLayout>
  );
};
