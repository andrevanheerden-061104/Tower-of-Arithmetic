import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../theme/theme';

// A gold coin.
export default function CoinIcon({ size = 20 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      <Circle cx="10" cy="10" r="8.4" fill={colors.gold} stroke="#9C8B2B" strokeWidth="1.3" />
      <Circle cx="10" cy="10" r="4.6" fill="none" stroke="#9C8B2B" strokeWidth="1.1" />
    </Svg>
  );
}
