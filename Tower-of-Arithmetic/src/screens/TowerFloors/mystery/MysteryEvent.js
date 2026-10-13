import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import EventHero from '../../../components/run/EventHero';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import TutorialTarget from '../../../components/tutorial/TutorialTarget';
import { ghostGifts, librarianGifts } from '../../../game/encounters';
import { currentRoom, runVersion } from '../../../game/run';
import { mysteryEvent, roomRandom } from '../../../game/tower';
import GiftList from './components/GiftList';
import styles from './MysteryEvent.styles';

// The events a mystery room can hold (one is picked at random per room,
// see mysteryEvent in src/game/tower.js). Both offer three gifts; the
// player takes one.
const EVENTS = {
  ghost: {
    hero: { image: 'ghost', aspect: 896 / 1194, focusY: 0.56 },
    title: 'A wandering ghost',
    junior: 'A friendly ghost has three presents. You can pick one!',
    body: 'A ghost drifts out of the wall and holds out three gifts. You may take only one.',
    button: 'Accept gift',
    gifts: (run, version) => ghostGifts(version),
  },
  librarian: {
    hero: { image: 'librarian', aspect: 768 / 1362, focusY: 0.42 },
    title: 'The silent librarian',
    junior: 'A quiet librarian has three things for you. You can pick one!',
    body: 'Between the floating pages a hooded librarian looks up from a book. “One thing from my shelves,” it whispers. “Only one.”',
    button: 'Take it',
    gifts: (run, version) => librarianGifts(run, version, roomRandom(run, run.currentId, 'librarian')),
  },
};

export default function MysteryEvent({ navigate, run, onAccept }) {
  const version = runVersion(run);
  const event = EVENTS[mysteryEvent(run)] ?? EVENTS.ghost;
  const [gifts] = useState(() => event.gifts(run, version));
  const [choice, setChoice] = useState(gifts[1].id);

  return (
    <View style={styles.screen}>
      <EventHero image={event.hero.image} height={380} aspect={event.hero.aspect} focusY={event.hero.focusY} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RunHud run={run} navigate={navigate} floor={currentRoom(run).floor} />
        <View style={styles.spacer} />

        <View style={styles.titles}>
          <RunTitle>{event.title}</RunTitle>
          <Text style={styles.body}>{version.id === 'junior' ? event.junior : event.body}</Text>
        </View>

        <TutorialTarget id="gifts">
          <GiftList gifts={gifts} selectedId={choice} onSelect={setChoice} />
        </TutorialTarget>
        <PrimaryButton label={event.button} onPress={() => onAccept(gifts.find((g) => g.id === choice))} />
      </ScrollView>
    </View>
  );
}
