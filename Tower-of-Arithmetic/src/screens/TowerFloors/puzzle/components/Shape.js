import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '../../../../theme/theme';

// Simple shapes for the junior pattern puzzle, each with its own colour
// AND outline shape, so colour is never the only clue.
export default function Shape({ kind, size = 40 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40">
      {kind === 'circle' && <Circle cx="20" cy="20" r="16" fill={colors.gold} stroke={colors.white} strokeWidth="2.5" />}
      {kind === 'triangle' && (
        <Path d="M20 4 37 35H3Z" fill="#F2A7B5" stroke={colors.white} strokeWidth="2.5" strokeLinejoin="round" />
      )}
      {kind === 'square' && <Rect x="5" y="5" width="30" height="30" rx="4" fill="#A7CBE8" stroke={colors.white} strokeWidth="2.5" />}
    </Svg>
  );
}
