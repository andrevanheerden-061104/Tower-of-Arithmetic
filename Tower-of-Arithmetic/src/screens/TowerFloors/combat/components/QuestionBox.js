import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import { colors, fonts } from '../../../../theme/theme';

// The sum in a dark box: a short instruction and the sum in big numbers.
export default function QuestionBox({ question, compact, children }) {
  return (
    <View style={styles.box} accessible accessibilityLabel={`${question.instruction}. ${question.display}`}>
      <Text style={styles.instruction}>{question.instruction}</Text>
      <Text style={[styles.sum, compact && styles.compact]} adjustsFontSizeToFit numberOfLines={1}>
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
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  instruction: { fontFamily: fonts.medium, fontSize: 14, color: colors.white, textAlign: 'center' },
  sum: { fontFamily: fonts.bold, fontSize: 36, color: colors.white },
  compact: { fontSize: 28 },
});
