import { useState } from 'react';
import { PanResponder, Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Text from '../../AppText';
import Icon from '../../Icon';
import { readWrittenAnswer } from '../../../services/ai';
import { colors, fonts } from '../../../theme/theme';
import ReadResult from './ReadResult';

const TOOLBAR = 48;
// (written out: StyleSheet.absoluteFillObject is gone in React Native 0.86)
const FILL = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };

// A list of points [x, y, x, y, ...] as an SVG line
function pathFor(points) {
  if (points.length < 2) return '';
  let d = `M${points[0]} ${points[1]}`;
  if (points.length === 2) return `${d} l0.1 0`; // a dot
  for (let i = 2; i < points.length; i += 2) d += ` L${points[i]} ${points[i + 1]}`;
  return d;
}

// "Draw": write the step with a finger. "Read it" sends the pen strokes to
// the server, where Orrin (a vision AI) reads the maths; "Use it" puts it in
// the step, where the keypad can still fix it.
export default function DrawPad({ onUse, height }) {
  const [strokes, setStrokes] = useState([]); // finished lines
  const [live, setLive] = useState(null); // the line being drawn
  const [status, setStatus] = useState('drawing'); // drawing | reading | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  // Made once. `line` is the line being drawn (a plain variable, so a
  // finger moving fast doesn't wait for React).
  const [responder] = useState(() => {
    let line = null;
    const point = (e) => [Math.round(e.nativeEvent.locationX), Math.round(e.nativeEvent.locationY)];
    const end = () => {
      const done = line;
      line = null;
      setLive(null);
      if (done) setStrokes((s) => [...s, done]);
    };
    return PanResponder.create({
      // Take the touch from any scrolling screen around the pad
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (e) => {
        line = point(e);
        setLive(line);
      },
      onPanResponderMove: (e) => {
        if (!line) return;
        const [x, y] = point(e);
        const px = line[line.length - 2];
        const py = line[line.length - 1];
        if (Math.abs(x - px) + Math.abs(y - py) < 2) return;
        line = [...line, x, y];
        setLive(line);
      },
      onPanResponderRelease: end,
      onPanResponderTerminate: end,
    });
  });

  const clear = () => {
    setStrokes([]);
    setStatus('drawing');
    setResult(null);
    setError(null);
  };
  const undo = () => setStrokes((s) => s.slice(0, -1));

  const read = async () => {
    setStatus('reading');
    setError(null);
    try {
      setResult(await readWrittenAnswer(strokes));
      setStatus('done');
    } catch (e) {
      setError(e.message || 'Orrin couldn’t read that. Try again.');
      setStatus('error');
    }
  };

  if (status === 'done') {
    return (
      <View style={[styles.pad, styles.resultPad, { height }]}>
        <ReadResult
          title="Orrin read"
          maths={result?.maths}
          onAgain={clear}
          onUse={(maths) => {
            clear();
            onUse(maths);
          }}
        />
      </View>
    );
  }

  const empty = !strokes.length && !live;
  return (
    <View style={[styles.wrap, { height }]}>
      <View
        style={[styles.pad, styles.canvas, Platform.OS === 'web' && styles.webCanvas]}
        accessible
        accessibilityLabel="Writing pad. Write your step with your finger."
        {...responder.panHandlers}
      >
        <View style={FILL} pointerEvents="none">
          <Svg width="100%" height="100%">
            {strokes.map((line, i) => (
              <Path key={i} d={pathFor(line)} stroke={colors.white} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            ))}
            {live && <Path d={pathFor(live)} stroke={colors.gold} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
          </Svg>
        </View>
        {empty && (
          <View style={styles.placeholder} pointerEvents="none">
            <Icon name="pencil" size={26} color={colors.border} />
            <Text style={styles.placeholderText}>Write your step here with your finger, big and clear.</Text>
          </View>
        )}
        {status === 'reading' && (
          <View style={styles.busy} pointerEvents="none">
            <Text style={styles.busyText}>Orrin is reading your writing…</Text>
          </View>
        )}
      </View>
      {status === 'error' && (
        <Text style={styles.error} accessibilityLiveRegion="assertive" numberOfLines={2}>
          {error}
        </Text>
      )}
      <View style={styles.toolbar}>
        <Pressable onPress={undo} disabled={!strokes.length} accessibilityRole="button" accessibilityLabel="Undo the last line" style={({ pressed }) => [styles.tool, !strokes.length && styles.off, pressed && styles.pressed]}>
          <Icon name="chevronLeft" size={18} />
          <Text style={styles.toolText}>Undo</Text>
        </Pressable>
        <Pressable onPress={clear} disabled={!strokes.length} accessibilityRole="button" accessibilityLabel="Clear the pad" style={({ pressed }) => [styles.tool, !strokes.length && styles.off, pressed && styles.pressed]}>
          <Icon name="x" size={18} />
          <Text style={styles.toolText}>Clear</Text>
        </Pressable>
        <Pressable
          onPress={read}
          disabled={!strokes.length || status === 'reading'}
          accessibilityRole="button"
          accessibilityLabel="Read my writing"
          style={({ pressed }) => [styles.tool, styles.readTool, (!strokes.length || status === 'reading') && styles.off, pressed && styles.pressed]}
        >
          <Icon name="sparkles" size={18} color={colors.gold} />
          <Text style={[styles.toolText, styles.readText]}>Read it</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  pad: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
  },
  canvas: { flex: 1, overflow: 'hidden', backgroundColor: colors.bg },
  webCanvas: { touchAction: 'none', userSelect: 'none', cursor: 'crosshair' },
  resultPad: { paddingHorizontal: 16, paddingVertical: 12 },
  placeholder: { ...FILL, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 24 },
  placeholderText: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.mute, textAlign: 'center' },
  busy: { ...FILL, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(13,13,13,0.7)' },
  busyText: { fontFamily: fonts.semibold, fontSize: 15, color: colors.gold },
  error: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18, color: '#FF9B8F' },
  toolbar: { height: TOOLBAR, flexDirection: 'row', gap: 8 },
  tool: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#2A2340',
  },
  readTool: { flex: 1.3, borderColor: colors.gold, backgroundColor: colors.indigo },
  off: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
  toolText: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
  readText: { color: colors.white },
});
