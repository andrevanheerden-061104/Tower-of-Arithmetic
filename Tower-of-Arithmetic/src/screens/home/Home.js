import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import PrimaryButton from '../../components/PrimaryButton';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import CharacterStage from './components/CharacterStage';
import ContinueRunCard from './components/ContinueRunCard';
import NavTiles from './components/NavTiles';
import ProfileBar from './components/ProfileBar';
import RunStats from './components/RunStats';
import styles from './Home.styles';

// Placeholder player data until the backend exists.
const PLAYER = {
  name: 'Shadow',
  rank: 'Apprentice',
  level: 3,
  xp: 640,
  xpToNext: 1000,
  highestFloor: 7,
  runsCompleted: 12,
};

const SAVED_RUN = { floor: 4, totalFloors: 10, hearts: 2, maxHearts: 3 };

// The main menu. The buttons are wired up but don't lead anywhere yet.
export default function Home({ navigate }) {
  const notBuiltYet = (name) => () => console.log(`${name} pressed (screen not built yet)`);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScreenBackground opacity={0.3} />
      <Shade stops={[[0, 0.85], [0.3, 0.45], [0.58, 0.8], [0.72, 1], [1, 1]]} />

      <View style={styles.content}>
        <ProfileBar player={PLAYER} onPress={notBuiltYet('Profile')} />

        <CharacterStage />

        <View style={styles.menu}>
          <RunStats highestFloor={PLAYER.highestFloor} runsCompleted={PLAYER.runsCompleted} />
          <ContinueRunCard run={SAVED_RUN} onPress={notBuiltYet('Continue run')} />
          <PrimaryButton label="New run" onPress={notBuiltYet('New run')} />
          <NavTiles
            onCharacters={notBuiltYet('Characters')}
            onProfile={notBuiltYet('Profile')}
            onSettings={notBuiltYet('Settings')}
          />
        </View>
      </View>
    </View>
  );
}
