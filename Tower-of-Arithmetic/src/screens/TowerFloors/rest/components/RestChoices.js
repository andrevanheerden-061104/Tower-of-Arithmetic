import { StyleSheet, View } from 'react-native';
import Icon from '../../../../components/Icon';
import ChoiceOption from '../../../../components/run/ChoiceOption';
import { Heart, formatHearts } from '../../../../components/run/HeartRow';
import { colors } from '../../../../theme/theme';

// Rest (heal 1 heart) or Remove a curse.
export default function RestChoices({ run, showCurse, curseCount, selected, onSelect }) {
  const after = Math.min(run.maxHearts, run.hearts + 1);
  return (
    <View style={styles.list} accessibilityRole="radiogroup">
      <ChoiceOption
        icon={<Heart size={30} fill={1} />}
        title="Rest"
        detail="Sit by the fire and heal 1 heart."
        note={run.hearts >= run.maxHearts ? 'Your hearts are already full' : `Hearts: ${formatHearts(run.hearts)} → ${formatHearts(after)}`}
        noteColor={colors.gold}
        selected={selected === 'rest'}
        onPress={() => onSelect('rest')}
      />
      {showCurse && (
        <ChoiceOption
          icon={<Icon name="campfire" size={28} color="#FF9B3D" />}
          title="Remove a curse"
          detail="Pick 1 cursed item or spell. The fire burns its curse away."
          note={curseCount ? `You have ${curseCount} cursed ${curseCount === 1 ? 'thing' : 'things'}` : 'Nothing is cursed'}
          disabled={!curseCount}
          selected={selected === 'curse'}
          onPress={() => onSelect('curse')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
});
