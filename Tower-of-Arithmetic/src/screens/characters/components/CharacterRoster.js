import { StyleSheet, Text, View } from 'react-native';
import CharacterThumb from './CharacterThumb';
import { colors, fonts } from '../../../theme/theme';

// "Characters 1 of 3" on the left, a thumbnail for each character on the right.
export default function CharacterRoster({ characters, index, onSelect }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.label}>
        <Text style={styles.small}>Characters</Text>
        <Text style={styles.count}>
          {index + 1} of {characters.length}
        </Text>
      </View>

      <View style={styles.thumbs}>
        {characters.map((character, i) => (
          <CharacterThumb
            key={character.id}
            character={character}
            active={i === index}
            onPress={() => onSelect(i)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { gap: 2 },
  small: { fontFamily: fonts.medium, fontSize: 12, color: colors.mute },
  count: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  thumbs: { flexDirection: 'row', gap: 10 },
});
