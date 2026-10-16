import { Text as RNText } from 'react-native';
import Text from '../../AppText';
import { numberPieces } from '../../../game/visualModel';
import { colors } from '../../../theme/theme';

// A line of text with every number drawn in gold, so the numbers that
// matter stand out from the words (Dyscalculia mode, Figma 08b).
export default function MathText({ children, style, numberColor = colors.gold, ...rest }) {
  const text = String(children ?? '');
  return (
    <Text style={style} {...rest}>
      {numberPieces(text).map((piece, i) =>
        piece.number ? (
          <RNText key={i} style={{ color: numberColor }}>
            {piece.text}
          </RNText>
        ) : (
          piece.text
        ),
      )}
    </Text>
  );
}
