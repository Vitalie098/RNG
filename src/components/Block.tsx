import { useGameContext } from '@/GameContext';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Text } from 'react-native';
import { useState } from 'react';

export default function Block({ index }: { index: number }) {
  const { blocks } = useGameContext();
  const [value, setValue] = useState(blocks?.value[index].val || 0);

  useAnimatedReaction(
    () => blocks?.value[index]?.val,
    (val) => {
      if (val !== undefined) {
        runOnJS(setValue)(val);
      }
    }
  );

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
      alignItems: 'center',
      justifyContent: 'center',
    };
  });

  return (
    <Animated.View style={styles}>
      <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>
        {value}
      </Text>
    </Animated.View>
  );
}