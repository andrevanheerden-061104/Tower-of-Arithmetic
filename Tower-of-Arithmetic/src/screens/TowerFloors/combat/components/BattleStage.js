import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import TutorialTarget from '../../../../components/tutorial/TutorialTarget';
import { useReduceMotion } from '../../../../context/MotionContext';

const HURT_RED = '#FF3B30';

// Shakes and flashes red each time `hit` changes (a new number). With
// Reduce motion on there's no shaking and no flashing: just one slow,
// soft red glow, so it's still clear who was hurt.
function useHitAnimation(hit, reduceMotion) {
  const [shake] = useState(() => new Animated.Value(0));
  const [flash] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!hit) return;
    const strong = hit.crit ? 1.6 : 1;
    const pulse = (to, ms) => Animated.timing(flash, { toValue: to, duration: ms, useNativeDriver: true });
    const flashes = reduceMotion
      ? Animated.sequence([pulse(0.4, 250), pulse(0, 450)])
      : Animated.sequence([pulse(0.85, 70), pulse(0.15, 110), pulse(0.75, 70), pulse(0, 260)]);
    const steps = [-10, 10, -8, 8, -5, 5, 0].map((x) =>
      Animated.timing(shake, { toValue: x * strong, duration: 50, easing: Easing.linear, useNativeDriver: true }),
    );
    const animation = reduceMotion ? flashes : Animated.parallel([flashes, Animated.sequence(steps)]);
    animation.start();
    return () => animation.stop();
  }, [hit, reduceMotion, shake, flash]);
  return { shake, flash };
}

// A picture that can shake and flash red: the same picture is drawn
// again on top, tinted red, and faded in and out.
function Sprite({ source, style, label, hit, reduceMotion, extraTransform = [] }) {
  const { shake, flash } = useHitAnimation(hit, reduceMotion);
  return (
    <Animated.View style={[style, { transform: [{ translateX: shake }, ...extraTransform] }]}>
      <Animated.Image source={source} style={styles.fill} resizeMode="contain" accessibilityLabel={label} />
      <Animated.Image source={source} style={[styles.fill, { tintColor: HURT_RED, opacity: flash }]} resizeMode="contain" />
    </Animated.View>
  );
}

// The player (seen from behind, bottom left) facing the enemy (right).
// Sizes and places come from the 402 x 874 Figma frame and scale with
// the phone's width.
//
// Each enemy picture has a different amount of empty space under its
// feet (`ground` in ENEMIES), so the picture is moved down by that much
// and the feet touch its shadow. Flying enemies (`flying`) hover above a
// smaller shadow and bob gently.
//
// `hit` is { who: 'enemy' | 'player', n, crit }: each new n makes that
// side shake and flash red (taking damage).
export default function BattleStage({ character, enemy, boss, defeated, hit = null, reduceMotion: forced = false }) {
  const reduceMotion = useReduceMotion() || forced;
  const { width } = useWindowDimensions();
  const k = width / 402;

  // Tall enemies (the Glass Knight, the Frost Wyvern) are drawn a little
  // bigger (`scale` in ENEMIES) so they don't look tiny
  const base = (boss ? 290 : 150) * k;
  const enemySize = base * (boss ? 1 : enemy.scale ?? 1);
  const enemyLeft = (boss ? 146 : 218) * k - (enemySize - base) / 2;
  const floor = (boss ? 312 : 262) * k; // where the shadow sits
  const hover = enemy.flying ? (boss ? 40 : 34) * k : 0;
  // feet a little into the shadow, so they look planted
  const enemyBottom = floor + 4 * k + hover - (enemy.ground ?? 0) * enemySize;
  const playerSize = 370 * k;

  // Flyers bob up and down (not with Reduce motion)
  const [bob] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!enemy.flying || reduceMotion || defeated) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: -8 * k, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 1200, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enemy.flying, reduceMotion, defeated, bob, k]);

  const shadowWidth = enemySize * (enemy.flying ? 0.5 : 0.8);
  const enemyHit = hit?.who === 'enemy' ? hit : null;
  const playerHit = hit?.who === 'player' ? hit : null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* enemy shadow on the floor */}
      <View
        style={[
          styles.shadow,
          enemy.flying && styles.flyingShadow,
          {
            width: shadowWidth,
            height: (enemy.flying ? 16 : 22) * k,
            left: enemyLeft + (enemySize - shadowWidth) / 2,
            bottom: floor - 8 * k,
          },
        ]}
      />
      <Sprite
        source={enemy.image}
        label={enemy.name}
        hit={enemyHit}
        reduceMotion={reduceMotion}
        extraTransform={[...(enemy.flying ? [{ translateY: bob }] : []), ...(defeated ? [{ scale: 0.9 }] : [])]}
        style={[styles.sprite, { width: enemySize, height: enemySize, left: enemyLeft, bottom: enemyBottom }, defeated && styles.defeated]}
      />
      <TutorialTarget id="enemy" style={{ position: 'absolute', width: enemySize, height: enemySize, left: enemyLeft, bottom: enemyBottom }} />
      <Sprite
        source={character.backImage ?? character.image}
        label={`${character.name}, your character`}
        hit={playerHit}
        reduceMotion={reduceMotion}
        style={[styles.sprite, { width: playerSize, height: playerSize, left: -80 * k, bottom: 154 * k }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sprite: { position: 'absolute' },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' },
  shadow: { position: 'absolute', borderRadius: 100, backgroundColor: 'rgba(0,0,0,0.45)' },
  flyingShadow: { backgroundColor: 'rgba(0,0,0,0.28)' },
  defeated: { opacity: 0.25 },
});
