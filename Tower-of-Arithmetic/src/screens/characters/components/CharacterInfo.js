import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { levelBonus } from '../../../data/characterLevels';
import { colors, fonts } from '../../../theme/theme';

// Hearts, the Selected / Locked tag, then the character's name and title.
export default function CharacterInfo({ character, chosen }) {
  // Hearts include any bonus from the character's level
  const hearts = character.hearts + levelBonus(character.level).maxHearts;
  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        {!character.locked && (
          <View style={styles.hearts} accessibilityLabel={`${hearts} hearts`}>
            {Array.from({ length: hearts }, (_, i) => (
              <Icon key={i} name="heart" size={14} color={colors.pink} fill={colors.pink} />
            ))}
            <Text style={styles.heartsText}>{hearts} hearts</Text>
          </View>
        )}

        {!character.locked && (
          <View style={[styles.tag, styles.tagLevel]}>
            <Text style={styles.tagText}>Lv {character.level}</Text>
          </View>
        )}

        {chosen && (
          <View style={styles.tag}>
            <Icon name="check" size={13} color={colors.gold} strokeWidth={2.5} />
            <Text style={styles.tagText}>Selected</Text>
          </View>
        )}

        {character.locked && (
          <View style={[styles.tag, styles.tagLocked]}>
            <Icon name="lock" size={13} color={colors.mute} />
            <Text style={styles.tagText}>Locked</Text>
          </View>
        )}
      </View>

      <Text style={styles.name} accessibilityRole="header">
        {character.locked ? '???' : character.name}
      </Text>
      <Text style={styles.title}>{character.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 2 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 24 },
  hearts: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heartsText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.pink, marginLeft: 2 },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingLeft: 8,
    paddingRight: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gold,
    backgroundColor: colors.indigo,
  },
  tagLocked: { borderColor: colors.border, backgroundColor: colors.panel },
  tagLevel: { paddingLeft: 10, borderColor: colors.border, backgroundColor: colors.panel },
  tagText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.white },
  name: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, color: colors.white },
  title: { fontFamily: fonts.regular, fontSize: 22, lineHeight: 26, color: colors.mute },
});
