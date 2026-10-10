import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import ScreenBackground from '../../../components/ScreenBackground';
import Shade from '../../../components/Shade';
import ArchmageHint from '../../../components/run/ArchmageHint';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import { getPuzzle } from '../../../game/puzzles';
import { currentRoom, recordAnswer, runVersion } from '../../../game/run';
import { colors } from '../../../theme/theme';
import PatternPuzzle from './components/PatternPuzzle';
import ProofPuzzle from './components/ProofPuzzle';
import StepsPuzzle from './components/StepsPuzzle';
import styles from './Puzzle.styles';

// A puzzle room: a sealed door that opens when the puzzle is solved.
// Each version has its own kind of puzzle (placeholder data in
// src/game/puzzles.js):
//   junior        finish the shape pattern (PatternPuzzle)
//   intermediate  a word problem with steps (StepsPuzzle)
//   senior        a geometry proof with reasons (ProofPuzzle)
export default function Puzzle({ navigate, run, updateRun, onSolved }) {
  const version = runVersion(run);
  const puzzle = getPuzzle(version);
  const room = currentRoom(run);
  const [hintIndex, setHintIndex] = useState(-1);
  const [wrong, setWrong] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const nextHint = () => {
    setHintIndex((i) => Math.min(i + 1, puzzle.hints.length - 1));
    setHintsUsed((n) => n + 1);
  };

  const check = (correct) => {
    updateRun((r) => recordAnswer(r, { correct, hintsUsed }));
    if (correct) {
      onSolved();
    } else {
      setWrong(true);
      nextHint();
    }
  };

  const Body = puzzle.kind === 'pattern' ? PatternPuzzle : puzzle.kind === 'steps' ? StepsPuzzle : ProofPuzzle;
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

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <RunHud run={run} navigate={navigate} floor={room.floor} />

        <View style={styles.titleRow}>
          <View style={styles.titleText}>
            <RunTitle>{puzzle.title}</RunTitle>
            {junior && <Text style={styles.juniorQuestion}>{puzzle.question}</Text>}
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

        {!junior && <Text style={styles.question}>{puzzle.question}</Text>}

        {wrong && <Text style={styles.wrong}>Not quite. No hearts lost, take your time.</Text>}
        {hintIndex >= 0 && <ArchmageHint hint={puzzle.hints[hintIndex]} index={hintIndex} total={puzzle.hints.length} />}

        <Body puzzle={puzzle} onCheck={check} />
      </ScrollView>
    </View>
  );
}
