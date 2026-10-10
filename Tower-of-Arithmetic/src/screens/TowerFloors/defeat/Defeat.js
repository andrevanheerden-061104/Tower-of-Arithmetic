import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import FloorProgress from '../../../components/run/FloorProgress';
import { currentRoom, floorsCleared } from '../../../game/run';
import DefeatHero from './components/DefeatHero';
import RunSummaryTiles from './components/RunSummaryTiles';
import styles from './Defeat.styles';

// Out of hearts. Shows how far the player got and what the run earned.
export default function Defeat({ navigate, run, character, onEndRun }) {
  const fellOn = Math.max(1, currentRoom(run).floor);
  const total = run.map.floors;

  return (
    <View style={styles.screen}>
      <DefeatHero character={character} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titles}>
          <Text style={styles.title} accessibilityRole="header">
            Defeated
          </Text>
          <Text style={styles.subtitle}>YOU FELL ON FLOOR {fellOn}</Text>
          <Text style={styles.body}>The tower will wait. Every run makes your magic stronger.</Text>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerText}>◆  This run  ◆</Text>
        </View>

        <FloorProgress total={total} current={fellOn} outcome="fell" label={`Fell on floor ${fellOn}`} />

        <RunSummaryTiles cleared={floorsCleared(run)} total={total} solved={run.stats.solved} xp={run.xp} />
        <Text style={styles.saved}>Your XP and badges are saved.</Text>

        <PrimaryButton label="Run stats" onPress={() => navigate('runStats')} />
        <PrimaryButton label="Back to home" variant="secondary" onPress={onEndRun} />
      </ScrollView>
    </View>
  );
}
