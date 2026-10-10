import { StyleSheet, View } from 'react-native';
import ChoiceOption from '../../../../components/run/ChoiceOption';
import ItemIcon from '../../../../components/run/ItemIcon';
import { colors } from '../../../../theme/theme';

// The ghost's three gifts; one can be chosen.
export default function GiftList({ gifts, selectedId, onSelect }) {
  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      {gifts.map((gift) => (
        <ChoiceOption
          key={gift.id}
          icon={<ItemIcon kind={gift.icon} size={30} cursed={gift.cursed} />}
          title={gift.title}
          detail={gift.detail}
          note={gift.drawback ?? 'No drawback'}
          noteColor={gift.drawback ? '#FF9B8F' : colors.mute}
          selected={gift.id === selectedId}
          onPress={() => onSelect(gift.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
});
