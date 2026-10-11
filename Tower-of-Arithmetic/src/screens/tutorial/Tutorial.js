import { useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { playVoice, stopVoice } from '../../audio/voice';
import { TutorialContext } from '../../components/tutorial/TutorialTarget';
import { makeDemoRun } from '../../data/tutorialDemo';
import { tutorialSteps } from '../../data/tutorialSteps';
import { versionForGrade } from '../../game/versions';
import { usePlayer } from '../../hooks/usePlayer';
import { spacing } from '../../theme/theme';
import GuideBubble from './components/GuideBubble';
import Spotlight, { padded } from './components/Spotlight';
import TutorialScene from './components/TutorialScene';
import styles from './Tutorial.styles';

const GAP = 10; // space between the speech bubble and a spotlight

// One rectangle round several.
function union(rects) {
  const x = Math.min(...rects.map((r) => r.x));
  const y = Math.min(...rects.map((r) => r.y));
  return {
    x,
    y,
    width: Math.max(...rects.map((r) => r.x + r.width)) - x,
    height: Math.max(...rects.map((r) => r.y + r.height)) - y,
  };
}

// Which word is being spoken `seconds` into the line (-1 before the first).
function wordAt(starts, seconds) {
  if (!starts) return -1;
  let word = -1;
  starts.forEach((start, i) => {
    if (start <= seconds) word = i;
  });
  return word;
}

// Where the speech bubble goes: at the bottom, unless that covers the
// spotlight, then at the top; if neither fits, just above or below it.
function guideTop(holes, screenHeight, guideHeight) {
  const bottom = screenHeight - 28 - guideHeight;
  const top = spacing.top - 16;
  if (!holes.length) return bottom;
  const y1 = Math.min(...holes.map((h) => h.y));
  const y2 = Math.max(...holes.map((h) => h.y + h.height));
  const clear = (at) => at + guideHeight + GAP <= y1 || at >= y2 + GAP;
  if (clear(bottom) && clear(top)) return (y1 + y2) / 2 < screenHeight / 2 ? bottom : top;
  if (clear(bottom)) return bottom;
  if (clear(top)) return top;
  if (y1 - GAP - guideHeight >= 4) return y1 - GAP - guideHeight;
  if (y2 + GAP + guideHeight <= screenHeight - 4) return y2 + GAP;
  return bottom;
}

// How to play: Orrin walks the player through the game on the real
// screens, one step at a time (steps in src/data/tutorialSteps.js). Each
// step's line is read out, the word being said lights up, and the speaker
// button plays it again.
// Opened from Settings for now; later it will also start by itself after
// a new account is made.
export default function Tutorial({ goBack, grade, character }) {
  const version = versionForGrade(grade);
  const steps = useMemo(() => tutorialSteps(version), [version]);
  const [index, setIndex] = useState(0);
  const step = steps[index];

  // Sizes measured on screen
  const [screen, setScreen] = useState(null); // { x, y, width, height } of this screen
  const [guideHeight, setGuideHeight] = useState(0);
  const [measured, setMeasured] = useState({ step: -1, rects: {} });
  const rootRef = useRef(null);

  // One made-up run per kind of screen, made once when the tutorial opens
  // so a screen looks the same if the player sees it twice.
  const [demoRuns] = useState(() =>
    Object.fromEntries([...new Set(steps.map((s) => s.scene))].map((scene) => [scene, makeDemoRun(version, character, scene)])),
  );

  // Shared with every <TutorialTarget> in the scene: which ids to measure,
  // and where to send the result.
  const tutorial = useMemo(
    () => ({
      step: index,
      targets: step.targets,
      report: (id, rect) =>
        setMeasured((old) => {
          const rects = old.step === index ? old.rects : {};
          const prev = rects[id];
          const same = prev && ['x', 'y', 'width', 'height'].every((k) => Math.abs(prev[k] - rect[k]) < 1);
          return same && old.step === index ? old : { step: index, rects: { ...rects, [id]: rect } };
        }),
    }),
    [index, step],
  );

  // Orrin's voice. `voice` says how far this step's line has got.
  const [voice, setVoice] = useState({ step: -1, word: -1, ended: false });
  const speak = (at) => {
    const s = steps[at];
    if (!s.audio) return;
    playVoice(s.audio, {
      onTime: (seconds) =>
        setVoice((old) => {
          const word = wordAt(s.wordStarts, seconds);
          return old.step === at && old.word === word && !old.ended ? old : { step: at, word, ended: false };
        }),
      onEnd: () => setVoice({ step: at, word: -1, ended: true }),
    });
  };
  // Read each step out when it opens; stop when it changes or the tutorial closes
  useEffect(() => {
    speak(index);
    return stopVoice;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, steps]);
  const replay = () => {
    setVoice({ step: index, word: -1, ended: false });
    speak(index);
  };
  const thisStep = voice.step === index;
  const speaking = Boolean(step.audio) && !(thisStep && voice.ended);
  const spokenWord = thisStep && !voice.ended ? voice.word : -1;

  const { updateProfile } = usePlayer();
  const finish = () => {
    stopVoice();
    updateProfile({ tutorial_done: true });
    goBack();
  };
  const next = () => (index === steps.length - 1 ? finish() : setIndex(index + 1));

  // Spotlights, in this screen's coordinates
  const rects = measured.step === index ? step.targets.map((id) => measured.rects[id]).filter(Boolean) : [];
  const local = rects.map((r) => ({ ...r, x: r.x - (screen?.x ?? 0), y: r.y - (screen?.y ?? 0) }));
  const holes = (step.union && local.length ? [union(local)] : local).map(padded);
  const ready = screen && guideHeight > 0;

  return (
    <View
      ref={rootRef}
      style={styles.screen}
      onLayout={() =>
        rootRef.current?.measureInWindow((x, y, width, height) => setScreen({ x, y, width, height }))
      }
    >
      <TutorialContext.Provider value={tutorial}>
        <TutorialScene key={step.scene} scene={step.scene} run={demoRuns[step.scene]} character={character} />
      </TutorialContext.Provider>

      <View style={styles.overlay} pointerEvents="box-none">
        {screen && <Spotlight width={screen.width} height={screen.height} holes={holes} />}
        <GuideBubble
          key={index}
          text={step.text}
          index={index}
          total={steps.length}
          junior={version.id === 'junior'}
          spokenWord={spokenWord}
          speaking={speaking}
          canReplay={Boolean(step.audio)}
          onReplay={replay}
          onNext={next}
          onSkip={finish}
          onLayout={(e) => setGuideHeight(e.nativeEvent.layout.height)}
          style={[
            styles.guide,
            { top: ready ? guideTop(holes, screen.height, guideHeight) : undefined, bottom: ready ? undefined : 28 },
          ]}
        />
      </View>
    </View>
  );
}
