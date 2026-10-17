import { Platform } from 'react-native';
import App from '../../App';
import PhoneFrame, { shouldShowPhoneFrame } from './PhoneFrame';

// The app's starting point (index.js). On a computer's web browser it
// shows the game inside a phone (PhoneFrame); everywhere else, the game.
const framed = Platform.OS === 'web' && shouldShowPhoneFrame();

// Browser fixes, so the website looks like the phone app:
//  - dragging the mouse doesn't highlight the game's text (the text boxes
//    still let you select what you type)
//  - text boxes get no blue focus outline
//  - when the browser autofills a saved email or password, it paints the
//    box white (-webkit-autofill). Keep the box dark with white text, like
//    the phone. (The long transition stops the browser's colour showing.)
const WEB_CSS = `
* { user-select: none; -webkit-user-select: none; }
input, textarea { user-select: text; -webkit-user-select: text; outline: none; }
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
textarea:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #17141F inset !important;
  box-shadow: 0 0 0 1000px #17141F inset !important;
  -webkit-text-fill-color: #FDFAF5 !important;
  caret-color: #FDFAF5;
  font-family: Montserrat_400Regular, Montserrat, sans-serif !important;
  transition: background-color 9999s ease-out 0s;
}
input:autofill { background-color: #17141F !important; color: #FDFAF5 !important; }
`;
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = WEB_CSS;
  document.head.appendChild(style);
}

export default function Root() {
  return framed ? <PhoneFrame /> : <App />;
}
