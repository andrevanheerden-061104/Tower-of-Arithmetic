import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import ScreenBackground from '../../../components/ScreenBackground';
import ScreenHeader from '../../../components/ScreenHeader';
import Shade from '../../../components/Shade';
import { deckLocked, runVersion } from '../../../game/run';
import { MAX_DECK } from '../../../game/spells';
import DeckGrid from './components/DeckGrid';
import StashGrid from './components/StashGrid';
import SwapBar from './components/SwapBar';
import styles from './Deck.styles';

// The player's spells this run (opened from the run menu).
//   Deck   up to 5 cards, the ones used in fights
//   Stash  every other card collected this run
// Tap a card to pick it, then tap a card in the other group to swap them
// (or an empty deck slot to move a stash card in). Cards can't be changed
// in the middle of a fight. All cards are lost when the run ends.
export default function Deck({ run, goBack, onSwapSpell, onMoveToStash, onMoveToDeck }) {
  const version = runVersion(run);
  const locked = deckLocked(run);
  const [picked, setPicked] = useState(null); // { area: 'deck' | 'stash', index }

  const done = (action) => {
    action();
    setPicked(null);
  };
  const toggle = (area, index) =>
    setPicked((p) => (p?.area === area && p.index === index ? null : { area, index }));

  const onDeckCard = (index) => {
    if (picked?.area === 'stash') done(() => onSwapSpell(index, picked.index));
    else toggle('deck', index);
  };
  const onStashCard = (index) => {
    if (picked?.area === 'deck') done(() => onSwapSpell(picked.index, index));
    else toggle('stash', index);
  };
  const onEmptySlot = () => {
    if (picked?.area === 'stash') done(() => onMoveToDeck(picked.index));
  };

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.12} />
      <Shade stops={[[0, 0.5], [1, 1]]} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Deck" onBack={goBack} />

        <View style={styles.section}>
          <Text style={styles.heading} accessibilityRole="header">
            Deck · {run.deck.length} of {MAX_DECK}
          </Text>
          <Text style={styles.detail}>These cards are in your hand in every fight.</Text>
          <DeckGrid
            deck={run.deck}
            cardSet={version.cardSet}
            slots={MAX_DECK}
            picked={picked?.area === 'deck' ? picked.index : null}
            locked={locked}
            onPick={onDeckCard}
            onEmptySlot={picked?.area === 'stash' ? onEmptySlot : null}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading} accessibilityRole="header">
            Stash · {run.stash.length} {run.stash.length === 1 ? 'card' : 'cards'}
          </Text>
          <Text style={styles.detail}>
            Cards you win when your deck is full wait here. All cards are lost when this tower run ends.
          </Text>
          <StashGrid
            stash={run.stash}
            cardSet={version.cardSet}
            picked={picked?.area === 'stash' ? picked.index : null}
            locked={locked}
            onPick={onStashCard}
          />
        </View>
      </ScrollView>

      <SwapBar
        locked={locked}
        picked={picked}
        deckFull={run.deck.length >= MAX_DECK}
        deckSize={run.deck.length}
        hasStash={run.stash.length > 0}
        onMoveToStash={() => done(() => onMoveToStash(picked.index))}
        onMoveToDeck={() => done(() => onMoveToDeck(picked.index))}
        onCancel={() => setPicked(null)}
      />
    </View>
  );
}
