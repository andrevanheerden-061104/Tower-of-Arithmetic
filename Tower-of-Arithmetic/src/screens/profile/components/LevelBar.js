import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import { colors, fonts } from '../../../theme/theme';

// Wide progress bar from the current level to the next one.
export default function LevelBar({ level, xp, xpToNext }) {
  const progress = Math.min(xp / xpToNext, 1);

  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityLabel={`Level ${level}. ${xp} of ${xpToNext} XP to level ${level + 1}`}
    >
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress * 100}%` }]} />
        <Text style={[styles.number, styles.current]}>{level}</Text>
        <Text style={[styles.number, styles.next]}>{level + 1}</Text>
      </View>
      <Text style={styles.text}>
        {xp} / {xpToNext} XP to Level {level + 1}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, alignItems: 'center' },
  track: {
    alignSelf: 'stretch',
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#2A2338',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: { position: 'absolute', left: 0, top: 0, bottom: 0, borderRadius: 14, backgroundColor: colors.gold },
  number: { position: 'absolute', fontFamily: fonts.bold, fontSize: 13 },
  current: { left: 14, color: colors.bg },
  next: { right: 14, color: colors.white },
  text: { fontFamily: fonts.semibold, fontSize: 12, color: colors.gold },
});
