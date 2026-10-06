import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import { colors, fonts } from '../../../theme/theme';

const SHOW_DELAY = 1200; // ms before the button fades in

// The start button at the bottom of the splash screen.
export default function SplashStart({ onStart }) {
  // useState keeps the same animated value for the life of the component
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(SHOW_DELAY),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View style={[styles.wrap, { opacity }]}>
      <PrimaryButton label="Start game" onPress={onStart} />
      <Text style={styles.hint}>Climb the tower. Cast spells with maths.</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', alignItems: 'center', gap: 14 },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
});
