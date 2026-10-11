import { Platform } from 'react-native';
import { createVideoPlayer } from 'expo-video';
import { duckMusic, webUri } from './music';

// ---------------------------------------------------------------------------
// Voice lines (e.g. Orrin in the tutorial)
//
// One line plays at a time; starting a new one stops the last. While a line
// plays the music is turned down. `onTime(seconds)` is called about 12 times
// a second with how far the line has got (used to highlight the word being
// spoken) and `onEnd()` when it finishes on its own.
//
// Phones: expo-video's player (sound only), like the music. Web: <audio>.
// ---------------------------------------------------------------------------

const TICK = 80; // ms between position updates

let current = null; // { stop }

export function stopVoice() {
  current?.stop();
  current = null;
}

export function playVoice(source, { onTime, onEnd } = {}) {
  stopVoice();
  if (!source) return stopVoice;
  duckMusic(true);

  let timer = null;
  let finished = false;
  let release = () => {};

  // Clean up; `natural` is true when the line reached its end by itself.
  const finish = (natural) => {
    if (finished) return;
    finished = true;
    clearInterval(timer);
    release();
    duckMusic(false);
    if (natural) onEnd?.();
  };

  if (Platform.OS === 'web') {
    const audio = new Audio(webUri(source));
    audio.onended = () => finish(true);
    audio.play().catch(() => finish(true)); // the browser blocked it
    timer = setInterval(() => onTime?.(audio.currentTime), TICK);
    release = () => {
      audio.onended = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    };
  } else {
    const player = createVideoPlayer(source);
    const ended = player.addListener('playToEnd', () => finish(true));
    player.play();
    timer = setInterval(() => onTime?.(player.currentTime), TICK);
    release = () => {
      ended.remove();
      player.release();
    };
  }

  const stop = () => finish(false);
  current = { stop };
  return stop;
}
