import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import EventHero from '../../../components/run/EventHero';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import { currentRoom, cursedItems } from '../../../game/run';
import CursedList from './components/CursedList';
import styles from './RemoveCurse.styles';

// Choose which cursed thing the campfire cleanses (senior mode).
export default function RemoveCurse({ navigate, run, onRemove }) {
  const curses = cursedItems(run);
  const [choice, setChoice] = useState(curses[0]?.id ?? null);

  return (
    <View style={styles.screen}>
      <EventHero image="campfireRemove" height={420} aspect={843 / 1264} focusY={0.66} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RunHud run={run} navigate={navigate} floor={currentRoom(run).floor} />
        <View style={styles.spacer} />

        <View style={styles.titles}>
          <RunTitle>Remove a curse</RunTitle>
          <Text style={styles.body}>Choose one cursed thing. The fire burns its curse away for the rest of this run.</Text>
        </View>

        <CursedList items={curses} selectedId={choice} onSelect={setChoice} />
        <PrimaryButton label="Remove curse" disabled={!choice} onPress={() => onRemove(choice)} />
        <Pressable onPress={() => navigate('rest')} accessibilityRole="button" style={styles.back}>
          <Text style={styles.backText}>Back to the fire</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
