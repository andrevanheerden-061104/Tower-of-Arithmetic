import { useEffect } from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import styles from './SplashScreen.styles';

// Keeping your existing path since the video is loading with it
const splashVideo = require('../../../assets/vidoes/splashScreen.mp4');

export default function SplashScreen() {
  const player = useVideoPlayer(splashVideo, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  // Hide the Android navigation bar so the video reaches the very bottom
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
    }
  }, []);

  useEffect(() => {
    const sub = player.addListener('statusChange', ({ status, error }) => {
      if (status === 'error') console.log('Video error:', error);
    });
    return () => sub.remove();
  }, [player]);

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        surfaceType="textureView"
      />
    </View>
  );
}