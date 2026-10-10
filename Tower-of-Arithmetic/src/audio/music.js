import { Platform } from 'react-native';
import { createVideoPlayer } from 'expo-video';

// ---------------------------------------------------------------------------
// Background music
//
// One track plays at a time and loops. The same track keeps playing while
// the player moves between screens that use it; when the screen needs a
// different track, the old one stops and the new one starts from the
// beginning. App.js decides which track each screen uses.
//
// All three tracks are by Kevin MacLeod (incompetech.com), licensed under
// Creative Commons: By Attribution 4.0 (credited in Settings). These are
// 128 kbps copies of the originals in assets/music, to keep the app small.
//
// Phones: played with expo-video's player (no video picture, just sound),
// because expo-audio isn't installed yet. Web: a plain HTML <audio>.
// ---------------------------------------------------------------------------

export const TRACKS = {
  menu: require('../assets/music/bg-magic-forest.mp3'), // Magic Forest
  battle: require('../assets/music/bg-future-gladiator.mp3'), // Future Gladiator
  tower: require('../assets/music/bg-thunderbird.mp3'), // Thunderbird
};

const VOLUME = 0.3; // soft, so it stays in the background

let current = null; // { name, play, pause, release }

function webUri(source) {
  if (typeof source === 'string') return source;
  return source?.uri ?? source?.default ?? '';
}

function makePlayer(source) {
  if (Platform.OS === 'web') {
    const audio = new Audio(webUri(source));
    audio.loop = true;
    audio.volume = VOLUME;
    let waiting = null;
    const play = () => {
      audio.play().catch(() => {
        // Browsers block sound until the user taps the page once
        if (waiting || typeof document === 'undefined') return;
        waiting = () => {
          document.removeEventListener('pointerdown', waiting);
          waiting = null;
          audio.play().catch(() => {});
        };
        document.addEventListener('pointerdown', waiting);
      });
    };
    return {
      play,
      pause: () => audio.pause(),
      release: () => {
        if (waiting) document.removeEventListener('pointerdown', waiting);
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      },
    };
  }

  const player = createVideoPlayer(source);
  player.loop = true;
  player.volume = VOLUME;
  return {
    play: () => player.play(),
    pause: () => player.pause(),
    release: () => player.release(),
  };
}

// Play the named track (or keep playing it if it's already on).
// `enabled` is the Music setting: off pauses the music.
export function setMusic(name, enabled) {
  if (!name) return;
  if (current?.name !== name) {
    current?.release();
    current = { name, ...makePlayer(TRACKS[name]) };
  }
  if (enabled) current.play();
  else current.pause();
}
