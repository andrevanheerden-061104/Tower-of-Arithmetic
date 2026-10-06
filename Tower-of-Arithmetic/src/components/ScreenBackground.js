import { Image, StyleSheet } from 'react-native';

// A 1080px-wide copy of splash.png; the original is too large to load on phones.
const towerArt = require('../assets/vidoes/splash-bg.jpg');

// The tower artwork, used full strength on the splash screen
// and dimmed behind the other screens.
//
// It exactly fills the screen; resizeMode "cover" scales it up until there
// are no gaps and trims whatever sticks out, equally on both sides.
// (The image is never bigger than the screen, which keeps Android happy.)
export default function ScreenBackground({ opacity = 1 }) {
  return (
    <Image
      source={towerArt}
      style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', opacity }]}
      resizeMode="cover"
      pointerEvents="none"
      onError={(e) => console.warn('Background image failed to load:', e.nativeEvent?.error)}
    />
  );
}
