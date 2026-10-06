import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import CharacterPortrait from '../../../components/CharacterPortrait';
import { colors, fonts } from '../../../theme/theme';

const SIZE = 104;       // outer size of the ring
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Round portrait inside an XP ring, with the level tag, name and rank.
export default function ProfileIdentity({ player, character, grade }) {
  const progress = Math.min(player.xp / player.xpToNext, 1);
  const gradeText = grade ? `Grade ${grade}` : 'Grade not set';

  return (
    <View style={styles.wrap}>
      <View style={styles.avatar}>
        <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
          <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke={colors.line} strokeWidth={STROKE} fill="none" />
          {/* The gold arc is the share of XP earned towards the next level */}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={colors.gold}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE * progress} ${CIRCUMFERENCE}`}
            fill="none"
            rotation={-90}
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        <View style={styles.portrait}>
          <CharacterPortrait character={character} size={84} borderWidth={0} />
        </View>

        <View style={styles.levelTag}>
          <Text style={styles.levelText}>LV {player.level}</Text>
        </View>
      </View>

      <Text style={styles.name} accessibilityRole="header">
        {character.name}
      </Text>
      <Text style={styles.rank}>
        {player.rank} · {gradeText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 6 },
  avatar: { width: SIZE, height: SIZE + 10, alignItems: 'center' },
  portrait: { position: 'absolute', top: 10 },
  levelTag: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.bg,
    backgroundColor: colors.gold,
  },
  levelText: { fontFamily: fonts.bold, fontSize: 12, color: colors.bg },
  name: {
    fontFamily: fonts.display,
    fontSize: 30,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.white,
  },
  rank: { fontFamily: fonts.medium, fontSize: 13, color: colors.mute },
});
