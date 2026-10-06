import { useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
// Each weight is imported from its own folder so only these four font files
// are bundled (importing from the package root would pull in all 18).
import { Montserrat_400Regular } from '@expo-google-fonts/montserrat/400Regular';
import { Montserrat_500Medium } from '@expo-google-fonts/montserrat/500Medium';
import { Montserrat_600SemiBold } from '@expo-google-fonts/montserrat/600SemiBold';
import { Montserrat_700Bold } from '@expo-google-fonts/montserrat/700Bold';
import Home from './src/screens/home/Home';
import Login from './src/screens/login/Login';
import Onboarding from './src/screens/onboarding/Onboarding';
import Signup from './src/screens/signup/Signup';
import Splash from './src/screens/splash/Splash';
import { colors } from './src/theme/theme';

// Every screen in the app, by name. To add one: build it in src/screens,
// import it above and add it to this list.
const SCREENS = {
  splash: Splash,
  signup: Signup,
  login: Login,
  onboarding: Onboarding,
  home: Home,
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  // Simple navigation: remember which screen is showing.
  // Screens call navigate('home') etc. to move on.
  const [screen, setScreen] = useState('splash');

  // Front end only for now: the chosen grade is kept in memory
  // and is lost when the app closes.
  const [grade, setGrade] = useState(null);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  const Screen = SCREENS[screen] ?? Splash;

  return <Screen navigate={setScreen} grade={grade} onGradeChosen={setGrade} />;
}
