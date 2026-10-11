import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import GeometryFigure from '../../../../components/run/GeometryFigure';
import { colors, fonts } from '../../../../theme/theme';

// The sum in a dark box: a short instruction, a drawing when the sum has
// one (geometry, rectangles) and the sum in big numbers. A word problem's
// story is shown above the sum.
export default function QuestionBox({ question, compact, children }) {
  const spoken = [question.story, question.instruction, question.display].filter(Boolean).join('. ');
  return (
    <View style={styles.box} accessible accessibilityLabel={spoken}>
      {question.story ? <Text style={styles.story}>{question.story}</Text> : null}
      <Text style={styles.instruction} testID="question-instruction">{question.instruction}</Text>
      <GeometryFigure figure={question.figure} height={compact ? 130 : 160} />
      <Text style={[styles.sum, compact && styles.compact]} testID="question-sum" adjustsFontSizeToFit minimumFontScale={0.5} numberOfLines={2}>
        {question.display}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  story: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, color: colors.white, textAlign: 'center' },
  instruction: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 19, color: colors.white, textAlign: 'center' },
  sum: { fontFamily: fonts.bold, fontSize: 36, color: colors.white, textAlign: 'center' },
  compact: { fontSize: 28 },
});
