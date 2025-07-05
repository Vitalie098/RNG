import { ballSpeed, boardHeight } from '@/constants';
import { useGameContext } from '@/GameContext';
import { useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';

export default function Ball() {
  const { ball, isUserTurn, onEndTurn } = useGameContext();

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
      // right wall
      dx *= -1;
      x = width - r;
    }
    if (x < r) {
      // left wall
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
    // running on the UI
    return {
      left: x - r,
      top: y - r,
      // static
      width: r * 2,
      aspectRatio: 1,
      backgroundColor: 'white',
      borderRadius: r,

      position: 'absolute',
    };
  });

  return <Animated.View style={ballStyles} />;
}