import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import { LEVEL_REWARDS, MAX_LEVEL, REWARD_EVERY, nextReward, xpToNextLevel } from '../../../data/characterLevels';
import { colors, fonts } from '../../../theme/theme';

// The character's own level: an XP bar to the next level, then the
// rewards at every 5 levels (rewards not decided yet show as "???").
export default function CharacterLevel({ character }) {
  const { level, xp } = character;
  const needed = xpToNextLevel(level);
  const progress = needed ? Math.min(1, xp / needed) : 1;
  const next = nextReward(level);
  const milestones = Array.from({ length: MAX_LEVEL / REWARD_EVERY }, (_, i) => (i + 1) * REWARD_EVERY);

  return (
    <View style={styles.wrap}>
      <View style={styles.top}>
        <Text style={styles.label}>Character level</Text>
        <Text style={styles.level}>
          {level} <Text style={styles.max}>/ {MAX_LEVEL}</Text>
        </Text>
      </View>

      <View
        style={styles.bar}
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={`Level ${level} of ${MAX_LEVEL}. ${xp} of ${needed} XP to the next level`}
        accessibilityValue={{ min: 0, max: needed || 1, now: xp }}
      >
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xp}>{needed ? `${xp} / ${needed} XP to level ${level + 1}` : 'Max level'}</Text>

      <View style={styles.milestones}>
        {milestones.map((at) => {
          const reward = LEVEL_REWARDS[at];
          const reached = level >= at;
          return (
            <View
              key={at}
              style={[styles.milestone, reached && styles.reached, next?.level === at && styles.upNext]}
              accessible
              accessibilityLabel={`Level ${at}: ${reward ? reward.title : 'reward coming soon'}${reached ? ', unlocked' : ''}`}
            >
              <Text style={styles.milestoneLevel}>Lv {at}</Text>
              <Text style={[styles.milestoneReward, !reward && styles.unknown]} numberOfLines={1}>
                {reward ? reward.title : '???'}
              </Text>
            </View>
          );
        })}
      </View>
      {next && (
        <Text style={styles.next}>
          Next at level {next.level}: {next.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  top: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  label: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase', color: colors.mute },
  level: { fontFamily: fonts.bold, fontSize: 18, color: colors.gold },
  max: { fontFamily: fonts.semibold, fontSize: 13, color: colors.mute },
  bar: { height: 8, borderRadius: 4, backgroundColor: colors.line, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4, backgroundColor: colors.gold },
  xp: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  milestones: { flexDirection: 'row', gap: 8, marginTop: 4 },
  milestone: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  reached: { borderColor: colors.gold, backgroundColor: colors.indigo },
  upNext: { borderColor: colors.gold },
  milestoneLevel: { fontFamily: fonts.bold, fontSize: 13, color: colors.white },
  milestoneReward: { fontFamily: fonts.semibold, fontSize: 11, color: colors.gold },
  unknown: { color: colors.mute },
  next: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19, color: colors.pink },
});
