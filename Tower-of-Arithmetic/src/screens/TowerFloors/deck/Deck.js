import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import ScreenBackground from '../../../components/ScreenBackground';
import ScreenHeader from '../../../components/ScreenHeader';
import Shade from '../../../components/Shade';
import { runVersion } from '../../../game/run';
import { MAX_DECK } from '../../../game/spells';
import DeckGrid from './components/DeckGrid';
import styles from './Deck.styles';

// The spells in the player's deck this run (opened from the run menu).
export default function Deck({ run, goBack }) {
  const version = runVersion(run);
  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.12} />
      <Shade stops={[[0, 0.5], [1, 1]]} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Deck" onBack={goBack} />
        <Text style={styles.count}>
          {run.deck.length} of {MAX_DECK} spells · win fights to collect more
        </Text>
        <DeckGrid deck={run.deck} cardSet={version.cardSet} slots={MAX_DECK} />
      </ScrollView>
    </View>
  );
}
