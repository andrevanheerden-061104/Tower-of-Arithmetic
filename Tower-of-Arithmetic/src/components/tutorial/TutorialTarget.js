import { createContext, useContext, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

// Lets the tutorial find the part of a real screen it is talking about.
//
// The tutorial shows the real game screens with a spotlight on one part.
// Screens mark those parts with <TutorialTarget id="...">:
//   - wrapped round an element:  <TutorialTarget id="newRun"><Button /></TutorialTarget>
//   - on its own inside an element (fills it), or with a style giving its
//     own position:              <TutorialTarget id="enemy" style={...} />
//
// Outside the tutorial there is no TutorialContext, so a target just
// renders its children as they are and changes nothing in the game.
export const TutorialContext = createContext(null);

export default function TutorialTarget({ id, children, style }) {
  const tutorial = useContext(TutorialContext);
  const ref = useRef(null);
  const active = tutorial?.targets.includes(id);

  const measure = () => {
    if (!active || !ref.current) return;
    ref.current.measureInWindow((x, y, width, height) => {
      if (width || height) tutorial.report(id, { x, y, width, height });
    });
  };

  // Measure when this target becomes the one in the spotlight, and again a
  // moment later once images, scroll positions and sheets have settled.
  useEffect(() => {
    if (!active) return undefined;
    const timers = [60, 400, 900].map((ms) => setTimeout(measure, ms));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, tutorial?.step]);

  if (!tutorial) return children ?? null;

  if (children) {
    return (
      <View ref={ref} collapsable={false} style={style} onLayout={measure}>
        {children}
      </View>
    );
  }
  return <View ref={ref} collapsable={false} pointerEvents="none" style={style ?? StyleSheet.absoluteFill} onLayout={measure} />;
}
