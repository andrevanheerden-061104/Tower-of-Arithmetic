import { StyleSheet, View } from 'react-native';
import ChoiceOption from '../../../../components/run/ChoiceOption';
import ItemIcon from '../../../../components/run/ItemIcon';

// The player's cursed items, pick one to cleanse.
export default function CursedList({ items, selectedId, onSelect }) {
  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {items.map((item) => (
        <ChoiceOption
          key={item.id}
          icon={<ItemIcon kind={item.icon} size={30} cursed />}
          title={item.name}
          detail={`Item · ${item.effect}`}
          note={`Curse: ${item.curse}`}
          noteColor="#FF9B8F"
          selected={item.id === selectedId}
          onPress={() => onSelect(item.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
});
