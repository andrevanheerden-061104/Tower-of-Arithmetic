import { ScrollView, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import LinkRow from './components/LinkRow';
import SettingsGroup from './components/SettingsGroup';
import TextSizePicker from './components/TextSizePicker';
import ToggleRow from './components/ToggleRow';
import styles from './Settings.styles';

// Accessibility, sound and account settings. The choices are remembered
// in App.js while the app is open; they don't change the game yet.
export default function Settings({ navigate, settings, onSettingChange, grade }) {
  const toggle = (key) => (value) => onSettingChange(key, value);

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.25} />
      <Shade stops={[[0, 0.8], [0.3, 0.92], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Settings" onBack={() => navigate('home')} />

        <SettingsGroup title="Accessibility">
          <TextSizePicker value={settings.textSize} onChange={toggle('textSize')} />
          <ToggleRow
            label="Dyscalculia mode"
            hint="Bigger numbers, more space and visual helpers"
            value={settings.dyscalculiaMode}
            onChange={toggle('dyscalculiaMode')}
          />
          <ToggleRow
            label="Speech to text"
            hint="Say your answer out loud"
            value={settings.speechToText}
            onChange={toggle('speechToText')}
          />
          <ToggleRow
            label="Read aloud"
            hint="Questions are read to you"
            value={settings.readAloud}
            onChange={toggle('readAloud')}
          />
          <ToggleRow
            label="Reduce motion"
            hint="Fewer animations and flashes"
            value={settings.reduceMotion}
            onChange={toggle('reduceMotion')}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Sound">
          <ToggleRow label="Music" value={settings.music} onChange={toggle('music')} />
          <ToggleRow
            label="Sound effects"
            value={settings.soundEffects}
            onChange={toggle('soundEffects')}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Account">
          <LinkRow
            label="Grade"
            value={grade ? `Grade ${grade}` : 'Not set'}
            icon="chevronRight"
            accessibilityHint="Change your grade"
            onPress={() => navigate('onboarding')}
          />
          <LinkRow label="Log out" icon="logOut" onPress={() => navigate('login')} last />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
}
