import { useEffect, useState } from 'react';
import { Animated, Image, Modal, StyleSheet, View } from 'react-native';
import Text from './AppText';
import PrimaryButton from './PrimaryButton';
import { playSfx } from '../audio/sfx';
import { useReduceMotion } from '../context/MotionContext';
import { colors, fonts } from '../theme/theme';

// The popup when a badge unlocks: the badge grows in with a glow, its
// name and what it was for. App.js shows it on calm screens (not in the
// middle of a fight).
export default function BadgeUnlocked({ badge, guest, onClose }) {
  const still = useReduceMotion(); // Reduce motion: no bounce, no fade
  const [grow] = useState(() => new Animated.Value(still ? 1 : 0.4));
  useEffect(() => {
    playSfx('victory');
    if (still) return;
    Animated.spring(grow, { toValue: 1, friction: 5, tension: 70, useNativeDriver: true }).start();
  }, [grow, still]);

  return (
    <Modal transparent animationType={still ? 'none' : 'fade'} visible onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.kicker}>Badge unlocked!</Text>
          <View style={styles.glow}>
            <Animated.View style={{ transform: [{ scale: grow }] }}>
              <Image source={badge.image} style={styles.image} resizeMode="contain" accessibilityLabel={`${badge.name} badge`} />
            </Animated.View>
          </View>
          <Text style={styles.name} accessibilityRole="header">
            {badge.name}
          </Text>
          <Text style={styles.description}>{badge.description}</Text>
          {guest ? <Text style={styles.guest}>Playing as a guest: make an account to keep your badges.</Text> : null}
          <PrimaryButton label="Brilliant!" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(5,4,10,0.82)' },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    gap: 12,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: '#1E1A2B',
  },
  kicker: { fontFamily: fonts.bold, fontSize: 13, letterSpacing: 1.6, textTransform: 'uppercase', color: colors.gold },
  glow: {
    width: 170,
    height: 170,
    borderRadius: 85,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(242,234,121,0.10)',
  },
  image: { width: 150, height: 150 },
  name: { fontFamily: fonts.display ?? fonts.bold, fontSize: 24, color: colors.white, textAlign: 'center' },
  description: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21, color: colors.mute, textAlign: 'center' },
  guest: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 17, color: colors.mute, textAlign: 'center', fontStyle: 'italic' },
});
