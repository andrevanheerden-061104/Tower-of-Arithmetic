import { StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// Hearts, the Selected / Locked tag, then the character's name and title.
export default function CharacterInfo({ character, chosen }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.meta}>
        {!character.locked && (
          <View style={styles.hearts} accessibilityLabel={`${character.hearts} hearts`}>
            {Array.from({ length: character.hearts }, (_, i) => (
              <Icon key={i} name="heart" size={14} color={colors.pink} fill={colors.pink} />
            ))}
            <Text style={styles.heartsText}>{character.hearts} hearts</Text>
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
        {character.name}
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
  tagText: { fontFamily: fonts.semibold, fontSize: 12, color: colors.white },
  name: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, color: colors.white },
  title: { fontFamily: fonts.regular, fontSize: 22, lineHeight: 26, color: colors.mute },
});
