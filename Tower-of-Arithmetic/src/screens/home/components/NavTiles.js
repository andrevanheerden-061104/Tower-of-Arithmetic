import { StyleSheet, View } from 'react-native';
import NavTile from './NavTile';

// The row of three: Characters, Profile, Settings.
export default function NavTiles({ onCharacters, onProfile, onSettings }) {
  return (
    <View style={styles.row}>
      <NavTile label="Characters" icon="users" onPress={onCharacters} />
      <NavTile label="Profile" icon="user" onPress={onProfile} />
      <NavTile label="Settings" icon="settings" onPress={onSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 13 },
});
