import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenHeader from '../../../components/ScreenHeader';
import ScreenBackground from '../../../components/ScreenBackground';
import Shade from '../../../components/Shade';
import { getDungeonType } from '../../../game/versions';
import { floorsCleared, runVersion } from '../../../game/run';
import { towerTop } from '../../../game/tower';
import { topicResults } from '../../../game/runSummary';
import { useRunSummary } from '../../../hooks/useRunSummary';
import AccuracyCard from './components/AccuracyCard';
import AdviceCard from './components/AdviceCard';
import ErrorBreakdown from './components/ErrorBreakdown';
import FloorBars from './components/FloorBars';
import styles from './RunStats.styles';

// How the run went: accuracy, hints, errors, accuracy per floor, which maths
// topics the wrong answers were in, and Orrin's advice. Everything comes
// from the run's real counts. The advice is written by the AI from those
// results and the sums that were missed; if the server can't be reached,
// the game writes its own from the same results (src/game/runSummary.js).
export default function RunStats({ run, onEndRun, onNewRun }) {
  const version = runVersion(run);
  const dungeon = getDungeonType(version, run.dungeonTypeId);
  const { solved, errors, hints, bestStreak, floors } = run.stats;
  const answered = solved + errors;
  const accuracy = answered ? Math.round((solved / answered) * 100) : 0;
  const reached = Math.max(1, floorsCleared(run));
  const orrin = useRunSummary(run);
  const focusLabel = version.dungeonTypes.find((t) => t.id === orrin.focusTopic)?.label;

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.12} />
      <Shade stops={[[0, 0.5], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Run stats" onBack={onEndRun} />
        <Text style={styles.subtitle}>
          {dungeon.label}
          {dungeon.id === 'mixed' ? '' : ' dungeon'}  ·  {run.status === 'won' ? `${reached} floors cleared!` : `reached floor ${reached} of ${towerTop(run)}`}
        </Text>

        <AccuracyCard accuracy={accuracy} solved={solved} hints={hints} errors={errors} bestStreak={bestStreak} />
        <FloorBars floors={floors} />
        <ErrorBreakdown rows={topicResults(run, version)} />
        <AdviceCard summary={orrin.summary} focus={focusLabel} loading={orrin.loading} />

        <PrimaryButton label="New run" onPress={onNewRun} />
      </ScrollView>
    </View>
  );
}
