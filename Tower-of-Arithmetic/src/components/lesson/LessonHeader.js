import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

// Top of a lesson page: back button, "ALGEBRA · LESSON", the page title, the
// page count and a bar of segments showing how far through the lesson you are.
export default function LessonHeader({ topicLabel, title, page, total, onBack }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Back" style={({ pressed }) => [styles.box, pressed && styles.pressed]}>
          <Icon name="arrowLeft" size={22} />
        </Pressable>
        <View style={styles.titles}>
          <Text style={styles.eyebrow}>{`${topicLabel} · LESSON`.toUpperCase()}</Text>
          <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
        </View>
        <View style={styles.count} accessible accessibilityLabel={`Page ${page} of ${total}`}>
          <Text style={styles.countText}>
            {page} / {total}
          </Text>
        </View>
      </View>
      <View style={styles.progress} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.segment, i < page && styles.segmentDone]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  box: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
  titles: { flex: 1 },
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.2, color: colors.mute },
  title: { fontFamily: fonts.bold, fontSize: 21, color: colors.white },
  count: {
    minWidth: 52,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: { fontFamily: fonts.bold, fontSize: 13, color: colors.gold },
  progress: { flexDirection: 'row', gap: 6 },
  segment: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.line },
  segmentDone: { backgroundColor: colors.gold },
});
