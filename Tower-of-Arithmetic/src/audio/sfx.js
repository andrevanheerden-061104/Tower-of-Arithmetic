import { Platform } from 'react-native';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { webUri } from './music';

// ---------------------------------------------------------------------------
// Sound effects
//
// Short sounds for what happens in a fight or puzzle. App.js turns them on
// or off with the Sound effects setting (setSoundEffects). Each sound gets
// one player, made the first time it's needed and then reused (it is
// rewound to the start each time it plays).
//
// They mix with the background music instead of pausing it.
// ---------------------------------------------------------------------------

const SOUNDS = {
  correct: require('../assets/sound/corrcet.mp3'),
  wrong: require('../assets/sound/wrong.mp3'),
  hit: require('../assets/sound/hit_basic.mp3'),
  crit: require('../assets/sound/hit_crit.mp3'),
  fire: require('../assets/sound/Fire_spell.mp3'),
  ice: require('../assets/sound/ice_spell.mp3'),
  light: require('../assets/sound/light_spell.mp3'),
  shadow: require('../assets/sound/shadow_spell_shorten.mp3'),
  victory: require('../assets/sound/Victory.mp3'),
  defeat: require('../assets/sound/defeate.mp3'),
};

const VOLUME = { victory: 0.7, defeat: 0.7 }; // the rest play at 0.85

let enabled = true;
let modeSet = false;
const players = {};

// The Sound effects setting
export function setSoundEffects(on) {
  enabled = on !== false;
}

function playerFor(name) {
  if (players[name]) return players[name];
  const volume = VOLUME[name] ?? 0.85;
  if (Platform.OS === 'web') {
    const audio = new Audio(webUri(SOUNDS[name]));
    audio.volume = volume;
    players[name] = {
      play: () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      },
    };
  } else {
    if (!modeSet) {
      modeSet = true;
      setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
    }
    const player = createAudioPlayer(SOUNDS[name]);
    player.volume = volume;
    players[name] = {
      play: () => {
        player.seekTo(0).catch?.(() => {});
        player.play();
      },
    };
  }
  return players[name];
}

// Plays a sound by name (see SOUNDS). `delay` waits that many ms first.
// Never throws: a missing sound is never worth stopping the game for.
export function playSfx(name, delay = 0) {
  if (!enabled || !SOUNDS[name]) return;
  const go = () => {
    if (!enabled) return;
    try {
      playerFor(name).play();
    } catch {
      // ignore
    }
  };
  if (delay > 0) setTimeout(go, delay);
  else go();
}

// The sound for a spell, from its first element ('fire', 'ice', ...).
// Healing and support spells use the light sound.
export function spellSound(spell) {
  const element = spell?.hits?.[0]?.element;
  return SOUNDS[element] ? element : 'light';
}
