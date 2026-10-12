import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenBackground from '../../../components/ScreenBackground';
import Shade from '../../../components/Shade';
import RunTitle from '../../../components/run/RunTitle';
import { makeSpellOffers, runVersion } from '../../../game/run';
import { MAX_DECK } from '../../../game/spells';
import CardCarousel from './components/CardCarousel';
import PagerDots from './components/PagerDots';
import styles from './ChooseSpell.styles';

// Pick one of three spell cards. The player must take one (there is no
// skip). It goes into the deck, or into the stash when the deck already has
// 5 cards; stash cards can be swapped in on the Deck screen. Cards the
// player already has aren't offered, and higher floors offer stronger cards
// (see spellOffers in src/game/spells.js). The offers are picked when the
// fight is won (run.offers), so they stay the same if the player goes back.
export default function ChooseSpell({ run, onDone, onSpellBack, spellFrom }) {
  const version = runVersion(run);
  const [offers] = useState(() => run.offers ?? makeSpellOffers(run));
  const [index, setIndex] = useState(Math.min(1, offers.length - 1));
  const full = run.deck.length >= MAX_DECK;
  // From the victory screen the player can go back and look first; the
  // ghost's gift has to be picked straight away.
  const canGoBack = spellFrom === 'reward';

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.12} />
      <Shade stops={[[0, 0.5], [1, 1]]} />

      <View style={styles.content}>
        <View style={styles.header}>
          {canGoBack ? (
            <Pressable onPress={onSpellBack} accessibilityRole="button" accessibilityLabel="Go back" style={styles.box}>
              <Icon name="arrowLeft" size={22} />
            </Pressable>
          ) : (
            <View style={styles.spacer} />
          )}
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
          {full && (
            <Text style={styles.note}>
              Your deck is full, so this card goes to your stash. Swap it in on the Deck screen.
            </Text>
          )}
          <PrimaryButton label={full ? 'Add to stash' : 'Add to deck'} onPress={() => onDone(offers[index])} />
        </View>
      </View>
    </View>
  );
}
