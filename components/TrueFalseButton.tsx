import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {MYCOLOR} from '../theme/typography';

interface ITrueFalseButton {
  leftOnPress: any;
  rightOnPress: any;
}

const TrueFalseButton: React.FC<ITrueFalseButton> = function ({
  leftOnPress,
  rightOnPress,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={leftOnPress} style={styles.leftButton}>
        <Icon name="x" size={40} color={'white'} />
      </TouchableOpacity>
      <TouchableOpacity onPress={rightOnPress} style={styles.rightButton}>
        <Icon name="check" size={40} color={'white'} />
      </TouchableOpacity>
    </View>
  );
};

export default TrueFalseButton;

const styles = StyleSheet.create({
  rightButton: {
    backgroundColor: '#B5CD33',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    backgroundColor: MYCOLOR.lightRed,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    width: '100%',
    height: '12%',
  },
});
