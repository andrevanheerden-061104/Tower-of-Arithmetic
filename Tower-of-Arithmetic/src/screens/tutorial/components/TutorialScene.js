import { StyleSheet, View } from 'react-native';
import Home from '../../home/Home';
import BossRoom from '../../TowerFloors/bossRoom/BossRoom';
import ChooseSpell from '../../TowerFloors/chooseSpell/ChooseSpell';
import Combat from '../../TowerFloors/combat/Combat';
import Deck from '../../TowerFloors/deck/Deck';
import MysteryEvent from '../../TowerFloors/mystery/MysteryEvent';
import PathMap from '../../TowerFloors/pathMap/PathMap';
import Puzzle from '../../TowerFloors/puzzle/Puzzle';
import RemoveCurse from '../../TowerFloors/removeCurse/RemoveCurse';
import RestSite from '../../TowerFloors/rest/RestSite';
import FloorReward from '../../TowerFloors/reward/FloorReward';
import Shop from '../../TowerFloors/shop/Shop';

const nothing = () => {};

// Every action a screen might call. In the tutorial they do nothing.
const ACTIONS = {
  navigate: nothing,
  goBack: nothing,
  updateRun: nothing,
  onEnterRoom: nothing,
  onVictory: nothing,
  onDefeat: nothing,
  onSolved: nothing,
  onAccept: nothing,
  onRest: nothing,
  onRemove: nothing,
  onBuy: nothing,
  onLeave: nothing,
  onDone: nothing,
  onSpellBack: nothing,
  onSwapSpell: nothing,
  onMoveToStash: nothing,
  onMoveToDeck: nothing,
  spellFrom: 'reward',
};

// One of the real game screens, shown behind the tutorial's spotlight.
// It can't be tapped and is hidden from screen readers (Nyxara's speech
// bubble says what the screen is about).
export default function TutorialScene({ scene, run, character }) {
  const props = { ...ACTIONS, run, character };
  let screen;
  switch (scene) {
    case 'home':
      screen = <Home {...props} run={null} />;
      break;
    case 'map':
      screen = <PathMap {...props} />;
      break;
    case 'combat':
      screen = <Combat {...props} demo={{ phase: 'player' }} />;
      break;
    case 'cast':
      screen = <Combat {...props} demo={{ phase: 'casting', selected: 0 }} />;
      break;
    case 'boss':
      screen = <BossRoom {...props} demo={{ phase: 'player' }} />;
      break;
    case 'reward':
      screen = <FloorReward {...props} />;
      break;
    case 'chooseSpell':
      screen = <ChooseSpell {...props} />;
      break;
    case 'deck':
      screen = <Deck {...props} />;
      break;
    case 'puzzle':
      screen = <Puzzle {...props} />;
      break;
    case 'mystery':
      screen = <MysteryEvent {...props} />;
      break;
    case 'shop':
      screen = <Shop {...props} />;
      break;
    case 'rest':
      screen = <RestSite {...props} />;
      break;
    case 'removeCurse':
      screen = <RemoveCurse {...props} />;
      break;
    default:
      screen = null;
  }

  return (
    <View
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {screen}
    </View>
  );
}
