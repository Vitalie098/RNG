import { createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { BallData, BlockData } from './types';

export const GameContext = createContext<{
  ball?: SharedValue<BallData>;
  isUserTurn?: SharedValue<boolean>;
  onEndTurn: () => void;
  blocks?: SharedValue<BlockData[]>;
}>({
  onEndTurn: () => {},
});

export const useGameContext = () => useContext(GameContext);