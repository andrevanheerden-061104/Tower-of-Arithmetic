// Shared colours, fonts and spacing for every screen.
// Change a value here and it updates across the whole app.

export const colors = {
  bg: '#0D0D0D',        // Obsidian void (background)
  indigo: '#4C33A6',    // Mystic violet (selected / primary fills)
  violet: '#70468C',    // Astral indigo (glows)
  gold: '#F2EA79',      // Arcane gold (accents, borders)
  pink: '#F2D3D0',      // Parchment pink (secondary text)
  white: '#FDFAF5',     // Main text
  panel: '#17141F',     // Cards and inputs
  line: '#3A2F4A',      // Subtle borders
  border: '#8C82A3',    // Stronger borders (meets contrast for controls)
  mute: '#B5AEC2',      // Muted text (still AAA on the dark background)
};

// Montserrat is loaded once in App.js.
// To use Cinzel for titles like the Figma file:
//   1. run: npx expo install @expo-google-fonts/cinzel
//   2. load Cinzel_700Bold in App.js
//   3. change `display` below to 'Cinzel_700Bold'
export const fonts = {
  regular: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  display: 'Montserrat_700Bold',
};

export const spacing = {
  gutter: 32,     // left / right screen padding
  top: 56,        // space under the status bar
  bottom: 36,
  contentWidth: 338,
};

// Smallest tap target used anywhere (WCAG AAA asks for 44 x 44).
export const MIN_TOUCH = 44;
