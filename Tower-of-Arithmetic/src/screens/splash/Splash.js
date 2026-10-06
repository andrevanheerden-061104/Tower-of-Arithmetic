import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import SplashBrand from './components/SplashBrand';
import SplashStart from './components/SplashStart';
import styles from './Splash.styles';

// First screen: the tower artwork with the game title and a start button.
export default function Splash({ navigate }) {
  return (
    <View style={styles.screen}>
      <StatusBar hidden />
      <ScreenBackground />
      {/* Darken the top and bottom so the title and button stay readable */}
      <Shade stops={[[0, 0.85], [0.18, 0.6], [0.32, 0.2], [0.42, 0], [0.7, 0], [0.85, 0.5], [1, 0.9]]} />

      <View style={styles.content}>
        <SplashBrand />
        <SplashStart onStart={() => navigate('signup')} />
      </View>
    </View>
  );
}
