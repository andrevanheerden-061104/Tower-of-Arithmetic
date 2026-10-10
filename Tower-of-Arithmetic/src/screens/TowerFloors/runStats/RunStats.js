import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenHeader from '../../../components/ScreenHeader';
import ScreenBackground from '../../../components/ScreenBackground';
import Shade from '../../../components/Shade';
import { getDungeonType } from '../../../game/versions';
import { floorsCleared, runVersion } from '../../../game/run';
import AccuracyCard from './components/AccuracyCard';
import AdviceCard from './components/AdviceCard';
import ErrorBreakdown from './components/ErrorBreakdown';
import FloorBars from './components/FloorBars';
import styles from './RunStats.styles';

// How the run went: accuracy, hints, errors, accuracy per floor, where the
// errors came from and the Archmage's advice. Counts come from the run;
// the error breakdown and advice are placeholders for now.
export default function RunStats({ run, onEndRun, onNewRun }) {
  const version = runVersion(run);
  const dungeon = getDungeonType(version, run.dungeonTypeId);
  const { solved, errors, hints, bestStreak, floors } = run.stats;
  const answered = solved + errors;
  const accuracy = answered ? Math.round((solved / answered) * 100) : 0;
  const reached = Math.max(1, floorsCleared(run));

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.12} />
      <Shade stops={[[0, 0.5], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Run stats" onBack={onEndRun} />
        <Text style={styles.subtitle}>
          {dungeon.label}
          {dungeon.id === 'mixed' ? '' : ' dungeon'}  ·  {run.status === 'won' ? 'tower cleared!' : `reached floor ${reached} of ${run.map.floors}`}
        </Text>

        <AccuracyCard accuracy={accuracy} solved={solved} hints={hints} errors={errors} bestStreak={bestStreak} />
        <FloorBars floors={floors} />
        <ErrorBreakdown errors={errors} versionId={version.id} />
        <AdviceCard versionId={version.id} />

        <PrimaryButton label="New run" onPress={onNewRun} />
      </ScrollView>
    </View>
  );
}
