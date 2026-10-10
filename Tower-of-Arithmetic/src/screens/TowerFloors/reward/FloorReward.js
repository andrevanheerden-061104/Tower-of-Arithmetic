import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import CoinIcon from '../../../components/run/CoinIcon';
import FloorProgress from '../../../components/run/FloorProgress';
import { POTIONS } from '../../../game/encounters';
import { runVersion } from '../../../game/run';
import RewardRow from './components/RewardRow';
import RewardsBanner from './components/RewardsBanner';
import StarRow from './components/StarRow';
import VictoryHero from './components/VictoryHero';
import styles from './FloorReward.styles';

// After winning a fight, solving a puzzle or beating the boss: what the
// player earned, and how far up the tower they are.
export default function FloorReward({ navigate, run, character }) {
  const version = runVersion(run);
  const reward = run.reward;
  if (!reward) return null;

  const junior = version.id === 'junior';
  const total = run.map.floors;
  const { solved, errors, hints } = run.stats;
  const next = reward.towerCleared ? 'runStats' : 'pathMap';

  return (
    <View style={styles.screen}>
      <VictoryHero character={character} cleared={reward.towerCleared} />

      {version.usesCoins && (
        <View style={styles.coins} accessible accessibilityLabel={`${run.coins} coins`}>
          <CoinIcon size={20} />
          <Text style={styles.coinsText}>{run.coins}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titles}>
          <Text style={styles.title} accessibilityRole="header">
            {reward.towerCleared ? 'Tower cleared' : 'Victory'}
          </Text>
          <Text style={styles.subtitle}>
            {reward.towerCleared ? `${total} FLOORS CLIMBED` : `FLOOR ${reward.floor} CLEARED`}
          </Text>
          {junior && <StarRow stars={errors === 0 ? 3 : errors < 3 ? 2 : 1} />}
        </View>

        <FloorProgress total={total} current={reward.floor} label={junior ? `Floor ${reward.floor} of ${total}` : `You are on floor ${reward.floor} of ${total}`} />

        <RewardsBanner />

        <View style={styles.list}>
          <RewardRow icon="star" title={`+${reward.xp} XP`} detail="Collected" done />
          {reward.coins > 0 && <RewardRow icon="coin" title={`+${reward.coins} coins`} detail="Collected" done />}
          {reward.potion && <RewardRow icon="potion" potionColor={POTIONS[reward.potion].color} title={`${POTIONS[reward.potion].name} ×1`} detail="Collected" done />}
          {reward.spellChoice && (
            <RewardRow
              icon="card"
              title={reward.spellTaken ? 'New spell added' : junior ? 'New spell!' : 'Spell +1'}
              detail={reward.spellTaken ? 'In your deck' : 'Tap to choose 1 of 3 spells'}
              done={reward.spellTaken}
              highlight={!reward.spellTaken}
              onPress={reward.spellTaken ? undefined : () => navigate('chooseSpell')}
            />
          )}
        </View>

        <Text style={styles.summary}>
          {junior ? `You solved ${solved} ${solved === 1 ? 'sum' : 'sums'}!` : `${solved} / ${solved + errors} correct  ·  ${hints} ${hints === 1 ? 'hint' : 'hints'} used`}
        </Text>

        <PrimaryButton label={reward.towerCleared ? 'See run stats' : junior ? 'Next floor' : 'Continue'} onPress={() => navigate(next)} />
      </ScrollView>
    </View>
  );
}
