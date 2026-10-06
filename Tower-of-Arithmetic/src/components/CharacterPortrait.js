import { Image, StyleSheet, View } from 'react-native';
import { colors } from '../theme/theme';

// A small framed close-up of a character's face, cut from the full sprite.
// `zoom` is how many times taller the sprite is drawn than the frame.
export default function CharacterPortrait({
  character,
  size,
  radius = size / 2,
  borderWidth = 2,
  borderColor = colors.gold,
  zoom = 2.8,
}) {
  const imageHeight = size * zoom;
  const imageWidth = imageHeight * character.aspect;

  return (
    <View
      style={[
        styles.frame,
        { width: size, height: size, borderRadius: radius, borderWidth, borderColor },
      ]}
    >
      <Image
        source={character.image}
        style={[
          styles.image,
          {
            width: imageWidth,
            height: imageHeight,
            // Slide the sprite so the face sits in the middle of the frame
            left: size / 2 - character.face.x * imageWidth - borderWidth,
            top: size / 2 - character.face.y * imageHeight - borderWidth,
          },
          // Locked characters are shown as a black silhouette
          character.locked && styles.silhouette,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { backgroundColor: colors.indigo, overflow: 'hidden' },
  image: { position: 'absolute' },
  silhouette: { tintColor: '#000000' },
});
