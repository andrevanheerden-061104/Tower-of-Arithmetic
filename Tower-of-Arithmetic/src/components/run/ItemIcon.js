import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import Icon from '../Icon';
import CoinIcon from './CoinIcon';
import { Heart } from './HeartRow';
import { colors } from '../../theme/theme';

// Little drawings for items, potions and gifts (gem, ring, lantern, potion,
// spell card, star). Cursed things get a small purple skull badge.
export default function ItemIcon({ kind, size = 32, potionColor = colors.pink, cursed = false }) {
  return (
    <View style={{ width: size, height: size }}>
      <Art kind={kind} size={size} potionColor={potionColor} />
      {cursed && (
        <View style={[styles.curse, { right: -size * 0.22, bottom: -size * 0.18 }]}>
          <Icon name="skull" size={size * 0.42} color="#C9A8FF" strokeWidth={2.2} />
        </View>
      )}
    </View>
  );
}

function Art({ kind, size, potionColor }) {
  switch (kind) {
    case 'coin':
      return <CoinIcon size={size} />;
    case 'heart':
      return <Heart size={size} fill={1} />;
    case 'star':
      return <Icon name="star" size={size} color={colors.gold} fill={colors.gold} strokeWidth={1.2} />;
    case 'gem':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32">
          <Path d="M8 5h16l5 8-13 15L3 13Z" fill={colors.gold} stroke="#9C8B2B" strokeWidth="1.4" strokeLinejoin="round" />
          <Path d="M3 13h26M12 5l-3 8 7 15 7-15-3-8" fill="none" stroke="#9C8B2B" strokeWidth="1.2" strokeLinejoin="round" />
        </Svg>
      );
    case 'ring':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32">
          <Circle cx="16" cy="20" r="8" fill="none" stroke={colors.gold} strokeWidth="3.6" />
          <Path d="M16 4l4.5 5.5L16 15l-4.5-5.5Z" fill="#A77BFF" stroke="#E6D9FF" strokeWidth="1.3" strokeLinejoin="round" />
        </Svg>
      );
    case 'lantern':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32">
          <Path d="M12 4h8M16 4v3" stroke="#B5AEC2" strokeWidth="2" strokeLinecap="round" />
          <Rect x="9" y="7" width="14" height="4" rx="1" fill="#8C6A3E" stroke="#C9A06A" strokeWidth="1.2" />
          <Rect x="10" y="11" width="12" height="13" rx="2" fill="#2A1F4A" stroke="#C9A06A" strokeWidth="1.4" />
          <Path d="M16 14c1.6 2 2.2 3.2 2.2 4.4a2.2 2.2 0 1 1-4.4 0c0-1.2.6-2.4 2.2-4.4z" fill={colors.gold} />
          <Rect x="9" y="24" width="14" height="4" rx="1" fill="#8C6A3E" stroke="#C9A06A" strokeWidth="1.2" />
        </Svg>
      );
    case 'card':
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32">
          <Rect x="8" y="3" width="16" height="26" rx="3" fill={colors.indigo} stroke={colors.gold} strokeWidth="1.8" />
          <Path d="M18 8l-5 8h4l-2 8 6-10h-4l2-6Z" fill={colors.gold} />
        </Svg>
      );
    case 'potion':
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32">
          <Rect x="13" y="3" width="6" height="3" rx="1" fill="#C9A06A" />
          <Path d="M13 6h6v6.5l7 9.5a4 4 0 0 1-3.2 6.4H9.2A4 4 0 0 1 6 22l7-9.5Z" fill="#FDFAF5" stroke="#FDFAF5" strokeWidth="1" strokeLinejoin="round" />
          <Path d="M9 18h14l3 4a4 4 0 0 1-3.2 6.4H9.2A4 4 0 0 1 6 22Z" fill={potionColor} />
        </Svg>
      );
  }
}

const styles = StyleSheet.create({
  curse: {
    position: 'absolute',
    padding: 1,
    borderRadius: 4,
    backgroundColor: '#1B1030',
    borderWidth: 1,
    borderColor: '#A77BFF',
  },
});
