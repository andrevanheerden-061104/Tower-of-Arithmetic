import { StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import { colors } from '../../../../theme/theme';

// The paths between rooms. The route already walked is solid gold, the
// ways forward from the player are dotted gold, everything else is dotted grey.
export default function MapEdges({ nodes, map, position, width, height, cleared, currentId }) {
  const lines = [];
  for (const from of nodes) {
    for (const toId of from.next) {
      const to = map.nodes[toId];
      const a = position(from);
      const b = position(to);
      const walked = cleared.includes(from.id) && (cleared.includes(to.id) || to.id === currentId);
      const forward = from.id === currentId;
      lines.push(
        <Line
          key={`${from.id}>${toId}`}
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke={walked || forward ? colors.gold : colors.border}
          strokeWidth={walked ? 3 : forward ? 3 : 2}
          strokeDasharray={walked ? undefined : '1 7'}
          strokeLinecap="round"
          opacity={walked || forward ? 1 : 0.7}
        />,
      );
    }
  }

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      {lines}
    </Svg>
  );
}
