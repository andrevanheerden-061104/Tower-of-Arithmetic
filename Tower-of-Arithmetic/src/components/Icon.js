import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '../theme/theme';

// Lucide icon shapes (https://lucide.dev), drawn with react-native-svg
// so no extra icon package is needed. Add a new icon by adding an entry here.
const ICONS = {
  user: [{ p: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }, { c: [12, 7, 4] }],
  users: [
    { p: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' },
    { c: [9, 7, 4] },
    { p: 'M22 21v-2a4 4 0 0 0-3-3.87' },
    { p: 'M16 3.13a4 4 0 0 1 0 7.75' },
  ],
  mail: [{ r: [2, 4, 20, 16, 2] }, { p: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }],
  lock: [{ r: [3, 11, 18, 11, 2] }, { p: 'M7 11V7a5 5 0 0 1 10 0v4' }],
  eye: [{ p: 'M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z' }, { c: [12, 12, 3] }],
  eyeOff: [
    { p: 'M9.88 9.88a3 3 0 1 0 4.24 4.24' },
    { p: 'M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68' },
    { p: 'M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61' },
    { p: 'M2 2l20 20' },
  ],
  chevronLeft: [{ p: 'm15 18-6-6 6-6' }],
  award: [{ c: [12, 8, 6] }, { p: 'M15.477 12.89 17 22l-5-3-5 3 1.523-9.11' }],
  logOut: [
    { p: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' },
    { p: 'm16 17 5-5-5-5' },
    { p: 'M21 12H9' },
  ],
  arrowLeft: [{ p: 'm12 19-7-7 7-7' }, { p: 'M19 12H5' }],
  check: [{ p: 'M20 6 9 17l-5-5' }],
  play: [{ p: 'M6 3l14 9-14 9V3z' }],
  chevronRight: [{ p: 'm9 18 6-6-6-6' }],
  heart: [
    {
      p: 'M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z',
    },
  ],
  settings: [
    {
      p: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z',
    },
    { c: [12, 12, 3] },
  ],
};

// Icons are decorative: the button or row they sit in carries the label
// for screen readers, so the SVG itself is hidden from them.
export default function Icon({ name, size = 20, color = colors.white, strokeWidth = 2, fill = 'none' }) {
  const shapes = ICONS[name];
  if (!shapes) return null;

  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {shapes.map((s, i) => {
        if (s.p) return <Path key={i} d={s.p} {...common} />;
        if (s.c) return <Circle key={i} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} {...common} />;
        return <Rect key={i} x={s.r[0]} y={s.r[1]} width={s.r[2]} height={s.r[3]} rx={s.r[4]} {...common} />;
      })}
    </Svg>
  );
}
