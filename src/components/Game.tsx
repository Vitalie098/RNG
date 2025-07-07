import { ballRadius, blockW, boardHeight } from '@/constants';
import { BallData, BlockData } from '@/types';
import {
  SafeAreaView,
  View,
  StyleSheet,
  useWindowDimensions,
  Text,
  Alert,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Ball from './Ball';
import { GameContext } from '@/GameContext';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Block from './Block';
import { generateBlocksRow } from '@/utils';
import { useState } from 'react';

export default function Game() {
  const { width } = useWindowDimensions();
  const [score, setScore] = useState(1);

  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  const blocks = useSharedValue<BlockData[]>(
    Array(3)
      .fill(0)
      .flatMap((_, row) => generateBlocksRow(row + 1))
  );

  const isUserTurn = useSharedValue(true);

  const incrementScore = () => {
    setScore((s) => s + 1);
  };

  const onGameOver = () => {
    Alert.alert('Game over', 'Score: ' + score, [
      {
        text: 'Restart',
        onPress: () => {
          blocks.value = [];

          blocks.value = Array(3)
            .fill(0)
            .flatMap((_, row) => generateBlocksRow(row + 1));

          setScore(1);
        },
      },
    ]);
  };

  const onEndTurn = () => {
    'worklet';
    if (isUserTurn.value) {
      return;
    }
    isUserTurn.value = true;

    const gameOver = blocks.value.some(
      (block) => block.val > 0 && block.y + 2 * (blockW + 10) > boardHeight
    );
    if (gameOver) {
      console.log('game over');
      runOnJS(onGameOver)();
      return;
    }

    blocks.modify((blocks) => {
      blocks.forEach((block) => {
        block.y += blockW + 10;
      });

      blocks.push(...generateBlocksRow(1));

      return blocks;
    });

    runOnJS(incrementScore)();
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (!isUserTurn.value) {
        return;
      }

      const x = e.translationX;
      const y = e.translationY;

      const mag = Math.sqrt(x * x + y * y);

      ball.value = {
        ...ball.value,
        dx: -x / mag,
        dy: -y / mag,
      };
    })
    .onEnd(() => {
      if (ball.value.dy < 0) {
        isUserTurn.value = false;
      }
    });

  const pathStyle = useAnimatedStyle(() => {
    const { x, y, dx, dy } = ball.value;
    const angle = Math.atan2(-dx, dy);

    return {
      display: isUserTurn.value ? 'flex' : 'none',
      top: y,
      left: x,
      transform: [
        {
          rotate: `${angle}rad`,
        },
      ],
    };
  });

  return (
    <GameContext.Provider value={{ ball, isUserTurn, onEndTurn, blocks }}>
      <GestureDetector gesture={pan}>
        <SafeAreaView style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'gray' }}>
              {score}
            </Text>
          </View>
          <View style={styles.board}>
            {blocks.value.map((_, index) => (
              <Block key={index} index={index} />
            ))}

            <Ball />

            {/* Ball Trajjectory */}
            <Animated.View
              style={[
                {
                  width: 0,
                  height: 1000,
                  borderWidth: 1,
                  borderColor: '#ffffff99',
                  borderStyle: 'dotted',
                  position: 'absolute',
                  transformOrigin: 'top-center',
                },
                pathStyle,
              ]}
            />
          </View>
        </SafeAreaView>
      </GestureDetector>
    </GameContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
  },
  board: {
    backgroundColor: '#202020',
    height: boardHeight,
    marginVertical: 'auto',
    overflow: 'hidden',
  },
});