import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Text from '../AppText';
import ScreenBackground from '../ScreenBackground';
import Shade from '../Shade';
import { getLesson, pageCount } from '../../data/lessons';
import { VERSIONS } from '../../game/versions';
import { usePlayer } from '../../hooks/usePlayer';
import { colors, fonts, spacing } from '../../theme/theme';
import CompletePage from './CompletePage';
import IntroPage from './IntroPage';
import LessonBlock from './LessonBlock';
import LessonGuide from './LessonGuide';
import LessonHeader from './LessonHeader';
import PracticePage from './PracticePage';

// A whole Spell School lesson, page by page:
//   first page     what the lesson covers
//   teaching pages worked examples with Orrin explaining
//   your turn      one sum to try
//   complete       the badge, then `finishLabel` (e.g. "Practise in the
//                  tower") and `closeLabel` (e.g. "Back")
// Used by the Lesson screen (from the dungeon screen) and over a fight
// after a wrong answer ("Show me how").
export default function LessonView({ versionId, topic, onClose, onFinish, finishLabel, closeLabel, onDone }) {
  const lesson = getLesson(versionId, topic);
  const [page, setPage] = useState(0);
  const [practice, setPractice] = useState(null);
  const scroll = useRef(null);
  const reported = useRef(false);
  // XP this lesson gives when finished (worked out at the start, before
  // finishing marks it done)
  const { lessonXpFor } = usePlayer();
  const [xp] = useState(() => (lesson ? lessonXpFor(lesson.id) : 0));

  const total = lesson ? pageCount(lesson) : 1;
  const last = total - 1;

  useEffect(() => {
    scroll.current?.scrollTo?.({ y: 0, animated: false });
    if (lesson && page === last && !reported.current) {
      reported.current = true;
      onDone?.(lesson.id);
    }
    // Runs when the page changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (!lesson) return null;

  const version = VERSIONS[versionId];
  const junior = versionId === 'junior';
  const type = version.dungeonTypes.find((t) => t.id === topic);
  const teaching = page >= 1 && page <= lesson.pages.length ? lesson.pages[page - 1] : null;
  const practising = page === lesson.pages.length + 1;
  const complete = page === last;
  const next = () => setPage((p) => Math.min(p + 1, last));
  const back = () => (page === 0 ? onClose() : setPage((p) => p - 1));

  const title = page === 0 ? lesson.title : teaching ? teaching.title : practising ? 'Your turn' : 'Lesson complete';

  let body = null;
  let guide = null;
  if (page === 0) {
    body = <IntroPage lesson={lesson} junior={junior} />;
    guide = <LessonGuide junior={junior} text={lesson.intro} action={junior ? 'Let’s go!' : 'Let’s begin'} onAction={next} />;
  } else if (teaching) {
    body = (
      <View style={styles.blocks}>
        {teaching.blocks.map((block, i) => (
          <LessonBlock key={i} block={block} junior={junior} />
        ))}
      </View>
    );
    const lastTeaching = page === lesson.pages.length;
    guide = <LessonGuide junior={junior} text={teaching.orrin} action={lastTeaching ? (junior ? 'My turn!' : 'Try one') : 'Next'} onAction={next} />;
  } else if (practising) {
    body = (
      <View style={styles.blocks}>
        <Text style={styles.tip}>Orrin: {lesson.practice}</Text>
        <PracticePage
          lesson={lesson}
          onFinished={(r) => {
            setPractice(r);
            next();
          }}
        />
      </View>
    );
  } else if (complete) {
    body = <CompletePage lesson={lesson} symbol={type?.symbol ?? '★'} practice={practice} xp={xp} />;
    guide = (
      <LessonGuide
        junior={junior}
        text={lesson.done}
        action={finishLabel}
        onAction={onFinish ?? onClose}
        secondary={closeLabel}
        onSecondary={onClose}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.2} />
      <Shade stops={[[0, 0.6], [0.4, 0.95], [1, 1]]} />
      <View style={styles.top}>
        <LessonHeader topicLabel={type?.label ?? lesson.title} title={title} page={page + 1} total={total} onBack={back} />
      </View>
      <ScrollView ref={scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {body}
        <View style={styles.spacer} />
        {guide}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  top: { paddingTop: spacing.top, paddingHorizontal: spacing.gutter, paddingBottom: 16 },
  content: { flexGrow: 1, gap: 20, paddingHorizontal: spacing.gutter, paddingBottom: spacing.bottom },
  spacer: { flex: 1, minHeight: 8 },
  blocks: { gap: 14 },
  tip: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 20, color: colors.pink },
});
