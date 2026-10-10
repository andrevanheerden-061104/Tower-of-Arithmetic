import { StyleSheet, View } from 'react-native';
import TypeTile from './TypeTile';

// The maths types in two columns.
export default function TypeGrid({ types, selectedId, onSelect }) {
  const rows = [];
  for (let i = 0; i < types.length; i += 2) rows.push(types.slice(i, i + 2));

  return (
    <View style={styles.grid} accessibilityRole="radiogroup">
      {rows.map((row) => (
        <View key={row[0].id} style={styles.row}>
          {row.map((type) => (
            <TypeTile key={type.id} type={type} selected={type.id === selectedId} onPress={() => onSelect(type.id)} />
          ))}
          {row.length === 1 && <View style={styles.empty} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { gap: 12 },
  row: { flexDirection: 'row', gap: 12 },
  empty: { flex: 1 },
});
