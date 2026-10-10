import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenBackground from '../../../components/ScreenBackground';
import ScreenHeader from '../../../components/ScreenHeader';
import Shade from '../../../components/Shade';
import RunTitle from '../../../components/run/RunTitle';
import { MIXED, versionForGrade } from '../../../game/versions';
import MixedOption from './components/MixedOption';
import TypeGrid from './components/TypeGrid';
import VersionBadge from './components/VersionBadge';
import styles from './DungeonType.styles';

// First screen of a new run: pick the maths for this climb. The choices
// depend on the player's version (junior, intermediate or senior), which
// comes from the grade they chose in onboarding.
export default function DungeonType({ navigate, grade, onStartRun }) {
  const version = versionForGrade(grade);
  const [typeId, setTypeId] = useState(MIXED.id);

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.2} />
      <Shade stops={[[0, 0.6], [0.4, 0.95], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="New run" onBack={() => navigate('home')} />

        <View style={styles.intro}>
          <RunTitle>Choose your dungeon</RunTitle>
          <Text style={styles.lead}>Train one maths type for the whole run, or let the tower mix them.</Text>
          <VersionBadge version={version} />
        </View>

        <MixedOption selected={typeId === MIXED.id} onPress={() => setTypeId(MIXED.id)} />

        <Text style={styles.sectionLabel}>OR FOCUS ON ONE TYPE</Text>
        <TypeGrid types={version.dungeonTypes} selectedId={typeId} onSelect={setTypeId} />
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Enter the tower" onPress={() => onStartRun(typeId)} />
      </View>
    </View>
  );
}
