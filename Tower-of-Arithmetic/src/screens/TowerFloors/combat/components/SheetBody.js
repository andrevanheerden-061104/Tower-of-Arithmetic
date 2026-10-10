import { useRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { spacing } from '../../../../theme/theme';

// Layout for the inside of the cast sheet:
//   header  stays at the top (the sum)
//   scroll  scrolls (working, hints)
//   footer  stays at the bottom (keypad, Next step, Cast spell)
// `stickToEnd` keeps the newest step in view as steps are added.
// `onOverflow(extra)` reports how much taller the scroll content is than
// the space it has (negative when there's room to spare).
export default function SheetBody({ header, scroll, footer, stickToEnd = false, onOverflow }) {
  const ref = useRef(null);
  const sizes = useRef({ content: 0, view: 0 });
  const report = () => {
    const { content, view } = sizes.current;
    if (onOverflow && content && view) onOverflow(content - view);
  };
  return (
    <View style={styles.wrap}>
      {header ? <View style={styles.header}>{header}</View> : null}
      <ScrollView
        ref={ref}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator
        onLayout={(e) => {
          sizes.current.view = e.nativeEvent.layout.height;
          report();
        }}
        onContentSizeChange={(w, h) => {
          sizes.current.content = h;
          report();
          if (stickToEnd) ref.current?.scrollToEnd({ animated: true });
        }}
      >
        {scroll}
      </ScrollView>
      <View style={styles.footer}>{footer}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  header: { paddingHorizontal: spacing.gutter, paddingBottom: 10 },
  scroll: { flex: 1 },
  scrollContent: { gap: 12, paddingHorizontal: spacing.gutter, paddingBottom: 12 },
  footer: {
    gap: 10,
    paddingTop: 12,
    paddingHorizontal: spacing.gutter,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(140,130,163,0.35)',
    backgroundColor: '#1E1A2B',
  },
});
