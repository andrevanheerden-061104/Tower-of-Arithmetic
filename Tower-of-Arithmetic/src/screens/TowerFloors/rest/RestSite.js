import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import EventHero from '../../../components/run/EventHero';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import { currentRoom, cursedItems, runVersion } from '../../../game/run';
import RestChoices from './components/RestChoices';
import styles from './RestSite.styles';

// Rest site: a quiet campfire. Rest to heal 1 heart, or (senior mode,
// when something is cursed) burn a curse away instead.
export default function RestSite({ navigate, run, onRest }) {
  const version = runVersion(run);
  const curses = cursedItems(run);
  const [choice, setChoice] = useState('rest');

  const go = () => (choice === 'rest' ? onRest() : navigate('removeCurse'));

  return (
    <View style={styles.screen}>
      <EventHero image="campfireRest" height={460} aspect={843 / 1264} focusY={0.72} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RunHud run={run} navigate={navigate} floor={currentRoom(run).floor} />
        <View style={styles.spacer} />

        <View style={styles.titles}>
          <RunTitle>A quiet campfire</RunTitle>
          <Text style={styles.body}>
            The fire is warm and the tower is quiet.{' '}
            {version.usesCurses ? 'Choose one thing to do before you climb on.' : 'Rest a while before you climb on.'}
          </Text>
        </View>

        <RestChoices
          run={run}
          showCurse={version.usesCurses}
          curseCount={curses.length}
          selected={choice}
          onSelect={setChoice}
        />
        <PrimaryButton label={choice === 'rest' ? 'Rest by the fire' : 'Choose a curse'} onPress={go} />
      </ScrollView>
    </View>
  );
}
