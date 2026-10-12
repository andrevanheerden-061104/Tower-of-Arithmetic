import { useEffect, useRef, useState } from 'react';
import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import { holdMusic } from '../audio/music';
import { readSpokenAnswer } from '../services/ai';

const MAX_SECONDS = 12; // a step of working never takes longer to say

// "Speak" on the answer keypad: record the player saying their step, send
// it to the server (speech to text), and get it back as keypad maths.
//   status   'idle' | 'listening' | 'reading' | 'done' | 'error'
//   seconds  how long they have been talking
//   result   { heard, maths } once read
//   error    what went wrong, in plain words
//   start() / stop() / reset()
export function useVoiceAnswer() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recording = useAudioRecorderState(recorder, 250);
  const [status, setStatus] = useState('idle');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const timer = useRef(null);
  const alive = useRef(true);

  const finishRecording = async () => {
    clearTimeout(timer.current);
    try {
      await recorder.stop();
    } catch {
      // already stopped
    }
    await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true }).catch(() => {});
    holdMusic(false);
  };

  const fail = (message) => {
    if (!alive.current) return;
    setError(message);
    setStatus('error');
  };

  const start = async () => {
    setError(null);
    setResult(null);
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) return fail('Orrin can’t hear you yet. Allow the microphone for Tower of Arithmetic in your phone’s settings.');
      holdMusic(true);
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
      setStatus('listening');
      timer.current = setTimeout(() => stop(), MAX_SECONDS * 1000);
    } catch {
      await finishRecording();
      fail('The microphone didn’t start. Try again.');
    }
  };

  const stop = async () => {
    if (!recorder.isRecording && status !== 'listening') return;
    setStatus('reading');
    await finishRecording();
    const uri = recorder.uri;
    if (!uri) return fail('Nothing was recorded. Try again.');
    try {
      const reply = await readSpokenAnswer(uri);
      if (!alive.current) return;
      setResult(reply);
      setStatus('done');
    } catch (e) {
      fail(e.message || 'Orrin couldn’t hear that. Try again.');
    }
  };

  const reset = () => {
    setStatus('idle');
    setResult(null);
    setError(null);
  };

  // Leaving the screen while talking: stop the microphone
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      clearTimeout(timer.current);
      if (recorder.isRecording) finishRecording();
    };
    // Runs once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { status, seconds: Math.floor((recording.durationMillis ?? 0) / 1000), maxSeconds: MAX_SECONDS, result, error, start, stop, reset };
}
