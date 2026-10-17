import { createContext, useContext } from 'react';

// True when Reduce motion is on in Settings. App.js sets it; anything that
// moves, slides or flashes reads it and keeps still (or does less).
const MotionContext = createContext(false);

export const MotionProvider = MotionContext.Provider;

export function useReduceMotion() {
  return useContext(MotionContext);
}
