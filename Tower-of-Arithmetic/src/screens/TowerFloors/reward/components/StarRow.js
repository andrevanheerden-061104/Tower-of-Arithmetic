import { StyleSheet, View } from 'react-native';
import Icon from '../../../../components/Icon';
import { colors } from '../../../../theme/theme';

// Junior: 1 to 3 stars for how well the floor went.
export default function StarRow({ stars }) {
  return (
    <View style={styles.row} accessible accessibilityLabel={`${stars} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Icon key={i} name="star" size={40} color={colors.gold} fill={i < stars ? colors.gold : 'none'} strokeWidth={1.4} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10 },
});
