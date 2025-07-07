import { useGameContext } from '@/GameContext';
import { BlockData } from '@/types';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

export default function Block({ index }: { index: number }) {
  const { blocks } = useGameContext();

  const styles = useAnimatedStyle(() => {
    const block = blocks!.value[index];
    if (!block || block.val <= 0) {
      return {
        display: 'none',
      };
    }

    const { w, x, y, val } = block;

    return {
      display: 'flex',
      width: w,
      height: w,
      position: 'absolute',
      top: withTiming(y),
      left: x,
      backgroundColor: '#F5B52F',
    };
  });

  return <Animated.View style={styles} />;
}