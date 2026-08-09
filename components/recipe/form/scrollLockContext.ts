import { createContext } from "react";

/**
 * Host screens that scroll a form provide this setter so drag gestures
 * inside the form (StepEditor reorder) can freeze the outer ScrollView
 * while a row is being dragged — otherwise the scroll steals the touch.
 */
export const ScrollLockContext = createContext<(locked: boolean) => void>(
  () => {}
);
