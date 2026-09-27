"use client";

import * as React from "react";

const subscribe = () => () => {};

/**
 * True only after the first client render.
 *
 * Used wherever a value is unknowable on the server (`resolvedTheme` from
 * next-themes) and rendering the wrong branch first would either cause a
 * hydration mismatch or a flash of the wrong theme. Implemented with
 * `useSyncExternalStore` rather than `useState` + `useEffect` so there is no
 * extra render pass.
 */
export function useMounted(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
