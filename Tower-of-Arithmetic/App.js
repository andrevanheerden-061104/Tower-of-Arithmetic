import { useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { NavigationBar } from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
// Each weight is imported from its own folder so only these four font files
// are bundled (importing from the package root would pull in all 18).
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat/400Regular';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat/500Medium';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat/600SemiBold';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat/700Bold';
import { TEXT_SCALES, TextSizeProvider } from './src/context/TextSizeContext';
import { DEFAULT_CHARACTER_ID, getCharacter } from './src/data/characters';
import { DEFAULT_SETTINGS } from './src/data/settings';
import { ITEMS } from './src/game/encounters';
import {
  addCoins,
  addItem,
  addPotion,
  addSpell,
  clearRoom,
  createRun,
  currentRoom,
  enterRoom,
  grantReward,
  heal,
  removeCurse,
  screenForRoom,
} from './src/game/run';
import { versionForGrade } from './src/game/versions';
import Characters from './src/screens/characters/Characters';
import Home from './src/screens/home/Home';
import Login from './src/screens/login/Login';
import Onboarding from './src/screens/onboarding/Onboarding';
import Profile from './src/screens/profile/Profile';
import Settings from './src/screens/settings/Settings';
import Signup from './src/screens/signup/Signup';
import Splash from './src/screens/splash/Splash';
import BossRoom from './src/screens/TowerFloors/bossRoom/BossRoom';
import ChooseSpell from './src/screens/TowerFloors/chooseSpell/ChooseSpell';
import Combat from './src/screens/TowerFloors/combat/Combat';
import Deck from './src/screens/TowerFloors/deck/Deck';
import Defeat from './src/screens/TowerFloors/defeat/Defeat';
import DungeonType from './src/screens/TowerFloors/dungeonType/DungeonType';
import MysteryEvent from './src/screens/TowerFloors/mystery/MysteryEvent';
import PathMap from './src/screens/TowerFloors/pathMap/PathMap';
import Puzzle from './src/screens/TowerFloors/puzzle/Puzzle';
import RemoveCurse from './src/screens/TowerFloors/removeCurse/RemoveCurse';
import RestSite from './src/screens/TowerFloors/rest/RestSite';
import FloorReward from './src/screens/TowerFloors/reward/FloorReward';
import RunStats from './src/screens/TowerFloors/runStats/RunStats';
import Shop from './src/screens/TowerFloors/shop/Shop';
import { colors } from './src/theme/theme';

// Every screen in the app, by name. To add one: build it in src/screens,
// import it above and add it to this list.
const SCREENS = {
  splash: Splash,
  signup: Signup,
  login: Login,
  onboarding: Onboarding,
  home: Home,
  characters: Characters,
  profile: Profile,
  settings: Settings,
  // The tower (src/screens/TowerFloors)
  dungeonType: DungeonType,
  pathMap: PathMap,
  combat: Combat,
  boss: BossRoom,
  puzzle: Puzzle,
  mystery: MysteryEvent,
  shop: Shop,
  rest: RestSite,
  removeCurse: RemoveCurse,
  reward: FloorReward,
  chooseSpell: ChooseSpell,
  defeat: Defeat,
  runStats: RunStats,
  deck: Deck,
};

// Screens that only make sense during a run.
const RUN_SCREENS = [
  'pathMap',
  'combat',
  'boss',
  'puzzle',
  'mystery',
  'shop',
  'rest',
  'removeCurse',
  'reward',
  'chooseSpell',
  'defeat',
  'runStats',
  'deck',
];

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Simple navigation: remember which screen is showing (and the last few,
  // so a screen like the deck can go back to wherever it was opened from).
  const [screen, setScreen] = useState('splash');
  const [history, setHistory] = useState([]);
  const navigate = (to) => {
    setHistory((h) => [...h.slice(-9), screen]);
    setScreen(to);
  };
  const goBack = () => {
    setScreen(history.at(-1) ?? 'home');
    setHistory((h) => h.slice(0, -1));
  };

  // Front end only for now: the chosen grade is kept in memory
  // and is lost when the app closes.
  const [grade, setGrade] = useState(null);

  // Which character the player picked, and their settings.
  // Also only kept in memory for now.
  const [characterId, setCharacterId] = useState(DEFAULT_CHARACTER_ID);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const changeSetting = (key, value) => setSettings((old) => ({ ...old, [key]: value }));

  // The current climb of the tower (null when no run is going).
  // The game rules live in src/game; these handlers just join them to the screens.
  const [run, setRun] = useState(null);
  const updateRun = (change) => setRun((r) => (r ? change(r) : r));
  // Where the spell picker goes back to: the reward screen, or the map
  // when the spell came from the ghost's gift.
  const [spellReturn, setSpellReturn] = useState('reward');

  const finishRoomToMap = (change = (r) => r) => {
    updateRun((r) => clearRoom(change(r)));
    navigate('pathMap');
  };

  const runActions = {
    onStartRun: (dungeonTypeId) => {
      setRun(createRun({ version: versionForGrade(grade), dungeonTypeId }));
      navigate('pathMap');
    },
    onEnterRoom: (roomId) => {
      const room = run.map.nodes[roomId];
      updateRun((r) => enterRoom(r, roomId));
      navigate(screenForRoom(room.type));
    },
    // Won a fight, solved a puzzle or beat the boss
    onVictory: () => {
      updateRun((r) => grantReward(r, currentRoom(r).type));
      navigate('reward');
    },
    onSolved: () => {
      updateRun((r) => grantReward(r, 'puzzle'));
      navigate('reward');
    },
    onDefeat: () => navigate('defeat'),
    // Ghost event
    onAccept: (giftId) => {
      if (giftId === 'spell') {
        updateRun(clearRoom);
        setSpellReturn('pathMap');
        navigate('chooseSpell');
        return;
      }
      finishRoomToMap((r) => {
        if (giftId === 'coins') return addCoins(r, 30);
        if (giftId === 'xp') return { ...r, xp: r.xp + 30 };
        if (giftId === 'heal') return heal(r, 0.5);
        if (ITEMS[giftId]) return addItem(r, giftId);
        return r;
      });
    },
    // Rest site
    onRest: () => finishRoomToMap((r) => heal(r, 1)),
    onRemove: (itemId) => finishRoomToMap((r) => removeCurse(r, itemId)),
    // Shop
    onBuy: (ware) =>
      updateRun((r) => {
        let next = addCoins(r, -ware.price);
        if (ware.kind === 'spell') next = addSpell(next, ware.spellId);
        if (ware.kind === 'item') next = addItem(next, ware.itemId);
        if (ware.kind === 'potion') next = addPotion(next, ware.potionId);
        return next;
      }),
    onLeave: () => finishRoomToMap(),
    // Spell picker (spellId is null when skipped)
    onDone: (spellId) => {
      const fromReward = spellReturn === 'reward';
      updateRun((r) => {
        let next = spellId ? addSpell(r, spellId) : r;
        if (fromReward && next.reward) {
          next = { ...next, reward: { ...next.reward, spellTaken: Boolean(spellId), spellChoice: Boolean(spellId) } };
        }
        return next;
      });
      setSpellReturn('reward');
      navigate(fromReward ? 'reward' : 'pathMap');
    },
    // Leaving a finished run
    onEndRun: () => {
      setRun(null);
      navigate('home');
    },
    onNewRun: () => {
      setRun(null);
      navigate('dungeonType');
    },
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  // A run screen with no run (e.g. after the app reloads) goes home instead.
  const name = RUN_SCREENS.includes(screen) && !run ? 'home' : screen;
  const Screen = SCREENS[name] ?? Splash;

  return (
    // Everything inside reads the text size chosen in Settings
    <TextSizeProvider value={TEXT_SCALES[settings.textSize] ?? 1}>
      {/* Full screen on every page: hide the top status bar (clock, battery)
          and Android's back / home / recent-apps bar. The player swipes in
          from the top or bottom edge to bring them back for a moment. */}
      <StatusBar hidden />
      <NavigationBar hidden />
      <Screen
        // key makes a fresh screen each time a room is entered, so a new
        // fight never starts with the last fight's state
        key={`${name}-${run?.currentId ?? ''}`}
        navigate={navigate}
        goBack={goBack}
        grade={grade}
        onGradeChosen={setGrade}
        character={getCharacter(characterId)}
        onCharacterChosen={setCharacterId}
        settings={settings}
        onSettingChange={changeSetting}
        run={run}
        updateRun={updateRun}
        {...runActions}
      />
    </TextSizeProvider>
  );
}
