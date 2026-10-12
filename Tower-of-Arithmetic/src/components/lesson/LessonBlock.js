import { StyleSheet, View } from 'react-native';
import Text from '../AppText';
import GeometryFigure from '../run/GeometryFigure';
import DotPicture from '../../screens/TowerFloors/combat/components/DotPicture';
import BarsBlock from './BarsBlock';
import NumbersBlock from './NumbersBlock';
import OrbsBlock from './OrbsBlock';
import PairsBlock from './PairsBlock';
import ScaleBlock from './ScaleBlock';
import StepsBlock from './StepsBlock';
import { colors, fonts } from '../../theme/theme';

// One block on a lesson page (made with the helpers in
// src/data/lessons/blocks.js): a big sum, worked steps, a rule card, etc.
export default function LessonBlock({ block, junior }) {
  switch (block.type) {
    case 'sum':
      return (
        <View style={styles.sumBox} accessible accessibilityLabel={block.text}>
          <Text style={[styles.sum, junior && styles.sumJunior]} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.5}>
            {block.text}
          </Text>
        </View>
      );
    case 'steps':
      return <StepsBlock rows={block.rows} />;
    case 'pairs':
      return <PairsBlock items={block.items} />;
    case 'rule':
      return (
        <View style={styles.rule} accessible accessibilityLabel={`${block.title}. ${block.text}`}>
          <Text style={styles.ruleTitle}>{block.title}</Text>
          <Text style={styles.ruleText}>{block.text}</Text>
        </View>
      );
    case 'tip':
      return <Text style={styles.tip}>{block.text}</Text>;
    case 'numbers':
      return <NumbersBlock values={block.values} between={block.between} caption={block.caption} />;
    case 'orbs':
      return <OrbsBlock left={block.left} right={block.right} caption={block.caption} />;
    case 'scale':
      return <ScaleBlock left={block.left} right={block.right} />;
    case 'bars':
      return <BarsBlock rows={block.rows} />;
    case 'dots':
      return (
        <View style={styles.card} accessible accessibilityLabel={block.caption ?? 'A picture of dots'}>
          <DotPicture picture={block.picture} />
          {block.caption ? <Text style={styles.caption}>{block.caption}</Text> : null}
        </View>
      );
    case 'figure':
      return (
        <View style={styles.card}>
          <GeometryFigure figure={block.figure} height={150} />
          {block.caption ? <Text style={styles.caption}>{block.caption}</Text> : null}
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  sumBox: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  sum: { fontFamily: fonts.bold, fontSize: 34, color: colors.white },
  sumJunior: { fontSize: 42 },
  rule: {
    gap: 6,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: '#2A1F5C',
  },
  ruleTitle: { fontFamily: fonts.bold, fontSize: 12, letterSpacing: 1.4, color: colors.gold },
  ruleText: { fontFamily: fonts.semibold, fontSize: 16, lineHeight: 23, color: colors.white },
  tip: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.pink },
  card: {
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
  },
  caption: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 20, color: colors.pink, textAlign: 'center' },
});
