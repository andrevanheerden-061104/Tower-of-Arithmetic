// ---------------------------------------------------------------------------
// What a run's answers say about the player, worked out from the real
// counts (run.topicStats). Used for the "where the errors came from" card
// and for Orrin's advice when the AI can't be reached, so the advice on
// the stats screen is always true to what happened.
// ---------------------------------------------------------------------------

// One thing to try next time, per maths topic.
const TIPS = {
  adding: 'Start with the bigger number and count on, or make a ten first.',
  takingAway: 'Count back in small jumps, or count up from the smaller number to the bigger one.',
  times: 'Say the skip-counting pattern out loud: one count for each group.',
  patterns: 'Work out what changes from one number to the next before you guess.',
  multiplication: 'Split the bigger number into tens and ones, multiply each part, then add.',
  division: 'Use the times table backwards: how many of the divisor fit into the number?',
  fractions: 'Make the bottom numbers the same before you add or subtract, and simplify at the end.',
  measurement: 'Say which you need first: perimeter goes around, area covers, volume fills.',
  data: 'Always put the numbers in order first, then decide what the question asks for.',
  algebra: 'Do the opposite operation to both sides, one step at a time, and watch the signs.',
  geometry: 'Name the rule first (line 180°, triangle 180°, point 360°), then write the equation.',
  arithmetic: 'Brackets and powers first, then × and ÷, then + and −. Check each sign.',
};

// Rows for every topic answered in the run, the weakest first.
export function topicResults(run, version) {
  return Object.entries(run.topicStats ?? {})
    .map(([topic, s]) => ({
      topic,
      label: version.dungeonTypes.find((t) => t.id === topic)?.label ?? topic,
      attempts: s.attempts,
      correct: s.correct,
      errors: s.attempts - s.correct,
      hints: s.hints,
      accuracy: s.attempts ? Math.round((s.correct / s.attempts) * 100) : 0,
    }))
    .filter((row) => row.attempts > 0)
    .sort((a, b) => a.accuracy - b.accuracy || b.errors - a.errors);
}

// The game's own advice: a strength, the topic with the most trouble, and
// one tip for it. { summary, focusTopic }
export function localSummary(run, version) {
  const rows = topicResults(run, version);
  if (!rows.length) return { summary: 'Cast a few spells next time and I can tell you what to practise.', focusTopic: null };
  const best = [...rows].sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)[0];
  const weak = rows.find((row) => row.errors > 0);
  if (!weak) {
    return {
      summary: `Every answer was right: ${best.correct} out of ${best.attempts} in ${best.label}${rows.length > 1 ? ' and full marks in the rest' : ''}. Try higher-level spell cards next time for harder sums.`,
      focusTopic: null,
    };
  }
  const strength = best.topic !== weak.topic && best.correct > 0 ? `${best.label} went well: ${best.correct} out of ${best.attempts} right. ` : '';
  const mistake = (run.mistakes ?? []).find((m) => m.topic === weak.topic);
  const example = mistake ? ` For example, ${mistake.display.replace(/\s*=\s*\?$/, '')} was ${mistake.answer.replace(/^x=/, 'x = ')}, not ${mistake.given}.` : '';
  return {
    summary: `${strength}Most of your slips were in ${weak.label}: ${weak.errors} of ${weak.attempts} went wrong.${example} ${TIPS[weak.topic] ?? ''}`.trim(),
    focusTopic: weak.topic,
  };
}
