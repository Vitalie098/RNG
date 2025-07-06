import { ballSpeed, boardHeight } from '@/constants';
import { useGameContext } from '@/GameContext';
import { getResetPositionAndDirection } from '@/utils';
import { useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';

export default function Ball() {
  const { ball, isUserTurn, onEndTurn, blocks } = useGameContext();

  const { width } = useWindowDimensions();

  const frameCallback = useFrameCallback((frameInfo) => {
    const delta = (frameInfo.timeSincePreviousFrame || 0) / 1000;

    let { x, y, dx, dy, r } = ball!.value;

    x += dx * delta * ballSpeed;
    y += dy * delta * ballSpeed;

    if (y < r) {
      // top wall
      dy *= -1;
      y = r;
    }

    if (y > boardHeight - r) {
      // bottom wall
      // dy *= -1;
      y = boardHeight - r;
      onEndTurn();
    }

    if (x > width - r) {
      dx *= -1;
      x = width - r;
    }
    if (x < r) {
      dx *= -1;
      x = r;
    }
    ball!.value = {
      ...ball!.value,
      x,
      y,
      dy,
      dx,
    };

    // check collision with blocks
    blocks!.modify((blocks) => {
      blocks
        .filter((block) => block.val > 0)
        .some((block) => {
          const newBallData = getResetPositionAndDirection(ball!.value, block);
          if (newBallData) {
            ball!.value = newBallData;
            block.val -= 1;
            return true;
          }
        });

      return blocks;
    });
  }, false);

  const startFrameCallback = (val: boolean) => {
    frameCallback.setActive(val);
  };

  useAnimatedReaction(
    () => isUserTurn!.value,
    (val) => runOnJS(startFrameCallback)(!val)
  );

  const ballStyles = useAnimatedStyle(() => {
    const { x, y, r } = ball!.value;
    
    return {
      left: x - r,
      top: y - r,
      width: r * 2,
      aspectRatio: 1,
      backgroundColor: 'white',
      borderRadius: r,

      position: 'absolute',
    };
  });

  return <Animated.View style={ballStyles} />;
}