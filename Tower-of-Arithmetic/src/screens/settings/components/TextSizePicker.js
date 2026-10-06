import { StyleSheet, Text, View } from 'react-native';
import TextSizeOption from './TextSizeOption';
import { colors, fonts } from '../../../theme/theme';

const SIZES = [
  { id: 'small', label: 'Small', sampleSize: 14 },
  { id: 'medium', label: 'Medium', sampleSize: 18 },
  { id: 'large', label: 'Large', sampleSize: 22 },
];

// Choose how big the text in the game should be.
export default function TextSizePicker({ value, onChange }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Text size</Text>
      <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel="Text size">
        {SIZES.map((size) => (
          <TextSizeOption
            key={size.id}
            label={size.label}
            sampleSize={size.sampleSize}
            selected={value === size.id}
            onPress={() => onChange(size.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  label: { fontFamily: fonts.semibold, fontSize: 15, color: colors.white },
  options: { flexDirection: 'row', gap: 10 },
});
