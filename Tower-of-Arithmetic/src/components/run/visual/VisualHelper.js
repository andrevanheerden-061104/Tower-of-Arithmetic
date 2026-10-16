import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from '../../Icon';
import { useDyscalculia } from '../../../context/DyscalculiaContext';
import { visualModel } from '../../../game/visualModel';
import { colors, fonts } from '../../../theme/theme';
import BarModel from './BarModel';
import DotGrid from './DotGrid';
import FractionBars from './FractionBars';
import MathText from './MathText';
import NumberLine from './NumberLine';
import NumberRow from './NumberRow';

const PICTURES = { jumps: NumberLine, bar: BarModel, row: NumberRow, fractions: FractionBars, grid: DotGrid };

// Dyscalculia mode's helper card (Figma 08a / 08b): one friendly
// sentence and a picture of the sum, in a gold border. Shown only when
// the mode is on (or `always`) and a picture fits the question.
export default function VisualHelper({ question, always = false }) {
  const on = useDyscalculia();
  const found = useMemo(() => visualModel(question), [question]);
  if ((!on && !always) || !found) return null;
  const Picture = found.model ? PICTURES[found.model.kind] : null;
  return (
    <View style={styles.card}>
      {found.tip ? (
        <View style={styles.tipRow}>
          <Icon name="lightbulb" size={18} color={colors.gold} />
          <MathText style={styles.tip}>{found.tip}</MathText>
        </View>
      ) : null}
      {Picture ? <Picture model={found.model} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: '#1E1A2B',
  },
  tipRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  tip: { flex: 1, fontFamily: fonts.semibold, fontSize: 15, lineHeight: 21, color: colors.white },
});
