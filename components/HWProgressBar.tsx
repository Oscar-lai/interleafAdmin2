import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MYCOLOR} from '../theme/typography';

import Icon from 'react-native-vector-icons/Feather';
import BarButton from './BarButton';
Icon.loadFont();

interface HWProgressBarProps {
  length: number;
  curr: number;
  ScrollToQ: (index: number) => void;
  statusArray: (boolean | null)[];
}

const HWProgressBar: React.FC<HWProgressBarProps> = ({
  length,
  curr,
  statusArray,
  ScrollToQ,
}) => {
  const flatListRef = useRef<FlatList<any>>(null);

  const DATA = [...Array(length).keys()];

  function goToQ(index: number) {
    ScrollToQ(index);
  }

  function PrevQ() {
    if (curr > 0) {
      ScrollToQ(curr - 1);
    }
  }

  function NextQ() {
    if (curr < length - 1) {
      ScrollToQ(curr + 1);
    }
  }

  useEffect(() => {
    if (curr >= 0) {
      if (flatListRef) {
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: curr,
          viewPosition: 0.5,
        });
      }
    }
  }, [curr]);

  return (
    <View style={styles.BarWrapper}>
      <TouchableOpacity onPress={PrevQ} style={styles.ArrowButton}>
        <Icon name="chevron-left" size={30} color={MYCOLOR.whiteSmoke} />
      </TouchableOpacity>
      <FlatList
        data={DATA}
        ref={flatListRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({index}) => {
          return (
            <BarButton
              onPress={() => goToQ(index)}
              index={index}
              curr={curr}
              status={statusArray[index]}
            />
          );
        }}
        keyExtractor={index => index.toString()}
      />
      <TouchableOpacity onPress={NextQ} style={styles.ArrowButton}>
        <Icon name="chevron-right" size={30} color={MYCOLOR.whiteSmoke} />
      </TouchableOpacity>
    </View>
  );
};

export default HWProgressBar;

const styles = StyleSheet.create({
  BarWrapper: {
    width: '100%',
    height: 55,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  BarButton: {
    width: 40,
    height: 40,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  ArrowButton: {
    height: 55,
    marginHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
