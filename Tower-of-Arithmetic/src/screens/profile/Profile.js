import { ScrollView, View } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import { PLAYER } from '../../data/player';
import BadgeRow from './components/BadgeRow';
import LevelBar from './components/LevelBar';
import ProfileIdentity from './components/ProfileIdentity';
import StatTiles from './components/StatTiles';
import StrengthsHex from './components/StrengthsHex';
import styles from './Profile.styles';

// The player's profile: level, a few stats, strengths by maths type
// and badges. All numbers are placeholders from src/data/player.js.
export default function Profile({ navigate, character, grade }) {
  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.35} />
      <Shade stops={[[0, 0.7], [0.25, 0.8], [0.42, 1], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Profile" onBack={() => navigate('home')} />
        <ProfileIdentity player={PLAYER} character={character} grade={grade} />
        <LevelBar level={PLAYER.level} xp={PLAYER.xp} xpToNext={PLAYER.xpToNext} />
        <StatTiles
          highestFloor={PLAYER.highestFloor}
          runsCompleted={PLAYER.runsCompleted}
          accuracy={PLAYER.accuracy}
        />
        <StrengthsHex strengths={PLAYER.strengths} />
        <BadgeRow badges={PLAYER.badges} total={PLAYER.badgesTotal} />
      </ScrollView>
    </View>
  );
}
