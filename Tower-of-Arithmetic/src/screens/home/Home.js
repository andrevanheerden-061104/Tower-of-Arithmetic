import { View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import CharacterStage from './components/CharacterStage';
import ContinueRunCard from './components/ContinueRunCard';
import NavTiles from './components/NavTiles';
import ProfileBar from './components/ProfileBar';
import RunStats from './components/RunStats';
import { PLAYER, SAVED_RUN } from '../../data/player';
import styles from './Home.styles';

// The main menu. Player numbers are placeholders from src/data/player.js.
// Continue run and New run don't lead anywhere yet.
export default function Home({ navigate, character }) {
  const notBuiltYet = (name) => () => console.log(`${name} pressed (screen not built yet)`);

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.3} />
      <Shade stops={[[0, 0.85], [0.3, 0.45], [0.58, 0.8], [0.72, 1], [1, 1]]} />

      <View style={styles.content}>
        <ProfileBar player={PLAYER} character={character} onPress={() => navigate('profile')} />

        <CharacterStage character={character} />

        <View style={styles.menu}>
          <RunStats highestFloor={PLAYER.highestFloor} runsCompleted={PLAYER.runsCompleted} />
          <ContinueRunCard run={SAVED_RUN} onPress={notBuiltYet('Continue run')} />
          <PrimaryButton label="New run" onPress={notBuiltYet('New run')} />
          <NavTiles
            onCharacters={() => navigate('characters')}
            onProfile={() => navigate('profile')}
            onSettings={() => navigate('settings')}
          />
        </View>
      </View>
    </View>
  );
}
