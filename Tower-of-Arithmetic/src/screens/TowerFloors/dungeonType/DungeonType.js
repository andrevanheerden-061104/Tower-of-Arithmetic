import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenBackground from '../../../components/ScreenBackground';
import ScreenHeader from '../../../components/ScreenHeader';
import Shade from '../../../components/Shade';
import RunTitle from '../../../components/run/RunTitle';
import { lessonId } from '../../../data/lessons';
import { MIXED, versionForGrade } from '../../../game/versions';
import LessonCard from './components/LessonCard';
import MixedOption from './components/MixedOption';
import TypeGrid from './components/TypeGrid';
import VersionBadge from './components/VersionBadge';
import styles from './DungeonType.styles';

// First screen of a new run: pick the maths for this climb. The choices
// depend on the player's version (junior, intermediate or senior), which
// comes from the grade they chose in onboarding.
export default function DungeonType({ navigate, grade, onStartRun, onOpenLesson, lessonsDone = [], lessonTopic }) {
  const version = versionForGrade(grade);
  // Coming back from a lesson keeps that type picked
  const [typeId, setTypeId] = useState(() => (version.dungeonTypes.some((t) => t.id === lessonTopic) ? lessonTopic : MIXED.id));
  const type = version.dungeonTypes.find((t) => t.id === typeId);

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

        {/* Spell School: a short lesson on the picked type before the run */}
        {type && (
          <LessonCard
            type={type}
            junior={version.id === 'junior'}
            done={lessonsDone.includes(lessonId(version.id, type.id))}
            onPress={() => onOpenLesson(type.id)}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Enter the tower" onPress={() => onStartRun(typeId)} />
      </View>
    </View>
  );
}
