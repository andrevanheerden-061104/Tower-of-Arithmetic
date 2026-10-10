import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../components/AppText';
import Icon from '../../../../components/Icon';
import { colors, fonts } from '../../../../theme/theme';

const SHOW_FOR = 3000; // ms; the player can close it sooner with X

// What just happened in the fight ("Flashflame hits!", "Slime uses Bubble
// up!"). Stays for 3 seconds or until closed, then the fight moves on.
// Each kind of event has its own icon and colour, so colour is never the
// only clue.
const TONES = {
  hit: { icon: 'sparkles', color: colors.gold },
  win: { icon: 'sparkles', color: colors.gold },
  hurt: { icon: 'heart', color: '#FF9B8F' },
  boost: { icon: 'swords', color: '#FFB86B' },
  attack: { icon: 'swords', color: '#FF9B8F' },
  heal: { icon: 'heart', color: '#9BE8B0' },
  info: { icon: 'mystery', color: colors.mute },
};

export default function BattleToast({ text, tone = 'info', onClose }) {
  const t = TONES[tone] ?? TONES.info;

  useEffect(() => {
    const timer = setTimeout(onClose, SHOW_FOR);
    return () => clearTimeout(timer);
    // One timer per message (a new message gets a new key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.wrap} pointerEvents="box-none" accessibilityLiveRegion="assertive">
      <View style={[styles.toast, { borderColor: t.color }]}>
        <Icon name={t.icon} size={22} color={t.color} />
        <Text style={styles.text}>{text}</Text>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Close message" hitSlop={8} style={styles.close}>
          <Icon name="x" size={18} color={colors.mute} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 20, right: 20, top: 250, alignItems: 'center', zIndex: 15, elevation: 15 },
  toast: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 16,
    paddingRight: 4,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: 'rgba(13,13,13,0.95)',
  },
  text: { flex: 1, fontFamily: fonts.bold, fontSize: 17, lineHeight: 23, color: colors.white },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
