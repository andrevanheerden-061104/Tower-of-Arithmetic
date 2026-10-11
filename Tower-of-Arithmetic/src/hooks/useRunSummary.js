import { useEffect, useState } from 'react';
import { floorsCleared, runVersion } from '../game/run';
import { fetchRunSummary } from '../services/ai';

// At the end of a run: Orrin's message about how it went and what to
// practise next. Returns { summary, focusTopic, loading }; summary stays
// null if the AI can't be reached (the screen then shows its own advice).
export function useRunSummary(run) {
  const [result, setResult] = useState({ seed: null, summary: null, focusTopic: null });
  const seed = run?.seed ?? null;

  useEffect(() => {
    if (!run) return undefined;
    let current = true;
    fetchRunSummary({
      version: runVersion(run),
      won: run.status === 'won',
      floorsCleared: floorsCleared(run),
      floors: run.map.floors,
      topicStats: run.topicStats,
    }).then((reply) => {
      if (current) setResult({ seed: run.seed, summary: reply?.summary ?? null, focusTopic: reply?.focusTopic ?? null });
    });
    return () => {
      current = false;
    };
    // Once per run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  const done = result.seed === seed;
  return { summary: done ? result.summary : null, focusTopic: done ? result.focusTopic : null, loading: Boolean(run) && !done };
}
