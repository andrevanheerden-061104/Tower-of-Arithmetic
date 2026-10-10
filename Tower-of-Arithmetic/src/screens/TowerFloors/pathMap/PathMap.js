import { useState } from 'react';
import { View } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';
import ScreenBackground from '../../../components/ScreenBackground';
import Shade from '../../../components/Shade';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import { currentRoom, runVersion } from '../../../game/run';
import MapBoard from './components/MapBoard';
import MapLegend from './components/MapLegend';
import SelectedRoom from './components/SelectedRoom';
import styles from './PathMap.styles';

// The dungeon map. The player picks one of the rooms joined to the room
// they're in, then enters it. The map itself is made by the generator in
// src/game/mapGenerator.js and is different every run.
export default function PathMap({ navigate, run, onEnterRoom }) {
  const version = runVersion(run);
  const here = currentRoom(run);
  const reachable = here.next;
  const [selectedId, setSelectedId] = useState(reachable[0] ?? null);
  const selected = selectedId ? run.map.nodes[selectedId] : null;

  const floorLabel = here.floor === 0 ? 'Tower gate' : `Floor ${here.floor} cleared`;

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.18} />
      <Shade stops={[[0, 0.5], [1, 0.95]]} />

      <View style={styles.content}>
        <RunHud run={run} navigate={navigate} floorLabel={floorLabel} />

        <View style={styles.titleRow}>
          <RunTitle>Choose your path</RunTitle>
        </View>

        <View style={styles.board}>
          <MapBoard
            map={run.map}
            currentId={run.currentId}
            cleared={run.cleared}
            reachable={reachable}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <MapLegend roomTypes={version.rooms} />
        </View>

        {selected && <SelectedRoom room={selected} />}
        <PrimaryButton
          label={selected ? `Enter floor ${selected.floor}` : 'Choose a room'}
          disabled={!selected}
          onPress={() => onEnterRoom(selected.id)}
        />
      </View>
    </View>
  );
}
