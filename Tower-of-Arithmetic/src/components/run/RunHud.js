import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import CoinIcon from './CoinIcon';
import MenuDrawer from './MenuDrawer';
import { runVersion } from '../../game/run';
import { colors, fonts } from '../../theme/theme';

// The bar at the top of every tower screen: menu button on the left,
// coins and floor on the right. The menu button opens the run menu.
export default function RunHud({ run, navigate, floor, floorLabel, style }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const version = runVersion(run);
  const total = run.map.floors;
  const label = floorLabel ?? (version.id === 'junior' ? `Floor ${floor} of ${total}` : `Floor ${floor} / ${total}`);

  return (
    <View style={[styles.row, style]}>
      <Pressable
        onPress={() => setMenuOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Open menu"
        style={({ pressed }) => [styles.box, styles.menu, pressed && styles.pressed]}
      >
        <Icon name="menu" size={22} color={colors.gold} />
      </Pressable>

      <View style={styles.right}>
        {version.usesCoins && (
          <View style={styles.box} accessible accessibilityLabel={`${run.coins} coins`}>
            <CoinIcon size={20} />
            <Text style={styles.coins}>{run.coins}</Text>
          </View>
        )}
        <View style={styles.box}>
          <Text style={styles.floor}>{label}</Text>
        </View>
      </View>

      <MenuDrawer visible={menuOpen} onClose={() => setMenuOpen(false)} run={run} navigate={navigate} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  right: { flexDirection: 'row', gap: 8 },
  box: {
    height: 44,
    minWidth: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: 'rgba(23,20,31,0.92)',
  },
  menu: { paddingHorizontal: 0, width: 44, borderColor: colors.gold },
  pressed: { opacity: 0.8 },
  coins: { fontFamily: fonts.bold, fontSize: 14, color: colors.gold },
  floor: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
});
