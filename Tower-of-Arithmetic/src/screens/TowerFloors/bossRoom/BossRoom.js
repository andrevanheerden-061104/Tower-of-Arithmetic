import Combat from '../combat/Combat';
import { ENEMIES } from '../../../game/encounters';
import BossTitle from './components/BossTitle';

// The boss fight on the top floor. It's the normal fight screen with the
// boss door background, the boss (bigger, with more hearts) and a title.
export default function BossRoom(props) {
  const boss = ENEMIES.morvath;
  return (
    <Combat
      {...props}
      background="bossDoor"
      banner={<BossTitle floor={props.run.map.floors} name={boss.name} title={boss.title} />}
    />
  );
}
