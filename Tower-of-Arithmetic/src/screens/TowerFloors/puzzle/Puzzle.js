import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import ScreenBackground from '../../../components/ScreenBackground';
import Shade from '../../../components/Shade';
import TutorialTarget from '../../../components/tutorial/TutorialTarget';
import ArchmageHint from '../../../components/run/ArchmageHint';
import LessonLink from '../../../components/lesson/LessonLink';
import LessonOverlay from '../../../components/lesson/LessonOverlay';
import { hasLesson } from '../../../data/lessons';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import { makePuzzle } from '../../../game/puzzles';
import { isCorrect } from '../../../game/questions';
import { currentRoom, markQuestionUsed, recordAnswer, runVersion } from '../../../game/run';
import { colors } from '../../../theme/theme';
import DotPicture from '../combat/components/DotPicture';
import QuestionBox from '../combat/components/QuestionBox';
import PuzzleAnswer from './components/PuzzleAnswer';
import styles from './Puzzle.styles';

// A puzzle room: a sealed door that opens when its sum is solved. The sum
// is from the run's own maths topic and gets harder higher up the tower
// (see src/game/puzzles.js). No hearts are lost for a wrong answer: the
// player gets a hint and can try again.
export default function Puzzle({ navigate, run, updateRun, onSolved, onAnswer, onLessonDone }) {
  const version = runVersion(run);
  const room = currentRoom(run);
  // Picked once when the room opens, so the door keeps the same sum
  const [puzzle] = useState(() => makePuzzle(run, version, Math.max(1, room.floor)));
  const { question } = puzzle;
  const [hintIndex, setHintIndex] = useState(-1);
  const [wrong, setWrong] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [lesson, setLesson] = useState(false); // Spell School open over the door
  const askedAt = useRef(0);

  useEffect(() => {
    askedAt.current = Date.now();
    updateRun((r) => markQuestionUsed(r, question));
    // Once, when the room opens
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextHint = () => {
    setHintIndex((i) => Math.min(i + 1, question.hints.length - 1));
    setHintsUsed((n) => n + 1);
  };

  const check = (answer) => {
    const correct = isCorrect(question, answer);
    const timeMs = askedAt.current ? Date.now() - askedAt.current : 0;
    updateRun((r) => recordAnswer(r, { correct, hintsUsed, topic: question.type, timeMs, question, given: answer }));
    onAnswer?.({ topic: question.type, version: version.id, correct, timeMs, hints: hintsUsed });
    if (correct) {
      onSolved();
    } else {
      setWrong(true);
      nextHint();
    }
  };

  const junior = version.id === 'junior';

  return (
    <View style={styles.screen}>
      {junior ? (
        <Shade color={colors.indigo} stops={[[0, 0.9], [0.6, 0.35], [1, 0.1]]} />
      ) : (
        <>
          <ScreenBackground opacity={0.15} />
          <Shade stops={[[0, 0.55], [0.35, 0.9], [1, 1]]} />
        </>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <RunHud run={run} navigate={navigate} floor={room.floor} />

        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <RunTitle>{puzzle.title}</RunTitle>
            <Text style={styles.question}>{puzzle.intro}</Text>
          </View>
          <Pressable
            onPress={junior ? () => console.log('Read aloud (placeholder)') : nextHint}
            accessibilityRole="button"
            accessibilityLabel={junior ? 'Read aloud' : 'Get a hint'}
            style={[styles.roundButton, junior && styles.speaker]}
          >
            <Icon name={junior ? 'volume' : 'lightbulb'} size={22} color={junior ? colors.bg : colors.gold} />
          </Pressable>
        </View>

        <TutorialTarget id="puzzle">
          <View style={styles.door}>
            <QuestionBox question={question}>{junior && <DotPicture picture={question.picture} />}</QuestionBox>

            {wrong && <Text style={styles.wrong}>Not quite. No hearts lost, take your time.</Text>}
            {hintIndex >= 0 && <ArchmageHint title="Orrin" hint={question.hints[hintIndex]} index={hintIndex} total={question.hints.length} />}
            {wrong && hasLesson(version.id, question.type) && <LessonLink junior={junior} onPress={() => setLesson(true)} />}
            {junior && hintIndex < 0 && (
              <Pressable onPress={nextHint} accessibilityRole="button" accessibilityLabel="Help me" style={styles.help}>
                <Icon name="lightbulb" size={20} color={colors.gold} />
                <Text style={styles.helpText}>Help me</Text>
              </Pressable>
            )}

            <PuzzleAnswer version={version} question={question} onCheck={check} />
          </View>
        </TutorialTarget>
      </ScrollView>

      {lesson && (
        <LessonOverlay versionId={version.id} topic={question.type} backLabel="Back to the door" onClose={() => setLesson(false)} onDone={onLessonDone} />
      )}
    </View>
  );
}
