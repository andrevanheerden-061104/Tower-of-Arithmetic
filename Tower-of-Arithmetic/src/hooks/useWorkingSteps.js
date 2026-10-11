import { useState } from 'react';

// Working written one step at a time on the keypad (the cast sheet for
// Grades 7-11 and the puzzle doors). The last step that isn't empty is the
// answer that gets checked.
//   press(key)   type a key ("⌫" deletes, "next" starts a new step)
//   nextStep()   start a new step
export function useWorkingSteps() {
  const [steps, setSteps] = useState(['']);
  const last = steps.length - 1;

  const nextStep = () => setSteps((s) => (s[s.length - 1] ? [...s, ''] : s));
  const press = (key) => {
    if (key === 'next') return nextStep();
    return setSteps((s) => {
      const copy = [...s];
      const i = copy.length - 1;
      if (key === '⌫') copy[i] = copy[i].endsWith(' ') ? copy[i].trimEnd().slice(0, -1).trimEnd() : copy[i].slice(0, -1);
      else copy[i] = copy[i] + (key === '=' ? ' = ' : key);
      return copy;
    });
  };

  const answer = steps.filter(Boolean).at(-1) ?? '';
  return { steps, last, press, nextStep, answer };
}
