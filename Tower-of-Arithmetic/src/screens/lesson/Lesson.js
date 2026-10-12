import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import LessonView from '../../components/lesson/LessonView';
import { versionForGrade } from '../../game/versions';

// Spell School, opened from the dungeon screen: a lesson on the maths type
// the player picked. At the end they can go straight into a run on it.
export default function Lesson({ grade, lessonTopic, goBack, onStartRun, onLessonDone }) {
  const version = versionForGrade(grade);

  // Android's back button goes back to the dungeon screen
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  return (
    <LessonView
      versionId={version.id}
      topic={lessonTopic}
      onClose={goBack}
      onFinish={() => onStartRun(lessonTopic)}
      finishLabel={version.id === 'junior' ? 'Play in the tower' : 'Practise in the tower'}
      closeLabel="Back"
      onDone={onLessonDone}
    />
  );
}
