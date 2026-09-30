import { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Easing, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView, BlurTargetView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path, Circle } from 'react-native-svg';
import { useFonts, Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import styles from './SplashScreen.styles';

// Keeping your existing path since the video is loading with it
const splashVideo = require('../../../assets/vidoes/splashScreen_seamless.mp4');

const BUTTON_LABEL = 'Start Game';
const SHOW_DELAY = 2000; // ms before the button appears

// Shape measured from Rectangle_3.png (322 x 68, chamfered top-left corner)
const BUTTON_PATH =
  'M31 0 H304 A18 18 0 0 1 322 18 V50 A18 18 0 0 1 304 68 H18 A18 18 0 0 1 0 50 V32 Q0 28 2 25 L22 4 Q26 0 31 0 Z';

// Glass look
const BUTTON_FILL_OPACITY = 0.2; // 0.2 = 80% transparent (1 = solid)
const BLUR_INTENSITY = 40;       // how strongly the video behind is blurred

// Swirling aura border
const PERIMETER = 736; // approx. length of BUTTON_PATH
const AURA_PAD = 24;   // extra room around the button for the glow
const AURA_COMETS = [
  { color: '#2EF2F2', length: 150, duration: 5200, phase: 0 },    // cyan
  { color: '#B455FF', length: 200, duration: 6800, phase: 0.33 }, // purple
  { color: '#4DFFA8', length: 110, duration: 4300, phase: 0.66 }, // green
];
// Each streak is drawn 4 times, wide and faint to thin and bright, to fake a glow
const AURA_LAYERS = [
  { width: 14, opacity: 0.1 },
  { width: 8, opacity: 0.2 },
  { width: 4, opacity: 0.45 },
  { width: 1.8, opacity: 1 },
];

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function SplashScreen() {
  const [fontsLoaded] = useFonts({ Montserrat_700Bold });

  const player = useVideoPlayer(splashVideo, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
  });

  const blurTargetRef = useRef(null);
  const buttonOpacity = useRef(new Animated.Value(0)).current;
  const auraOffsets = useRef(
    AURA_COMETS.map((c) => new Animated.Value(-PERIMETER * c.phase))
  ).current;

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

  // Fade the button in after 2 seconds
  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(SHOW_DELAY),
      Animated.timing(buttonOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [buttonOpacity]);

  // Swirl: each colored streak travels around the border at its own speed
  useEffect(() => {
    const loops = AURA_COMETS.map((c, i) => {
      const start = -PERIMETER * c.phase;
      auraOffsets[i].setValue(start);
      return Animated.loop(
        Animated.timing(auraOffsets[i], {
          toValue: start - PERIMETER,
          duration: c.duration,
          easing: Easing.linear,
          useNativeDriver: false, // SVG props can't use the native driver
        })
      );
    });
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [auraOffsets]);

  const handleStart = () => {
    console.log('Start pressed'); // does nothing for now
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* The video sits inside BlurTargetView so Android can blur it */}
      <BlurTargetView ref={blurTargetRef} style={styles.video}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen={false}
          allowsPictureInPicture={false}
          surfaceType="textureView"
        />
      </BlurTargetView>

      {fontsLoaded && (
        <Animated.View style={[styles.buttonWrap, { opacity: buttonOpacity }]}>
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            {/* 1. Blurred video, cut to the button shape */}
            <MaskedView
              style={styles.fill}
              maskElement={
                <View style={styles.maskContainer}>
                  <Svg width="100%" height="100%" viewBox="0 0 322 68">
                    <Path d={BUTTON_PATH} fill="#000" />
                  </Svg>
                </View>
              }
            >
              <BlurView
                blurTarget={blurTargetRef}
                blurMethod="dimezisBlurView"
                intensity={BLUR_INTENSITY}
                tint="dark"
                style={styles.fill}
              />
            </MaskedView>

            {/* 2. See-through dark tint + 3 dots */}
            <Svg width="100%" height="100%" viewBox="0 0 322 68" style={styles.fill}>
              <Path d={BUTTON_PATH} fill="#0D0D0D" fillOpacity={BUTTON_FILL_OPACITY} />
              <Circle cx="297.5" cy="15.5" r="2" fill="rgba(255,255,255,0.35)" />
              <Circle cx="306.5" cy="15.5" r="2" fill="rgba(255,255,255,0.35)" />
              <Circle cx="306.5" cy="27.5" r="2" fill="rgba(255,255,255,0.35)" />
            </Svg>

            {/* 3. Swirling aura border */}
            <Svg
              pointerEvents="none"
              style={styles.aura}
              viewBox={`${-AURA_PAD} ${-AURA_PAD} ${322 + AURA_PAD * 2} ${68 + AURA_PAD * 2}`}
            >
              <Path
                d={BUTTON_PATH}
                fill="none"
                stroke="rgba(255,255,255,0.18)"
                strokeWidth={1}
              />
              {AURA_COMETS.map((c, i) =>
                AURA_LAYERS.map((layer) => (
                  <AnimatedPath
                    key={`${i}-${layer.width}`}
                    d={BUTTON_PATH}
                    fill="none"
                    stroke={c.color}
                    strokeOpacity={layer.opacity}
                    strokeWidth={layer.width}
                    strokeLinecap="round"
                    strokeDasharray={`${c.length} ${PERIMETER - c.length}`}
                    strokeDashoffset={auraOffsets[i]}
                  />
                ))
              )}
            </Svg>

            <Text style={styles.buttonText}>{BUTTON_LABEL}</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}