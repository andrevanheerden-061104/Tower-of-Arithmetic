import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import EventHero from '../../../components/run/EventHero';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import { ghostGifts } from '../../../game/encounters';
import { currentRoom, runVersion } from '../../../game/run';
import GiftList from './components/GiftList';
import styles from './MysteryEvent.styles';

// Mystery room (placeholder event): a ghost offers three gifts, take one.
export default function MysteryEvent({ navigate, run, onAccept }) {
  const version = runVersion(run);
  const gifts = ghostGifts(version);
  const [choice, setChoice] = useState(gifts[1].id);

  return (
    <View style={styles.screen}>
      <EventHero image="ghost" height={380} aspect={896 / 1194} focusY={0.56} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RunHud run={run} navigate={navigate} floor={currentRoom(run).floor} />
        <View style={styles.spacer} />

        <View style={styles.titles}>
          <RunTitle>A wandering ghost</RunTitle>
          <Text style={styles.body}>A ghost drifts out of the wall and holds out three gifts. You may take only one.</Text>
        </View>

        <GiftList gifts={gifts} selectedId={choice} onSelect={setChoice} />
        <PrimaryButton label="Accept gift" onPress={() => onAccept(choice)} />
      </ScrollView>
    </View>
  );
}
