import { useMemo } from 'react';
import { BADGES, earnedBadgeIds, topCharacterLevel } from '../data/badges';
import { PLAYER } from '../data/player';
import { rankFor, xpToNextLevel } from '../data/playerLevels';
import { versionForGrade } from '../game/versions';
import { usePlayer } from './usePlayer';

// The badges with `earned` set: unlocked by the player's totals, or
// already shown to them once (kept in their settings as badgesSeen).
function badgeList(stats, seen = []) {
  const earned = new Set([...earnedBadgeIds(stats), ...seen]);
  return BADGES.map((b) => ({ id: b.id, name: b.name, description: b.description, image: b.image, earned: earned.has(b.id) }));
}

// Everything Home and Profile show about the player, from the saved
// profile and topic totals. A guest gets a fresh level 1 card with this
// visit's runs (nothing of a guest's is saved).
export function usePlayerCard() {
  const { profile, topics, characters, guestStats } = usePlayer();

  return useMemo(() => {
    if (!profile) {
      const stats = { runsCompleted: guestStats.runs_completed, highestFloor: guestStats.highest_floor, topCharacterLevel: 1 };
      return {
        ...PLAYER,
        guest: true,
        name: 'Guest',
        rank: rankFor(1),
        level: 1,
        xp: 0,
        xpToNext: xpToNextLevel(1),
        highestFloor: stats.highestFloor,
        runsCompleted: stats.runsCompleted,
        accuracy: 0,
        strengths: PLAYER.strengths.map((s) => ({ ...s, value: 0 })),
        badges: badgeList(stats),
        badgesTotal: BADGES.length,
      };
    }
    const attempts = topics.reduce((n, t) => n + t.attempts, 0);
    const correct = topics.reduce((n, t) => n + t.correct, 0);
    const version = versionForGrade(profile.grade);
    const strengths = version.dungeonTypes.map((type) => {
      const t = topics.find((x) => x.topic === type.id);
      return { label: type.label, value: t && t.attempts ? Math.round((t.correct / t.attempts) * 100) : 0 };
    });
    const stats = { runsCompleted: profile.runs_completed ?? 0, highestFloor: profile.highest_floor ?? 0, topCharacterLevel: topCharacterLevel(characters) };
    return {
      ...PLAYER,
      guest: false,
      name: profile.username,
      rank: rankFor(profile.level),
      level: profile.level,
      xp: profile.xp,
      xpToNext: xpToNextLevel(profile.level),
      highestFloor: profile.highest_floor,
      runsCompleted: profile.runs_completed,
      accuracy: attempts ? Math.round((correct / attempts) * 100) : 0,
      strengths,
      badges: badgeList(stats, profile.settings?.badgesSeen),
      badgesTotal: BADGES.length,
    };
  }, [profile, topics, characters, guestStats]);
}
