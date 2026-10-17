import { useEffect } from 'react';
import { readAloudOn, speak, stopSpeaking } from '../audio/speech';

// With the Read aloud setting on, reads `text` out when it first appears
// (and again whenever it changes). Stops talking when the screen closes.
export function useReadAloud(text, { slow = false, delay = 400 } = {}) {
  useEffect(() => {
    if (!text || !readAloudOn()) return undefined;
    const timer = setTimeout(() => speak(text, { slow }), delay);
    return () => {
      clearTimeout(timer);
      stopSpeaking();
    };
  }, [text, slow, delay]);

  // Whatever started the talking, stop when the screen goes away
  useEffect(() => stopSpeaking, []);
}
