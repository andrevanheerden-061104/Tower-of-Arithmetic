import { useCallback, useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import SplashLoading from './SplashLoading';
import { colors, fonts } from '../../../theme/theme';

const SHOW_DELAY = 1200; // ms before the button fades in

// The bottom of the splash screen: the start button, which is swapped
// for a loading bar once it has been pressed.
export default function SplashStart({ onStart }) {
  // useState keeps the same animated value for the life of the component
  const [opacity] = useState(() => new Animated.Value(0));
  const [loading, setLoading] = useState(false);

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

  // useCallback keeps the same function between renders, so the loading
  // bar's animation is not restarted.
  const handleLoaded = useCallback(() => onStart(), [onStart]);

  return (
    <Animated.View style={[styles.wrap, { opacity }]}>
      {loading ? (
        <SplashLoading onDone={handleLoaded} />
      ) : (
        <>
          <PrimaryButton label="Start game" onPress={() => setLoading(true)} />
          <Text style={styles.hint}>Climb the tower. Cast spells with maths.</Text>
        </>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', alignItems: 'center', gap: 14 },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
});
