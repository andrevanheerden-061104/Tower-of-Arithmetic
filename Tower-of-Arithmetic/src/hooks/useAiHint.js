import { useEffect, useState } from 'react';
import { fetchHint } from '../services/ai';

// After a wrong answer: ask Orrin (the AI) what went wrong.
// Pass `givenAnswer` = null when nothing needs explaining.
// Returns { hint, loading }: hint stays null if the AI can't help.
export function useAiHint(version, question, givenAnswer, grade) {
  const [result, setResult] = useState({ key: null, hint: null });
  const key = givenAnswer != null && question ? `${question.display}|${givenAnswer}` : null;

  useEffect(() => {
    if (!key) return undefined;
    let current = true;
    fetchHint({ version, grade, question, givenAnswer }).then((hint) => {
      if (current) setResult({ key, hint });
    });
    return () => {
      current = false;
    };
    // key covers question and answer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const done = result.key === key;
  return { hint: done ? result.hint : null, loading: Boolean(key) && !done };
}
