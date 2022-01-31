import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {MYCOLOR} from '../theme/typography';

interface IBarButton {
  onPress: any;
  index: number;
  curr: number;
  status: boolean | null;
}

const BarButton: React.FC<IBarButton> = function ({
  onPress,
  index,
  curr,
  status,
}) {
  let color;
  let current = index === curr;
  if (status === true) {
    if (current) {
      color = MYCOLOR.correct;
    } else {
      color = MYCOLOR.lightCorrect;
    }
  } else if (status === false) {
    if (current) {
      color = MYCOLOR.wrong;
    } else {
      color = MYCOLOR.lightWrong;
    }
  } else if (status === null) {
    if (current) {
      color = MYCOLOR.null;
    } else {
      color = MYCOLOR.lightNull;
    }
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.BarButton,
        {
          backgroundColor: color,
        },
      ]}>
      <Text style={styles.ButtonText}>{index + 1}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default BarButton;
