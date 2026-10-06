import { StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

// Cut so the last frame flows into the first, so the loop has no visible jump.
const splashVideo = require('../../../assets/vidoes/splashScreen_seamless.mp4');

// The moving tower background, only used on the splash screen
// (every other screen keeps the still ScreenBackground image).
// Plays silently on a loop and fills the screen, trimming any edges that stick out.
export default function SplashVideo() {
  const player = useVideoPlayer(splashVideo, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
      pointerEvents="none"
    />
  );
}
