import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import Icon from '../Icon';
import PrimaryButton from '../PrimaryButton';
import { getDungeonType } from '../../game/versions';
import { currentRoom, runVersion } from '../../game/run';
import { MAX_DECK } from '../../game/spells';
import { colors, fonts, spacing } from '../../theme/theme';

// The run menu that slides in from the left (hamburger button in the HUD).
// The run stays in memory, so leaving to the main menu keeps it saved.
export default function MenuDrawer({ visible, onClose, run, navigate }) {
  const version = runVersion(run);
  const dungeon = getDungeonType(version, run.dungeonTypeId);
  const floor = Math.max(1, currentRoom(run).floor);

  const go = (screen) => {
    onClose();
    navigate(screen);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.panel}>
          <View style={styles.header}>
            <Text style={styles.title} accessibilityRole="header">
              Menu
            </Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close menu" style={styles.close}>
              <Icon name="x" size={22} />
            </Pressable>
          </View>

          <View style={styles.current}>
            <Text style={styles.currentLabel}>CURRENT RUN</Text>
            <Text style={styles.currentValue}>
              {dungeon.label} · Floor {floor} / {run.map.floors}
            </Text>
          </View>

          <MenuRow icon="home" title="Main menu" detail="Your run is saved" onPress={() => go('home')} />
          <MenuRow icon="layers" title="Deck" detail={`${run.deck.length} of ${MAX_DECK} spells`} onPress={() => go('deck')} />
          <MenuRow icon="settings" title="Settings" detail="Text size, speech, sound" onPress={() => go('settings')} />

          <View style={styles.spacer} />
          <PrimaryButton label="Resume run" onPress={onClose} />
        </View>

        {/* Tapping the dimmed area closes the menu too */}
        <Pressable style={styles.dismiss} onPress={onClose} accessibilityLabel="Close menu" />
      </View>
    </Modal>
  );
}

function MenuRow({ icon, title, detail, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${detail}`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.rowIcon}>
        <Icon name={icon} size={20} color={colors.gold} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDetail}>{detail}</Text>
      </View>
      <Icon name="chevronRight" size={18} color={colors.mute} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(13,13,13,0.6)' },
  panel: {
    width: '76%',
    maxWidth: 320,
    paddingTop: spacing.top,
    paddingBottom: spacing.bottom,
    paddingHorizontal: 24,
    gap: 12,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 28,
    borderRightWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#1A1625',
  },
  dismiss: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  title: { fontFamily: fonts.display, fontSize: 24, letterSpacing: 1, color: colors.white },
  close: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  current: {
    padding: 14,
    gap: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  currentLabel: { fontFamily: fonts.semibold, fontSize: 12, letterSpacing: 1.2, color: colors.mute },
  currentValue: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#2A1F4A',
  },
  pressed: { opacity: 0.8 },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.indigo,
  },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  rowDetail: { fontFamily: fonts.regular, fontSize: 12, color: colors.mute },
  spacer: { flex: 1 },
});
