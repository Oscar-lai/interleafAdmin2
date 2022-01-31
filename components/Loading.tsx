import React, {useRef, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {View, Animated} from 'react-native';
import {SafeWrapper} from '../theme/sharedComponents';

interface ILoadingProps {}

const Loading: React.FC<ILoadingProps> = ({}) => {
  const animatedValue1 = useRef(new Animated.Value(0)).current;
  const animatedValue2 = useRef(new Animated.Value(0)).current;
  const animatedValue3 = useRef(new Animated.Value(0)).current;
  const animatedValue4 = useRef(new Animated.Value(0)).current;
  const animatedValue5 = useRef(new Animated.Value(0)).current;
  const animatedValue6 = useRef(new Animated.Value(0)).current;
  const animatedValue7 = useRef(new Animated.Value(0)).current;

  const animation = (value: Animated.Value, delay: number, offset: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          delay: delay,
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          delay: offset,
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

  useEffect(() => {
    animation(animatedValue1, 0, 1200).start();
    animation(animatedValue2, 200, 1000).start();
    animation(animatedValue3, 400, 800).start();
    animation(animatedValue4, 600, 600).start();
    animation(animatedValue5, 800, 400).start();
    animation(animatedValue6, 1000, 200).start();
    animation(animatedValue7, 1200, 0).start();
  }, []);

  return (
    <SafeWrapper>
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <Animated.Image
            style={[styles.image, {opacity: animatedValue1}]}
            source={require('../img/Interleaf_Logo_1.png')}
          />
          <Animated.Image
            style={[styles.image, {opacity: animatedValue2}]}
            source={require('../img/Interleaf_Logo_2.png')}
          />
          <Animated.Image
            style={[styles.image, {opacity: animatedValue3}]}
            source={require('../img/Interleaf_Logo_3.png')}
          />
          <Animated.Image
            style={[styles.image, {opacity: animatedValue4}]}
            source={require('../img/Interleaf_Logo_4.png')}
          />
          <Animated.Image
            style={[styles.image, {opacity: animatedValue5}]}
            source={require('../img/Interleaf_Logo_5.png')}
          />
          <Animated.Image
            style={[styles.image, {opacity: animatedValue6}]}
            source={require('../img/Interleaf_Logo_6.png')}
          />
          <Animated.Image
            style={[styles.image, {opacity: animatedValue7}]}
            source={require('../img/Interleaf_Logo_7.png')}
          />
        </View>
      </View>
    </SafeWrapper>
  );
};

export default Loading;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: 160,
    width: 160,
    position: 'relative',
  },
  image: {
    resizeMode: 'contain',
    height: 160,
    width: 160,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
