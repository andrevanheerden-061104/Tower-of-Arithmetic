import { createElement } from 'react';
import { webUri } from '../../../audio/music';

const splashVideo = require('../../../assets/vidoes/splashScreen_seamless.mp4');

// The splash video on the web. expo-video's player draws the video at its
// own size (720 x 1280) in a browser, so only its top-left corner showed.
// A plain <video> with object-fit: cover fills the phone screen like it
// does on phones, trimming the edges that stick out, centred on the tower.
export default function SplashVideoWeb() {
  return createElement('video', {
    src: webUri(splashVideo),
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    'aria-hidden': true,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
      pointerEvents: 'none',
    },
  });
}
