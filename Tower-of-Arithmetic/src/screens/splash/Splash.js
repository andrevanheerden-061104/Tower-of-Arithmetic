import { useCallback } from 'react';
import { View } from 'react-native';
import Shade from '../../components/Shade';
import SplashBrand from './components/SplashBrand';
import SplashStart from './components/SplashStart';
import SplashVideo from './components/SplashVideo';
import styles from './Splash.styles';

// First screen: the looping tower video with the game title and a start button.
export default function Splash({ navigate }) {
  // Called once the loading bar has filled
  const goToSignup = useCallback(() => navigate('signup'), [navigate]);

  return (
    <View style={styles.screen}>
      <SplashVideo />
      {/* Darken the top and bottom so the title and button stay readable */}
      <Shade stops={[[0, 0.85], [0.18, 0.6], [0.32, 0.2], [0.42, 0], [0.7, 0], [0.85, 0.5], [1, 0.9]]} />

      <View style={styles.content}>
        <SplashBrand />
        <SplashStart onStart={goToSignup} />
      </View>
    </View>
  );
}
