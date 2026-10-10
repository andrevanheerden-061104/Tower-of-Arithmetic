import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MapEdges from './MapEdges';
import MapNode from './MapNode';

const ROW_HEIGHT = 72;
const PAD_X = 22;
const PAD_Y = 44;

// The scrolling map: dotted paths underneath, rooms on top. It opens
// scrolled to where the player is, and the boss is at the very top.
export default function MapBoard({ map, currentId, cleared, reachable, selectedId, onSelect }) {
  const [width, setWidth] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);
  const scrollRef = useRef(null);

  const height = (map.rows + 2) * ROW_HEIGHT + PAD_Y;
  const nodes = Object.values(map.nodes);

  // Where each room is drawn
  const colWidth = (width - PAD_X * 2) / map.columns;
  const position = (node) => ({
    x: PAD_X + (node.col + 0.5) * colWidth + node.nudgeX,
    y: height - PAD_Y / 2 - ROW_HEIGHT / 2 - (node.row + 1) * ROW_HEIGHT + node.nudgeY,
  });

  const stateOf = (node) => {
    if (node.id === currentId) return 'current';
    if (reachable.includes(node.id)) return 'reachable';
    if (cleared.includes(node.id)) return 'cleared';
    return 'locked';
  };

  // Start the scroll so the player's room sits in the lower part of the view
  const scrollToPlayer = () => {
    if (!width || !viewHeight) return;
    const y = position(map.nodes[currentId]).y;
    scrollRef.current?.scrollTo({ y: Math.max(0, y - viewHeight * 0.65), animated: false });
  };

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => {
        setWidth(e.nativeEvent.layout.width);
        setViewHeight(e.nativeEvent.layout.height);
      }}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={scrollToPlayer}
        accessibilityLabel="Dungeon map"
      >
        {width > 0 && (
          <View style={{ width, height }}>
            <MapEdges nodes={nodes} map={map} position={position} width={width} height={height} cleared={cleared} currentId={currentId} />
            {nodes.map((node) => {
              const { x, y } = position(node);
              return (
                <MapNode
                  key={node.id}
                  node={node}
                  x={x}
                  y={y}
                  state={stateOf(node)}
                  selected={node.id === selectedId}
                  onPress={() => onSelect(node.id)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden', borderRadius: 16 },
});
