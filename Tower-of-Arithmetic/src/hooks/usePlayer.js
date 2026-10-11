import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';

// The signed-in player and the actions to save their progress
// (see src/context/PlayerContext.js).
export function usePlayer() {
  const player = useContext(PlayerContext);
  if (!player) throw new Error('usePlayer must be used inside <PlayerProvider>');
  return player;
}
