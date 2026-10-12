import { StyleSheet, View } from 'react-native';
import LessonView from './LessonView';

// A lesson drawn over the whole screen (a fight or a puzzle door), so the
// fight is still there, just as it was, when the player closes it.
export default function LessonOverlay({ versionId, topic, backLabel, onClose, onDone }) {
  return (
    <View style={styles.cover}>
      <LessonView versionId={versionId} topic={topic} onClose={onClose} onFinish={onClose} finishLabel={backLabel} onDone={onDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, elevation: 50 },
});
