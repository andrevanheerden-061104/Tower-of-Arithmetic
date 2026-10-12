import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../AppText';
import Icon from '../../Icon';
import { useVoiceAnswer } from '../../../hooks/useVoiceAnswer';
import { colors, fonts } from '../../../theme/theme';
import ReadResult from './ReadResult';

// "Speak": tap the microphone, say the step, tap again to stop. Orrin
// writes it down as maths; "Use it" puts it in the step.
// `example` is a sentence to say, shown before they start.
export default function SpeakPad({ onUse, height, example = 'x squared equals two x plus three' }) {
  const voice = useVoiceAnswer();
  const listening = voice.status === 'listening';

  if (voice.status === 'done') {
    return (
      <View style={[styles.pad, { height }]}>
        <ReadResult
          title="Orrin heard"
          maths={voice.result?.maths}
          note={voice.result?.heard ? `“${voice.result.heard}”` : null}
          onAgain={voice.reset}
          onUse={(maths) => {
            voice.reset();
            onUse(maths);
          }}
        />
      </View>
    );
  }

  let message = `Tap the microphone and say your step. For example: “${example}”.`;
  if (listening) message = `Listening… ${voice.seconds}s. Tap to stop.`;
  if (voice.status === 'reading') message = 'Orrin is writing it down…';
  if (voice.status === 'error') message = voice.error;

  return (
    <View style={[styles.pad, styles.centre, { height }]}>
      <Pressable
        onPress={listening ? voice.stop : voice.start}
        disabled={voice.status === 'reading'}
        accessibilityRole="button"
        accessibilityLabel={listening ? 'Stop recording' : 'Start recording your answer'}
        style={({ pressed }) => [styles.mic, listening && styles.micOn, voice.status === 'reading' && styles.micBusy, pressed && styles.pressed]}
      >
        <Icon name={listening ? 'x' : 'mic'} size={34} color={listening ? colors.bg : colors.gold} strokeWidth={2.2} />
      </Pressable>
      {listening && (
        <View style={styles.meter} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={[styles.meterFill, { width: `${Math.min(100, (voice.seconds / voice.maxSeconds) * 100)}%` }]} />
        </View>
      )}
      <Text style={[styles.message, voice.status === 'error' && styles.error]} accessibilityLiveRegion="polite">
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  centre: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  mic: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 16px rgba(242,234,121,0.3)',
  },
  micOn: { backgroundColor: colors.gold, boxShadow: '0px 0px 26px rgba(242,234,121,0.6)' },
  micBusy: { opacity: 0.5 },
  pressed: { transform: [{ scale: 0.96 }] },
  meter: { width: 160, height: 6, borderRadius: 3, backgroundColor: colors.line, overflow: 'hidden' },
  meterFill: { height: 6, backgroundColor: colors.gold },
  message: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.white, textAlign: 'center' },
  error: { color: '#FF9B8F' },
});
