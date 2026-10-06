import { StyleSheet, View } from 'react-native';
import StatTile from './StatTile';

// The row of three stat tiles.
export default function StatTiles({ highestFloor, runsCompleted, accuracy }) {
  return (
    <View style={styles.row}>
      <StatTile value={highestFloor} label="Highest floor" art="tower" accent="#C9A8FF" />
      <StatTile value={runsCompleted} label="Runs completed" art="flag" accent="#F2EA79" />
      <StatTile value={`${accuracy}%`} label="Accuracy" art="target" accent="#FFB86B" />
    </View>
  );
}

const styles = StyleSheet.create({
  // paddingTop leaves room for the icons that stick out of the tiles
  row: { flexDirection: 'row', gap: 13, paddingTop: 16 },
});
