import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import PrimaryButton from '../../../../components/PrimaryButton';
import CircleDiagram from './CircleDiagram';
import ProofRow from './ProofRow';
import ReasonChip from './ReasonChip';
import { colors, fonts } from '../../../../theme/theme';

// Senior: a geometry proof. Every statement needs a reason: tap a line,
// then tap the reason that goes with it. Check proof when all are filled.
export default function ProofPuzzle({ puzzle, onCheck }) {
  const [reasons, setReasons] = useState(puzzle.rows.map(() => null));
  const [active, setActive] = useState(0);

  const choose = (reason) => {
    setReasons((r) => r.map((x, i) => (i === active ? reason : x)));
    // move on to the next empty line
    const next = reasons.findIndex((x, i) => i > active && !x);
    if (next >= 0) setActive(next);
  };

  const done = reasons.every(Boolean);
  const correct = puzzle.rows.every((row, i) => row.reason === reasons[i]);

  return (
    <>
      <CircleDiagram />
      <View style={styles.headings}>
        <Text style={styles.heading}>STATEMENT</Text>
        <Text style={styles.heading}>REASON</Text>
      </View>
      <View style={styles.rows}>
        {puzzle.rows.map((row, i) => (
          <ProofRow key={row.statement} statement={row.statement} reason={reasons[i]} active={i === active} onPress={() => setActive(i)} />
        ))}
      </View>
      <View style={styles.chips}>
        {puzzle.reasons.map((r) => (
          <ReasonChip key={r} label={r} onPress={() => choose(r)} />
        ))}
      </View>
      <PrimaryButton label="Check proof" disabled={!done} onPress={() => onCheck(correct)} />
    </>
  );
}

const styles = StyleSheet.create({
  headings: { flexDirection: 'row', paddingHorizontal: 14 },
  heading: { width: '50%', fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  rows: { gap: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
