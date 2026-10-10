import { StyleSheet, View } from 'react-native';
import WareTile from './WareTile';

// The six wares, three to a row.
export default function WareGrid({ wares, coins, sold, selectedId, onSelect }) {
  const rows = [];
  for (let i = 0; i < wares.length; i += 3) rows.push(wares.slice(i, i + 3));
  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((ware) => (
            <WareTile
              key={ware.id}
              ware={ware}
              coins={coins}
              sold={sold.includes(ware.id)}
              selected={ware.id === selectedId}
              onPress={() => onSelect(ware.id)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
});
