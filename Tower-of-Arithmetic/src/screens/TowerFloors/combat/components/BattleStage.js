import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';

// The player (seen from behind, bottom left) facing the enemy (right).
// Sizes and places come from the 402 x 874 Figma frame and scale with
// the phone's width.
export default function BattleStage({ character, enemy, boss, defeated }) {
  const { width } = useWindowDimensions();
  const k = width / 402;

  const enemySize = (boss ? 290 : 150) * k;
  const enemyLeft = (boss ? 146 : 218) * k;
  const enemyBottom = (boss ? 312 : 262) * k;
  const playerSize = 370 * k;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* enemy shadow on the floor */}
      <View
        style={[
          styles.shadow,
          {
            width: enemySize * 0.8,
            height: 22 * k,
            left: enemyLeft + enemySize * 0.1,
            bottom: enemyBottom - 8 * k,
          },
        ]}
      />
      <Image
        source={enemy.image}
        style={[
          styles.sprite,
          { width: enemySize, height: enemySize, left: enemyLeft, bottom: enemyBottom },
          defeated && styles.defeated,
        ]}
        resizeMode="contain"
        accessibilityLabel={enemy.name}
      />
      <Image
        source={character.backImage ?? character.image}
        style={[styles.sprite, { width: playerSize, height: playerSize, left: -80 * k, bottom: 154 * k }]}
        resizeMode="contain"
        accessibilityLabel={`${character.name}, your character`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sprite: { position: 'absolute' },
  shadow: { position: 'absolute', borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.45)' },
  defeated: { opacity: 0.25, transform: [{ scale: 0.9 }] },
});
