import { Pressable, StyleSheet, View } from 'react-native';
import CharacterPortrait from '../../../components/CharacterPortrait';
import Icon from '../../../components/Icon';
import { colors } from '../../../theme/theme';

const SIZE = 56;

// One small square portrait in the roster. Locked characters show as a
// silhouette with a padlock on top.
export default function CharacterThumb({ character, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={character.locked ? 'Locked character' : `View ${character.name}`}
      style={({ pressed }) => pressed && styles.pressed}
    >
      <CharacterPortrait
        character={character}
        size={SIZE}
        radius={14}
        borderWidth={active ? 2 : 1}
        borderColor={active ? colors.gold : colors.border}
        zoom={2.6}
      />

      {character.locked && (
        <View style={styles.lock} pointerEvents="none">
          <Icon name="lock" size={18} color={colors.gold} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.8 },
  lock: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
