import { useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Text from '../../../components/AppText';
import { useTextScale } from '../../../context/TextSizeContext';
import { colors, fonts } from '../../../theme/theme';

// The 6-digit code from the email, shown as six boxes. It's one real text
// field underneath, so typing, pasting, the phone's "fill in code" button
// and screen readers all work normally.
export default function CodeInput({ value, onChange, length = 6, onComplete }) {
  const input = useRef(null);
  const [focused, setFocused] = useState(false);
  const textScale = useTextScale();
  const digits = value.split('');

  const change = (text) => {
    const clean = text.replace(/\D/g, '').slice(0, length);
    onChange(clean);
    if (clean.length === length) onComplete?.(clean);
  };

  return (
    <Pressable onPress={() => input.current?.focus()} accessible={false} style={styles.row}>
      {Array.from({ length }, (_, i) => {
        const active = focused && (i === digits.length || (i === length - 1 && digits.length === length));
        return (
          <View key={i} style={[styles.box, digits[i] && styles.filled, active && styles.active]} importantForAccessibility="no">
            <Text style={[styles.digit, { fontSize: 26 * textScale }]}>{digits[i] ?? ''}</Text>
          </View>
        );
      })}
      <TextInput
        ref={input}
        value={value}
        onChangeText={change}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        inputMode="numeric"
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        maxLength={length}
        autoFocus
        caretHidden
        accessibilityLabel={`${length}-digit code from your email`}
        style={styles.hidden}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  box: {
    flex: 1,
    maxWidth: 52,
    aspectRatio: 0.82,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: { borderColor: colors.gold },
  active: { borderColor: colors.gold, borderWidth: 2 },
  digit: { fontFamily: fonts.bold, color: colors.white },
  // Covers the boxes, invisible, so a tap anywhere focuses it
  hidden: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.01, color: 'transparent' },
});
