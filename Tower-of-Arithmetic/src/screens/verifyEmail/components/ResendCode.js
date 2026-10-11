import { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Text from '../../../components/AppText';
import { colors, fonts } from '../../../theme/theme';

const WAIT = 60; // seconds before another code can be sent

// "Send a new code", with a short wait in between so the player doesn't
// hit Supabase's email limit.
export default function ResendCode({ onResend }) {
  const [left, setLeft] = useState(WAIT);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (left <= 0) return undefined;
    const timer = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [left]);

  const press = async () => {
    setSending(true);
    try {
      await onResend();
      setLeft(WAIT);
    } finally {
      setSending(false);
    }
  };

  const waiting = left > 0 || sending;
  return (
    <Pressable
      onPress={press}
      disabled={waiting}
      accessibilityRole="button"
      accessibilityState={{ disabled: waiting }}
      style={styles.wrap}
      hitSlop={8}
    >
      <Text style={styles.question}>
        Didn’t get it?{' '}
        <Text style={[styles.action, waiting && styles.waiting]}>
          {sending ? 'Sending…' : left > 0 ? `Send a new code in ${left}s` : 'Send a new code'}
        </Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  question: { fontFamily: fonts.regular, fontSize: 13, color: colors.mute },
  action: { fontFamily: fonts.semibold, color: colors.gold },
  waiting: { color: colors.mute },
});
