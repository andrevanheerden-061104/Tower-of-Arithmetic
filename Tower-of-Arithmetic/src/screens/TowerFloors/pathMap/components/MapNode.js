import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { ROOMS } from '../../../../game/rooms';
import { colors, fonts } from '../../../../theme/theme';

const TOUCH = 48;

// One room on the map.
//   current    where the player is (gold, tick, "You are here")
//   reachable  a room they can pick next (purple; gold ring once selected)
//   cleared    a room already done (faded, tick)
//   locked     a room further up the tower
export default function MapNode({ node, x, y, state, selected, onPress }) {
  const room = ROOMS[node.type];
  const boss = node.type === 'boss';
  const size = boss ? 60 : state === 'reachable' ? 44 : 36;
  const canPick = state === 'reachable';
  // Labels go on the side with more room, so they don't run off the map
  const labelLeft = node.col >= 2;

  const label =
    state === 'current'
      ? `You are here, ${node.floor === 0 ? 'the tower gate' : `floor ${node.floor}`}`
      : `${room.label}, floor ${node.floor}${canPick ? '' : state === 'cleared' ? ', done' : ', not reachable yet'}`;

  return (
    <View style={[styles.anchor, { left: x - TOUCH / 2, top: y - TOUCH / 2 }]} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        disabled={!canPick}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canPick, selected }}
        accessibilityLabel={label}
        style={styles.touch}
      >
        <View
          style={[
            styles.node,
            { width: size, height: size, borderRadius: size / 2 },
            boss && styles.boss,
            state === 'locked' && styles.locked,
            state === 'cleared' && styles.cleared,
            state === 'reachable' && styles.reachable,
            state === 'current' && styles.current,
            selected && styles.selected,
          ]}
        >
          {state === 'current' || state === 'cleared' ? (
            <Icon name={node.type === 'start' && state === 'current' ? 'flag' : 'check'} size={18} color={state === 'current' ? colors.bg : colors.mute} strokeWidth={2.6} />
          ) : (
            <Icon name={room.icon} size={boss ? 28 : 18} color={boss ? colors.pink : colors.white} strokeWidth={1.8} />
          )}
        </View>
      </Pressable>

      {state === 'current' && <Text style={[styles.here, labelLeft && styles.hereLeft]}>You are here</Text>}
      {boss && <Text style={styles.bossLabel}>Boss</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  touch: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  node: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#1E1830',
  },
  locked: { opacity: 0.85 },
  cleared: { opacity: 0.6, borderColor: colors.line },
  reachable: { backgroundColor: colors.indigo },
  current: { borderColor: colors.gold, backgroundColor: colors.gold },
  selected: {
    borderWidth: 3,
    borderColor: colors.gold,
    shadowColor: colors.gold,
    shadowOpacity: 0.7,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
    transform: [{ scale: 1.08 }],
  },
  boss: { borderWidth: 2, borderColor: colors.pink, backgroundColor: '#2A1420' },
  here: {
    position: 'absolute',
    left: TOUCH - 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.gold,
    backgroundColor: 'rgba(13,13,13,0.85)',
  },
  hereLeft: { left: undefined, right: TOUCH - 2 },
  bossLabel: {
    position: 'absolute',
    left: TOUCH + 12,
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.pink,
  },
});
