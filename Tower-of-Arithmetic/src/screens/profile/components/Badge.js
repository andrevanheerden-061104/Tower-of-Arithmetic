import { Image, StyleSheet, View } from 'react-native';
import Text from '../../../components/AppText';
import Icon from '../../../components/Icon';
import { colors, fonts } from '../../../theme/theme';

// One badge: its picture in colour once earned. A locked badge is a dark
// shadow of the picture with a padlock, so the player can see what's next.
export default function Badge({ name, description, image, earned }) {
  return (
    <View style={styles.wrap} accessible accessibilityLabel={earned ? `Badge earned: ${name}` : `Locked badge: ${name}. ${description ?? ''}`}>
      <View style={styles.medal}>
        <Image source={image} style={[styles.image, !earned && styles.locked]} resizeMode="contain" />
        {!earned && (
          <View style={styles.lock}>
            <Icon name="lock" size={20} color={colors.mute} strokeWidth={2} />
          </View>
        )}
      </View>
      <Text style={[styles.name, !earned && styles.nameLocked]} numberOfLines={1}>
        {name}
      </Text>
      {description ? (
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', gap: 4 },
  medal: { width: 84, height: 84, alignItems: 'center', justifyContent: 'center' },
  image: { width: 84, height: 84 },
  locked: { tintColor: '#2A2438', opacity: 0.9 },
  lock: { position: 'absolute', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.panel, borderWidth: 1, borderColor: colors.border },
  name: { fontFamily: fonts.semibold, fontSize: 13, color: colors.white, textAlign: 'center' },
  nameLocked: { color: colors.mute },
  description: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 15, color: colors.mute, textAlign: 'center' },
});
