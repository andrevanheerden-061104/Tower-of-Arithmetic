import { useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import Text from '../../../components/AppText';
import PrimaryButton from '../../../components/PrimaryButton';
import RunHud from '../../../components/run/RunHud';
import RunTitle from '../../../components/run/RunTitle';
import { BACKGROUNDS } from '../../../components/run/RunBackground';
import { SHOP_WARES } from '../../../game/encounters';
import { collectedSpells, currentRoom } from '../../../game/run';
import WareGrid from './components/WareGrid';
import styles from './Shop.styles';

// The wandering trader (intermediate and senior). Tap a ware, then buy it
// with gold. Placeholder prices in src/game/encounters.js.
export default function Shop({ navigate, run, onBuy, onLeave }) {
  const [selectedId, setSelectedId] = useState(SHOP_WARES[0].id);
  const [bought, setBought] = useState([]);
  // Spell cards the player already has count as sold (no doubles)
  const owned = SHOP_WARES.filter((w) => w.kind === 'spell' && collectedSpells(run).includes(w.spellId)).map((w) => w.id);
  const sold = [...bought, ...owned];
  const selected = SHOP_WARES.find((w) => w.id === selectedId);
  const canBuy = selected && !sold.includes(selected.id) && run.coins >= selected.price;

  const buy = () => {
    onBuy(selected);
    setBought((s) => [...s, selected.id]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.hero}>
        <Image source={BACKGROUNDS.shop} style={styles.heroImage} resizeMode="cover" accessibilityLabel="The trader's shop" />
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

        <WareGrid wares={SHOP_WARES} coins={run.coins} sold={sold} selectedId={selectedId} onSelect={setSelectedId} />

        <PrimaryButton
          label={
            !selected
              ? 'Choose a ware'
              : owned.includes(selected.id) && !bought.includes(selected.id)
                ? 'You have this card'
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
