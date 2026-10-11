import { useMemo } from 'react';
import { PLAYER } from '../data/player';
import { rankFor, xpToNextLevel } from '../data/playerLevels';
import { versionForGrade } from '../game/versions';
import { usePlayer } from './usePlayer';

// Everything Home and Profile show about the player, from the saved
// profile and topic totals. Guests (or before loading) see the placeholder
// player from src/data/player.js. Badges are still placeholders.
export function usePlayerCard() {
  const { profile, topics } = usePlayer();

  return useMemo(() => {
    if (!profile) return PLAYER;
    const attempts = topics.reduce((n, t) => n + t.attempts, 0);
    const correct = topics.reduce((n, t) => n + t.correct, 0);
    const version = versionForGrade(profile.grade);
    const strengths = version.dungeonTypes.map((type) => {
      const t = topics.find((x) => x.topic === type.id);
      return { label: type.label, value: t && t.attempts ? Math.round((t.correct / t.attempts) * 100) : 0 };
    });
    return {
      ...PLAYER,
      name: profile.username,
      rank: rankFor(profile.level),
      level: profile.level,
      xp: profile.xp,
      xpToNext: xpToNextLevel(profile.level),
      highestFloor: profile.highest_floor,
      runsCompleted: profile.runs_completed,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      strengths,
    };
  }, [profile, topics]);
}
