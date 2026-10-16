import { createContext, useContext } from 'react';

// True when Dyscalculia mode is on in Settings. App.js sets it; the sum
// box, steps, keypad and pictures read it to show the maths bigger,
// spaced out and with a picture to help (Figma 08a / 08b).
const DyscalculiaContext = createContext(false);

export const DyscalculiaProvider = DyscalculiaContext.Provider;

export function useDyscalculia() {
  return useContext(DyscalculiaContext);
}
