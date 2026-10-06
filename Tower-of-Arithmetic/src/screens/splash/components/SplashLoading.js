import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import { colors, fonts } from '../../../theme/theme';

const LOAD_TIME = 1000; // ms the bar takes to fill

// The loading bar shown after "Start game" is pressed.
// It fills once, then calls onDone so the splash screen can move on.
export default function SplashLoading({ onDone }) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: LOAD_TIME,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false, // width can't be animated on the native driver
    });
    animation.start(({ finished }) => {
      if (finished) onDone();
    });
    return () => animation.stop();
  }, [progress, onDone]);

  const width = progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });

  return (
    <View style={styles.wrap} accessibilityRole="progressbar" accessibilityLabel="Loading the tower">
      <Text style={styles.title}>Entering the tower</Text>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
      <Text style={styles.hint}>Preparing the tower…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'stretch', alignItems: 'center', gap: 14, minHeight: 88, justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 16, color: colors.white },
  track: {
    width: 200,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(253,250,245,0.2)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 3, backgroundColor: colors.gold },
  hint: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
});
