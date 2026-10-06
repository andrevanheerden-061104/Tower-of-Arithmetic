import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import { CHARACTERS } from '../../data/characters';
import CharacterHero from './components/CharacterHero';
import CharacterInfo from './components/CharacterInfo';
import CharacterRoster from './components/CharacterRoster';
import LockedPanel from './components/LockedPanel';
import StartingSpell from './components/StartingSpell';
import styles from './Characters.styles';

// Browse the characters and choose which one to play.
// `character` is the one currently chosen (kept in App.js).
export default function Characters({ navigate, character, onCharacterChosen }) {
  // Which character is on screen right now (not chosen until confirmed)
  const [index, setIndex] = useState(() =>
    Math.max(0, CHARACTERS.findIndex((c) => c.id === character.id))
  );
  const viewing = CHARACTERS[index];
  const isChosen = viewing.id === character.id;

  // Step left / right, wrapping round at the ends
  const step = (by) => setIndex((i) => (i + by + CHARACTERS.length) % CHARACTERS.length);

  const confirm = () => {
    onCharacterChosen(viewing.id);
    navigate('home');
  };

  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.18} />
      <Shade stops={[[0, 0.6], [0.5, 0.9], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.top}>
          <ScreenHeader title="Characters" onBack={() => navigate('home')} />

          <CharacterHero
            character={viewing}
            index={index}
            total={CHARACTERS.length}
            onPrevious={() => step(-1)}
            onNext={() => step(1)}
          />

          <CharacterInfo character={viewing} chosen={isChosen} />

          <CharacterRoster characters={CHARACTERS} index={index} onSelect={setIndex} />
        </View>

        <View style={styles.panel}>
          {viewing.locked ? <LockedPanel hint={viewing.unlockHint} /> : <StartingSpell spell={viewing.spell} />}

          <PrimaryButton
            label={viewing.locked ? 'Locked' : isChosen ? 'Selected' : 'Confirm character'}
            onPress={confirm}
            disabled={viewing.locked || isChosen}
          />
        </View>
      </ScrollView>
    </View>
  );
}
