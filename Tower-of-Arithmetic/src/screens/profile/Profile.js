import { ScrollView, View } from 'react-native';
import PrimaryButton from '../../components/PrimaryButton';
import ScreenHeader from '../../components/ScreenHeader';
import Shade from '../../components/Shade';
import ScreenBackground from '../../components/ScreenBackground';
import { usePlayerCard } from '../../hooks/usePlayerCard';
import BadgeRow from './components/BadgeRow';
import LevelBar from './components/LevelBar';
import ProfileIdentity from './components/ProfileIdentity';
import StatTiles from './components/StatTiles';
import StrengthsHex from './components/StrengthsHex';
import styles from './Profile.styles';

// The player's profile: level, a few stats, strengths by maths type
// (accuracy per topic) and badges. Numbers come from the saved profile and
// topic totals; badges unlock at milestones (src/data/badges.js). The
// Account button opens the account options (src/screens/account).
export default function Profile({ navigate, character, grade, settings }) {
  const player = usePlayerCard(settings, grade);
  return (
    <View style={styles.screen}>
      <ScreenBackground opacity={0.35} />
      <Shade stops={[[0, 0.7], [0.25, 0.8], [0.42, 1], [1, 1]]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Profile" onBack={() => navigate('home')} />
        <ProfileIdentity player={player} character={character} grade={grade} />
        <LevelBar level={player.level} xp={player.xp} xpToNext={player.xpToNext} />
        <StatTiles
          highestFloor={player.highestFloor}
          runsCompleted={player.runsCompleted}
          accuracy={player.accuracy}
        />
        <StrengthsHex strengths={player.strengths} />
        <BadgeRow badges={player.badges} total={player.badgesTotal} />
        {/* Username, password, log out and delete account */}
        <PrimaryButton label={player.guest ? 'Make an account' : 'Account'} variant="secondary" onPress={() => navigate('account')} />
      </ScrollView>
    </View>
  );
}
