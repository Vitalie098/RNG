import { createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';
import { BallData } from './types';

export const GameContext = createContext<{
  ball?: SharedValue<BallData>;
  isUserTurn?: SharedValue<boolean>;
  onEndTurn: () => void;
}>({
  onEndTurn: () => {},
});

export const useGameContext = () => useContext(GameContext);