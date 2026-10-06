import { Pressable, StyleSheet, Text, View } from 'react-native';
import CharacterPortrait from '../../../components/CharacterPortrait';
import { colors, fonts } from '../../../theme/theme';

// Portrait, name, rank and XP progress at the top of the home screen.
export default function ProfileBar({ player, character, onPress }) {
  const progress = Math.min(player.xp / player.xpToNext, 1);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${character.name}, level ${player.level} ${player.rank}, ${player.xp} of ${player.xpToNext} XP. Open profile`}
      style={styles.wrap}
    >
      <View style={styles.avatar}>
        <CharacterPortrait character={character} size={68} radius={18} />
        <View style={styles.levelTag}>
          <Text style={styles.levelText}>LV {player.level}</Text>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.rank}>{player.rank}</Text>
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.xpText}>
          {player.xp} / {player.xpToNext} XP
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 68, height: 76 },
  levelTag: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.bg,
    backgroundColor: colors.gold,
  },
  levelText: { fontFamily: fonts.bold, fontSize: 12, color: colors.bg },
  info: { flex: 1, gap: 4 },
  name: {
    fontFamily: fonts.bold,
    fontSize: 20,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.white,
  },
  rank: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  xpTrack: { height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' },
  xpFill: { height: '100%', borderRadius: 3, backgroundColor: colors.gold },
  xpText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.gold },
});
