import Combat from '../combat/Combat';
import { bossForRun } from '../../../game/run';
import { towerTop } from '../../../game/tower';
import BossTitle from './components/BossTitle';

// The boss fight on the top floor of a climb. It's the normal fight screen
// with a boss background, the boss (bigger, with more hearts) and a title.
// Which boss and which background are picked at random for each climb
// (run.boss, see chooseBoss in src/game/tower.js).
export default function BossRoom(props) {
  const boss = bossForRun(props.run);
  return (
    <Combat
      {...props}
      background={props.run.boss?.background ?? 'bossDoor'}
      banner={<BossTitle floor={towerTop(props.run)} name={boss.name} title={boss.title} />}
    />
  );
}
