import { useCallback } from 'react';
import { View } from 'react-native';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import { useReduceMotion } from '../../context/MotionContext';
import { usePlayer } from '../../hooks/usePlayer';
import SplashBrand from './components/SplashBrand';
import SplashStart from './components/SplashStart';
import SplashVideo from './components/SplashVideo';
import styles from './Splash.styles';

// First screen: the looping tower video with the game title and a start
// button. A player who is still logged in goes straight Home.
export default function Splash({ navigate }) {
  const { signedIn, profile } = usePlayer();
  const still = useReduceMotion(); // Reduce motion: the still tower picture, not the video
  // Called once the loading bar has filled
  const start = useCallback(() => {
    if (!signedIn) navigate('signup');
    else navigate(profile && !profile.grade ? 'onboarding' : 'home');
  }, [navigate, signedIn, profile]);

  return (
    <View style={styles.screen}>
      {still ? <ScreenBackground /> : <SplashVideo />}
      {/* Darken the top and bottom so the title and button stay readable */}
      <Shade stops={[[0, 0.85], [0.18, 0.6], [0.32, 0.2], [0.42, 0], [0.7, 0], [0.85, 0.5], [1, 0.9]]} />

      <View style={styles.content}>
        <SplashBrand />
        <SplashStart onStart={start} />
      </View>
    </View>
  );
}
