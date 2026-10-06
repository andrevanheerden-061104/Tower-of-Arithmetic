import { StyleSheet, Text } from 'react-native';
import { useTextScale } from '../context/TextSizeContext';

// Use this instead of React Native's Text everywhere in the app.
// It works the same, but makes the font bigger or smaller to match
// the Text size chosen in Settings. `maxScale` limits how much a label
// may grow, for the few places where there is no room to spare.
export default function AppText({ style, maxScale, ...rest }) {
  const chosen = useTextScale();
  const scale = maxScale ? Math.min(chosen, maxScale) : chosen;
  if (scale === 1) return <Text style={style} {...rest} />;

  const flat = StyleSheet.flatten(style) ?? {};
  const scaled = {};
  if (flat.fontSize) scaled.fontSize = flat.fontSize * scale;
  if (flat.lineHeight) scaled.lineHeight = flat.lineHeight * scale;

  return <Text style={[style, scaled]} {...rest} />;
}
