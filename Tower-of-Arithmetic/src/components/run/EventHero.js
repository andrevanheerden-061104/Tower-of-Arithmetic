import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Shade from '../Shade';
import { BACKGROUNDS } from './RunBackground';

// The picture at the top of an event screen (ghost, campfire), fading
// into the dark background at the bottom so the text below stays readable.
//
// aspect  picture width / height
// focusY  where the interesting part of the picture is (0 top - 1 bottom);
//         it's placed about 60% of the way down the picture area
export default function EventHero({ image, height, aspect, focusY = 0.5 }) {
  const { width } = useWindowDimensions();
  const imageHeight = width / aspect;
  const top = Math.min(0, Math.max(height - imageHeight, height * 0.6 - focusY * imageHeight));

  return (
    <View style={[styles.wrap, { height }]} pointerEvents="none">
      <Image source={BACKGROUNDS[image]} style={{ position: 'absolute', top, width, height: imageHeight }} />
      <Shade stops={[[0, 0.6], [0.25, 0], [0.7, 0], [1, 1]]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
});
