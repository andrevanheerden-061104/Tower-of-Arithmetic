import { useEffect, useMemo, useState } from 'react';
import { floorsCleared, runVersion } from '../game/run';
import { towerTop } from '../game/tower';
import { localSummary } from '../game/runSummary';
import { fetchRunSummary } from '../services/ai';

// At the end of a run: Orrin's message about how it went and what to
// practise next. Returns { summary, focusTopic, loading }.
//
// The AI writes it from the run's real results (and the sums that were
// missed). If the AI can't be reached, the game's own summary is used
// instead: it is built from the same results, so it is always accurate.
export function useRunSummary(run) {
  const [result, setResult] = useState({ seed: null, reply: null });
  const seed = run?.seed ?? null;
  const fallback = useMemo(
    () => (run ? localSummary(run, runVersion(run)) : { summary: null, focusTopic: null }),
    // Once per run: its results don't change on the stats screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [seed],
  );

  useEffect(() => {
    if (!run) return undefined;
    let current = true;
    fetchRunSummary({
      version: runVersion(run),
      grade: run.grade,
      won: run.status === 'won',
      floorsCleared: floorsCleared(run),
      floors: towerTop(run),
      topicStats: run.topicStats,
      mistakes: run.mistakes,
    }).then((reply) => {
      if (current) setResult({ seed: run.seed, reply });
    });
    return () => {
      current = false;
    };
    // Once per run
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  const done = result.seed === seed;
  const reply = done ? result.reply : null;
  return {
    summary: reply?.summary ?? fallback.summary,
    // The topic to practise always comes from the counts
    focusTopic: reply?.focusTopic ?? fallback.focusTopic,
    loading: Boolean(run) && !done,
  };
}
