import { Image, StyleSheet } from 'react-native';
import Shade from '../Shade';

// Background picture for a tower room, filling the whole screen, with a
// dark tint over it so the text on top stays readable (darker at the top
// and bottom, lighter in the middle where the fight happens).
export const BACKGROUNDS = {
  // Fight corridors (one is picked at random for each room, see
  // floorBackground in src/game/tower.js)
  corridor: require('../../assets/backgrounds/dungaon back 1.jpg'),
  corridorMoon: require('../../assets/backgrounds/dungaon back 2.jpg'),
  corridorLibrary: require('../../assets/backgrounds/dungaon back 3.jpg'),
  // Boss rooms (one is picked at random for each climb)
  bossDoor: require('../../assets/backgrounds/shadowBossBack.jpg'),
  bossThrone: require('../../assets/backgrounds/bossBackground2.jpg'),
  librarian: require('../../assets/backgrounds/LibaraianEncouncounter.jpg'),
  shop: require('../../assets/backgrounds/shopBack.jpg'),
  ghost: require('../../assets/backgrounds/ghostEncouncounter.jpg'),
  campfireRest: require('../../assets/backgrounds/campfireRest.jpg'),
  campfireRemove: require('../../assets/backgrounds/campfireRemove.jpg'),
};

const DEFAULT_TINT = [
  [0, 0.55],
  [0.45, 0.3],
  [0.7, 0.6],
  [1, 0.9],
];

export default function RunBackground({ image = 'corridor', tint = DEFAULT_TINT }) {
  return (
    <>
      <Image
        source={BACKGROUNDS[image] ?? image}
        style={[StyleSheet.absoluteFill, styles.image]}
        resizeMode="cover"
        pointerEvents="none"
      />
      <Shade stops={tint} />
    </>
  );
}

const styles = StyleSheet.create({
  image: { width: '100%', height: '100%' },
});
