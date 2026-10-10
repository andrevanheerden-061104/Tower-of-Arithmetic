import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenBackground from '../../../components/ScreenBackground';
import Shade from '../../../components/Shade';
import RunTitle from '../../../components/run/RunTitle';
import { runVersion } from '../../../game/run';
import { MAX_DECK, SPELL_IDS } from '../../../game/spells';
import CardCarousel from './components/CardCarousel';
import PagerDots from './components/PagerDots';
import styles from './ChooseSpell.styles';

// Pick one of three spell cards to add to the deck (or skip).
export default function ChooseSpell({ run, onDone }) {
  const version = runVersion(run);
  const [index, setIndex] = useState(1);
  const offers = SPELL_IDS; // placeholder: one of each spell
  const full = run.deck.length >= MAX_DECK;

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.12} />
      <Shade stops={[[0, 0.5], [1, 1]]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => onDone(null)} accessibilityRole="button" accessibilityLabel="Go back" style={styles.box}>
            <Icon name="arrowLeft" size={22} />
          </Pressable>
          <RunTitle style={styles.title}>Choose a spell</RunTitle>
          <View style={styles.box} accessible accessibilityLabel={`Deck ${run.deck.length} of ${MAX_DECK}`}>
            <Text style={styles.count}>
              {run.deck.length} / {MAX_DECK}
            </Text>
          </View>
        </View>

        <CardCarousel spells={offers} index={index} onChange={setIndex} cardSet={version.cardSet} />
        <PagerDots count={offers.length} index={index} />

        <View style={styles.footer}>
          <PrimaryButton
            label={full ? 'Deck is full' : 'Add to deck'}
            disabled={full}
            onPress={() => onDone(offers[index])}
          />
          <Pressable onPress={() => onDone(null)} accessibilityRole="button" style={styles.skip}>
            <Text style={styles.skipText}>Skip, take no spell</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
