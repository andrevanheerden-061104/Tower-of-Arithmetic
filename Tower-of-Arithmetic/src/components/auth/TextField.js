import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Text from '../AppText';
import { useTextScale } from '../../context/TextSizeContext';
import Icon from '../Icon';
import { colors, fonts } from '../../theme/theme';

// A labelled text input with an icon. Set `secure` for passwords:
// it hides the text and adds a show / hide button.
export default function TextField({ label, placeholder, icon, value, onChangeText, secure = false, ...inputProps }) {
  // The typed text follows the Text size setting too
  const textScale = useTextScale();
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.field, focused && styles.fieldFocused]}>
        <Icon name={icon} size={20} color={colors.mute} />

        <TextInput
          style={[styles.input, { fontSize: 15 * textScale }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.mute}
          secureTextEntry={hidden}
          accessibilityLabel={label}
          autoCapitalize="none"
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />

        {secure && (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            hitSlop={12}
            style={styles.eye}
          >
            <Icon name={hidden ? 'eye' : 'eyeOff'} size={20} color={colors.mute} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6, alignSelf: 'stretch' },
  label: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.mute,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
  fieldFocused: { borderColor: colors.gold, borderWidth: 2 },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.white,
  },
  eye: { minWidth: 28, minHeight: 28, alignItems: 'center', justifyContent: 'center' },
});
