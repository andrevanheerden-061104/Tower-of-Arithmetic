import { View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import CharacterStage from './components/CharacterStage';
import ContinueRunCard from './components/ContinueRunCard';
import NavTiles from './components/NavTiles';
import ProfileBar from './components/ProfileBar';
import RunStats from './components/RunStats';
import { PLAYER } from '../../data/player';
import { floorsCleared } from '../../game/run';
import styles from './Home.styles';

// The main menu. Player numbers are placeholders from src/data/player.js.
// New run starts a climb; Continue run appears while a run is going.
export default function Home({ navigate, character, run }) {
  const savedRun = run && run.status === 'active'
    ? { floor: Math.max(1, floorsCleared(run)), totalFloors: run.map.floors, hearts: run.hearts, maxHearts: run.maxHearts }
    : null;

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.3} />
      <Shade stops={[[0, 0.85], [0.3, 0.45], [0.58, 0.8], [0.72, 1], [1, 1]]} />

      <View style={styles.content}>
        <ProfileBar player={PLAYER} character={character} onPress={() => navigate('profile')} />

        <CharacterStage character={character} />

        <View style={styles.menu}>
          <RunStats highestFloor={PLAYER.highestFloor} runsCompleted={PLAYER.runsCompleted} />
          {savedRun && <ContinueRunCard run={savedRun} onPress={() => navigate('pathMap')} />}
          <PrimaryButton label="New run" onPress={() => navigate('dungeonType')} />
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
