import type { Component } from "solid-js";

import { FiCheckSquare, FiSquare } from "solid-icons/fi";
import { mergeProps, Show } from "solid-js";

export const ItemStatus: Component<{ status: boolean; size?: number }> = (
  p,
) => {
  const props = mergeProps({ size: 32 }, p);
  return (
    <Show
      when={props.status}
      fallback={<FiSquare aria-label="incomplete" size={props.size} />}
    >
      <FiCheckSquare aria-label="completed" size={props.size} />
    </Show>
  );
};
