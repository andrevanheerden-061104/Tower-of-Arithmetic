import { createContext, useContext } from 'react';

// How much bigger or smaller the text is drawn for each Settings choice.
export const TEXT_SCALES = { small: 0.88, medium: 1, large: 1.1 };

// Holds the current text scale (1 = normal size). App.js sets it from
// the Text size setting, and AppText reads it.
const TextSizeContext = createContext(1);

export const TextSizeProvider = TextSizeContext.Provider;

export function useTextScale() {
  return useContext(TextSizeContext);
}
