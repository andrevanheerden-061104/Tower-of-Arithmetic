import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import PrimaryButton from '../PrimaryButton';
import ArchmageHint from '../run/ArchmageHint';
import { makeQuestion } from '../../game/generators';
import { isCorrect } from '../../game/questions';
import { VERSIONS } from '../../game/versions';
import DotPicture from '../../screens/TowerFloors/combat/components/DotPicture';
import QuestionBox from '../../screens/TowerFloors/combat/components/QuestionBox';
import VisualHelper from '../run/visual/VisualHelper';
import { playSfx } from '../../audio/sfx';
import PuzzleAnswer from '../../screens/TowerFloors/puzzle/components/PuzzleAnswer';
import { colors, fonts } from '../../theme/theme';

const MAX_TRIES = 3; // after this many wrong answers Orrin shows the answer

// "x=5" -> "x = 5"
const pretty = (answer) => String(answer).replace(/\s*=\s*/g, ' = ');

// "Your turn": one sum like the ones the lesson showed, answered the same
// way as in the tower (tap for junior, write the working for the others).
// A wrong answer gives the next hint. After three tries Orrin shows how.
export default function PracticePage({ lesson, onFinished }) {
  const version = VERSIONS[lesson.versionId];
  const junior = version.id === 'junior';
  const [question] = useState(() => makeQuestion({ versionId: lesson.versionId, grade: lesson.practiceGrade, topic: lesson.topic, level: 2 }));
  const [tries, setTries] = useState(0);
  const [result, setResult] = useState(null); // null | 'wrong' | 'right' | 'shown'
  const [hintIndex, setHintIndex] = useState(-1);
  const hints = question.hints ?? [];
  const finished = result === 'right' || result === 'shown';

  const nextHint = () => setHintIndex((i) => Math.min(i + 1, hints.length - 1));

  const check = (answer) => {
    const count = tries + 1;
    setTries(count);
    if (isCorrect(question, answer)) {
      playSfx('correct');
      setResult('right');
      return;
    }
    playSfx('wrong');
    if (count >= MAX_TRIES) {
      setResult('shown');
      return;
    }
    setResult('wrong');
    nextHint();
  };

  const done = () => onFinished({ result, tries, display: question.display });

  return (
    <View style={styles.sheet}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.label}>PRACTICE</Text>
          <Text style={styles.title} accessibilityRole="header">
            {lesson.title}
          </Text>
        </View>
        {!finished && hints.length > 0 && hintIndex < hints.length - 1 && (
          <Pressable onPress={nextHint} accessibilityRole="button" accessibilityLabel="Get a hint" style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
            <Icon name="lightbulb" size={22} color={colors.gold} />
          </Pressable>
        )}
      </View>

      <QuestionBox question={question}>{junior && question.picture ? <DotPicture picture={question.picture} /> : null}</QuestionBox>
      <VisualHelper question={question} />

      {result === 'wrong' && (
        <Text style={styles.wrong} accessibilityLiveRegion="assertive">
          {junior ? 'Not yet. Try again!' : `Not quite. Try again (${MAX_TRIES - tries} ${MAX_TRIES - tries === 1 ? 'try' : 'tries'} left).`}
        </Text>
      )}
      {hintIndex >= 0 && !finished && <ArchmageHint title="Orrin" hint={hints[hintIndex]} index={hintIndex} total={hints.length} />}

      {result === 'right' && (
        <View style={[styles.result, styles.right]} accessibilityLiveRegion="assertive">
          <View style={styles.tick}>
            <Icon name="check" size={18} color={colors.bg} strokeWidth={3} />
          </View>
          <Text style={styles.resultTitle}>{junior ? 'Yes! You got it!' : 'Correct! Well done.'}</Text>
          <Text style={styles.resultText}>The answer is {pretty(question.answer)}.</Text>
        </View>
      )}
      {result === 'shown' && (
        <View style={styles.result} accessibilityLiveRegion="assertive">
          <Text style={styles.resultTitle}>{junior ? 'Let’s look together.' : 'Let’s work it out together.'}</Text>
          {(question.steps ?? []).map((step, i) => (
            <Text key={i} style={styles.step}>
              {step}
            </Text>
          ))}
          <Text style={styles.resultText}>The answer is {pretty(question.answer)}.</Text>
        </View>
      )}

      {finished ? (
        <PrimaryButton label="Continue" onPress={done} />
      ) : (
        <PuzzleAnswer version={version} question={question} onCheck={check} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    gap: 12,
    padding: 18,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#1E1A2B',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerText: { flex: 1 },
  label: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  title: { fontFamily: fonts.bold, fontSize: 20, color: colors.white },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
  wrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: '#FF9B8F' },
  result: {
    gap: 6,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.panel,
  },
  right: { borderColor: '#7BE0A0' },
  tick: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#7BE0A0', alignItems: 'center', justifyContent: 'center' },
  resultTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.white },
  resultText: { fontFamily: fonts.semibold, fontSize: 16, color: colors.gold },
  step: { fontFamily: fonts.medium, fontSize: 16, color: colors.white },
});
