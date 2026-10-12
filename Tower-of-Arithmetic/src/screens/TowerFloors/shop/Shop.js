import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import TutorialTarget from '../../../components/tutorial/TutorialTarget';
import { BACKGROUNDS } from '../../../components/run/RunBackground';
import { shopWares } from '../../../game/encounters';
import { collectedSpells, currentRoom } from '../../../game/run';
import WareGrid from './components/WareGrid';
import styles from './Shop.styles';

const TRADER = require('../../../assets/npc/trader-shop.png');
const BG_ASPECT = 1103 / 960; // the shop picture (width / height)
const COUNTER_TOP = 0.885; // where the wooden counter starts in the picture

// The wandering trader (intermediate and senior). Tap a ware, then buy it
// with gold. Each visit has 2 spell cards, 2 potions and 2 items the player
// doesn't own yet (prices in src/game/encounters.js).
export default function Shop({ navigate, run, onBuy, onLeave }) {
  // Picked once per shop room (the same if the player comes back)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const SHOP_WARES = useMemo(() => shopWares(run), [run.seed, run.currentId]);
  const [selectedId, setSelectedId] = useState(SHOP_WARES[0].id);
  const { width } = useWindowDimensions();
  const heroHeight = width / BG_ASPECT;
  const traderHeight = heroHeight * 0.965;
  const traderWidth = traderHeight * (1536 / 2636);
  const [bought, setBought] = useState([]);
  // Spell cards and items the player already has count as sold (no doubles)
  const owned = SHOP_WARES.filter((w) => (w.kind === 'spell' && collectedSpells(run).includes(w.spellId)) || (w.kind === 'item' && run.items.includes(w.itemId))).map((w) => w.id);
  const sold = [...bought, ...owned];
  const selected = SHOP_WARES.find((w) => w.id === selectedId);
  const canBuy = selected && !sold.includes(selected.id) && run.coins >= selected.price;

  const buy = () => {
    onBuy(selected);
    setBought((s) => [...s, selected.id]);
  };

  return (
    <View style={styles.screen}>
      {/* The shop picture, the trader standing in it, then the front of the
          counter drawn again on top so she stands behind it */}
      <View style={[styles.hero, { height: heroHeight }]}>
        <Image source={BACKGROUNDS.shop} style={styles.heroImage} resizeMode="cover" accessibilityLabel="The trader's shop" />
        <Image
          source={TRADER}
          style={[styles.trader, { top: heroHeight * 0.31, left: (width - traderWidth) / 2, height: traderHeight, width: traderWidth }]}
          resizeMode="contain"
          accessibilityLabel="The trader, behind her counter"
        />
        <View style={[styles.counter, { height: heroHeight * (1 - COUNTER_TOP) }]} pointerEvents="none">
          <Image source={BACKGROUNDS.shop} style={[styles.counterImage, { height: heroHeight }]} resizeMode="cover" />
        </View>
        <View style={styles.hud}>
          <RunHud run={run} navigate={navigate} floor={currentRoom(run).floor} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.panel} showsVerticalScrollIndicator={false}>
        <RunTitle>Wandering trader</RunTitle>
        <View style={styles.subRow}>
          <Text style={styles.sub}>Six wares today. Gold only.</Text>
          <Text style={styles.tap}>Tap to select</Text>
        </View>

        <TutorialTarget id="wares">
          <WareGrid wares={SHOP_WARES} coins={run.coins} sold={sold} selectedId={selectedId} onSelect={setSelectedId} />
        </TutorialTarget>

        <PrimaryButton
          label={
            !selected
              ? 'Choose a ware'
              : owned.includes(selected.id) && !bought.includes(selected.id)
                ? 'You have this already'
                : sold.includes(selected.id)
                  ? 'Sold'
                  : `Buy ${selected.name}`
          }
          disabled={!canBuy}
          onPress={buy}
        />
        <Pressable onPress={onLeave} accessibilityRole="button" style={styles.leave}>
          <Text style={styles.leaveText}>Leave shop</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
