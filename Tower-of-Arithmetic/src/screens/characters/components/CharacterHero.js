import { Image, Pressable, StyleSheet, View } from 'react-native';
import Icon from '../../../components/Icon';
import { colors } from '../../../theme/theme';

// The large character picture on a coloured disc, with arrows to switch
// character and dots showing which one you are on.
export default function CharacterHero({ character, index, total, onPrevious, onNext }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.disc} />

      <Image
        source={character.image}
        resizeMode="contain"
        // Locked characters are drawn as a black silhouette
        style={[styles.image, character.locked && styles.silhouette]}
        accessibilityLabel={character.locked ? 'Locked character, shown as a silhouette' : `${character.name}, ${character.title}`}
      />

      {character.locked && (
        <View style={styles.lock}>
          <Icon name="lock" size={30} color={colors.gold} />
        </View>
      )}

      <Pressable
        onPress={onPrevious}
        accessibilityRole="button"
        accessibilityLabel="Previous character"
        style={({ pressed }) => [styles.arrow, styles.arrowLeft, pressed && styles.pressed]}
      >
        <Icon name="chevronLeft" size={22} />
      </Pressable>

      <Pressable
        onPress={onNext}
        accessibilityRole="button"
        accessibilityLabel="Next character"
        style={({ pressed }) => [styles.arrow, styles.arrowRight, pressed && styles.pressed]}
      >
        <Icon name="chevronRight" size={22} />
      </Pressable>

      <View style={styles.dots} accessibilityLabel={`Character ${index + 1} of ${total}`}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const DISC = 250;

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minHeight: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disc: {
    position: 'absolute',
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    backgroundColor: colors.indigo,
  },
  image: { width: '100%', height: '108%' },
  silhouette: { tintColor: '#000000' },
  lock: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: { left: -12 },
  arrowRight: { right: -12 },
  pressed: { opacity: 0.8 },
  dots: { position: 'absolute', left: 0, bottom: 0, flexDirection: 'row', gap: 6 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: colors.mute,
  },
  dotActive: { backgroundColor: colors.gold, borderColor: colors.gold },
});
