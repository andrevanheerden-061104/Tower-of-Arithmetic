import { ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import CoinIcon from '../../../components/run/CoinIcon';
import TutorialTarget from '../../../components/tutorial/TutorialTarget';
import FloorProgress from '../../../components/run/FloorProgress';
import { POTIONS } from '../../../game/encounters';
import { currentRoom, runVersion } from '../../../game/run';
import { MAX_CLIMBS, climbOf, towerTop } from '../../../game/tower';
import RewardRow from './components/RewardRow';
import RewardsBanner from './components/RewardsBanner';
import StarRow from './components/StarRow';
import VictoryHero from './components/VictoryHero';
import styles from './FloorReward.styles';

// After winning a fight, solving a puzzle or beating the boss: what the
// player earned, and how far up the tower they are. After a boss (when
// there's a climb left) the player chooses: climb the next floors, where
// the enemies are tougher, or leave the tower with what they've won.
export default function FloorReward({ navigate, run, character, onClimbOn, onLeaveTower }) {
  const version = runVersion(run);
  const reward = run.reward;
  if (!reward) return null;

  const junior = version.id === 'junior';
  const total = towerTop(run);
  const climb = climbOf(run);
  const { solved, errors, hints } = run.stats;
  const next = reward.towerCleared ? 'runStats' : 'pathMap';
  // A spell card has to be picked before moving on
  const mustPick = reward.spellChoice && !reward.spellTaken;
  const continueLabel = reward.towerCleared ? 'See run stats' : junior ? 'Next floor' : 'Continue';

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
            {reward.climbOn ? 'Boss defeated' : reward.towerCleared ? 'Tower cleared' : 'Victory'}
          </Text>
          <Text style={styles.subtitle}>
            {reward.towerCleared ? `${total} FLOORS CLIMBED` : `FLOOR ${reward.floor} CLEARED`}
          </Text>
          {junior && <StarRow stars={errors === 0 ? 3 : errors < 3 ? 2 : 1} />}
        </View>

        <FloorProgress total={run.map.floors} current={currentRoom(run).floor} label={junior ? `Floor ${reward.floor} of ${total}` : `You are on floor ${reward.floor} of ${total}`} />

        <RewardsBanner />

        <View style={styles.list}>
          <RewardRow icon="star" title={`+${reward.xp} XP`} detail="Collected" done />
          {reward.coins > 0 && <RewardRow icon="coin" title={`+${reward.coins} coins`} detail="Collected" done />}
          {reward.potion && <RewardRow icon={reward.potion} title={`${POTIONS[reward.potion].name} ×1`} detail="Collected" done />}
          {reward.spellChoice && (
            <TutorialTarget id="spellReward">
              <RewardRow
                icon="card"
                title={reward.spellTaken ? 'New spell added' : reward.legendary ? 'Legendary spell!' : junior ? 'New spell!' : 'Spell +1'}
                detail={
                  reward.spellTaken
                    ? reward.spellPlace === 'stash'
                      ? 'In your stash'
                      : 'In your deck'
                    : reward.legendary
                      ? 'The boss dropped a legendary card. Tap to choose'
                      : 'Tap to choose 1 of 3 spells'
                }
                done={reward.spellTaken}
                highlight={!reward.spellTaken}
                onPress={reward.spellTaken ? undefined : () => navigate('chooseSpell')}
              />
            </TutorialTarget>
          )}
        </View>

        <Text style={styles.summary}>
          {junior ? `You solved ${solved} ${solved === 1 ? 'sum' : 'sums'}!` : `${solved} / ${solved + errors} correct  ·  ${hints} ${hints === 1 ? 'hint' : 'hints'} used`}
        </Text>

        {reward.climbOn ? (
          <View style={styles.list}>
            <Text style={styles.summary}>
              {junior
                ? `You beat the boss! Climb ${run.map.floors} more floors? The monsters are stronger up there.`
                : `The stairs go on. Climb floors ${total + 1}–${total + run.map.floors}, where the enemies are tougher and the rewards bigger (climb ${climb + 1} of ${MAX_CLIMBS}), or leave the tower now.`}
            </Text>
            <PrimaryButton
              label={mustPick ? 'Choose a spell first' : junior ? 'Keep climbing!' : `Climb to floor ${total + run.map.floors}`}
              disabled={mustPick}
              onPress={onClimbOn}
            />
            <PrimaryButton label="Leave the tower" variant="secondary" onPress={onLeaveTower} />
          </View>
        ) : (
          <PrimaryButton
            label={mustPick ? 'Choose a spell first' : continueLabel}
            disabled={mustPick}
            onPress={() => navigate(next)}
          />
        )}
      </ScrollView>
    </View>
  );
}
