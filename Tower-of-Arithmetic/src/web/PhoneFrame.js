import { createElement, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// ---------------------------------------------------------------------------
// Desktop preview (web only)
//
// On a computer, the website shows a phone on a black background with the
// game running inside it. The game runs in an <iframe> that is exactly a
// phone screen (402 x 874, the Figma frame), so every screen lays out just
// like it does on a real phone; the whole phone is then scaled to fit the
// browser window. On a phone or tablet the game opens full screen instead
// (see shouldShowPhoneFrame).
// ---------------------------------------------------------------------------

export const SCREEN = { width: 402, height: 874 };
const BEZEL = 14; // the black edge around the screen
const PHONE = { width: SCREEN.width + BEZEL * 2, height: SCREEN.height + BEZEL * 2 };
const CAPTION = 56; // room under the phone for the caption
const MARGIN = 24;

// The page inside the frame has ?phone=1 so it knows not to frame itself
const INSIDE = 'phone';

export function shouldShowPhoneFrame() {
  if (typeof window === 'undefined') return false;
  if (window.self !== window.top) return false; // already inside a frame
  if (new URLSearchParams(window.location.search).has(INSIDE)) return false;
  const touch = window.matchMedia?.('(pointer: coarse)').matches;
  return !touch && window.innerWidth >= 700;
}

function screenUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set(INSIDE, '1');
  return url.toString();
}

// How much to shrink (or grow) the phone so it fits the window
function fitScale() {
  const byHeight = (window.innerHeight - MARGIN * 2 - CAPTION) / PHONE.height;
  const byWidth = (window.innerWidth - MARGIN * 2) / PHONE.width;
  return Math.max(0.4, Math.min(byHeight, byWidth, 1.15));
}

export default function PhoneFrame() {
  const [scale, setScale] = useState(fitScale);
  const [src] = useState(screenUrl);

  useEffect(() => {
    const resize = () => setScale(fitScale());
    window.addEventListener('resize', resize);
    document.title = 'Tower of Arithmetic';
    document.body.style.backgroundColor = '#000';
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.glow} pointerEvents="none" />

      {/* A box the size of the scaled phone, so it centres correctly */}
      <View style={{ width: PHONE.width * scale, height: PHONE.height * scale }}>
        <View style={[styles.phone, { transform: [{ scale }] }]}>
          {/* side buttons */}
          <View style={[styles.button, { left: -4, top: 170, height: 34 }]} />
          <View style={[styles.button, { left: -4, top: 230, height: 64 }]} />
          <View style={[styles.button, { left: -4, top: 306, height: 64 }]} />
          <View style={[styles.button, { right: -4, top: 250, height: 96 }]} />

          <View style={styles.screen}>
            {createElement('iframe', {
              src,
              title: 'Tower of Arithmetic',
              // the game uses the microphone (Speak answers) and plays sound
              allow: 'microphone; autoplay; fullscreen',
              style: { width: SCREEN.width, height: SCREEN.height, border: 0, display: 'block', backgroundColor: '#0D0D0D' },
            })}
            {/* front camera */}
            <View style={styles.camera} pointerEvents="none" />
          </View>
        </View>
      </View>

      <Text style={styles.caption}>
        <Text style={styles.title}>Tower of Arithmetic</Text>
        {'\n'}Click to tap · scroll to swipe · best played on a phone
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  // a faint purple light behind the phone, in the game's colours
  glow: {
    position: 'absolute',
    width: 760,
    height: 760,
    borderRadius: 380,
    backgroundColor: '#4C33A6',
    opacity: 0.16,
    filter: 'blur(120px)',
  },
  phone: {
    width: PHONE.width,
    height: PHONE.height,
    padding: BEZEL,
    borderRadius: 64,
    backgroundColor: '#0A0A0C',
    borderWidth: 2,
    borderColor: '#3A3A44',
    transformOrigin: 'top left',
    boxShadow: '0 0 0 1px #15151a, 0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(112,70,140,0.25)',
  },
  screen: {
    width: SCREEN.width,
    height: SCREEN.height,
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#0D0D0D',
  },
  camera: {
    position: 'absolute',
    top: 12,
    left: SCREEN.width / 2 - 7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#050505',
    borderWidth: 2,
    borderColor: '#1c1c22',
  },
  button: { position: 'absolute', width: 4, borderRadius: 2, backgroundColor: '#2A2A32' },
  caption: {
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat, system-ui, -apple-system, Segoe UI, sans-serif',
    fontSize: 13,
    lineHeight: 20,
    color: '#8C82A3',
  },
  title: { fontWeight: '700', fontSize: 15, color: '#F2EA79', letterSpacing: 0.5 },
});
