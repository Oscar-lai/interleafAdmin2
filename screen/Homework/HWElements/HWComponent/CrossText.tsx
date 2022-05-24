import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';

interface ICrossText {
  style?: any;
  containerStyle?: any;
}

const CrossText: React.FC<ICrossText> = ({children, style, containerStyle}) => {
  //style can be array -> destructuring
  let textStyle: any[] = Array.isArray(style) ? style : [style];
  let containerStyle_array: any[] = Array.isArray(containerStyle)
    ? containerStyle
    : [containerStyle];

  //different digit will have different line pattern
  let word: number | undefined = children?.toString().length;
  let gradient: number = word ? 0.5 - 1 / (word + 2) : 0; //formula adjusting the gradient
  let xPosition = gradient;
  let yPosition = 1 - gradient;

  let strokeColor = '#707070';
  textStyle.forEach(element => {
    if (element.color) {
      strokeColor = element.color;
    }
  });

  return (
    <View style={[styles.container, ...containerStyle_array]}>
      <LinearGradient
        colors={['transparent', strokeColor, 'transparent']}
        locations={[0.45, 0.45, 0.53]}
        start={{x: xPosition, y: 0}}
        end={{x: yPosition, y: 1}}
        style={{flexDirection: 'row'}}>
        <Text style={[...textStyle]}>{children}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingLeft: DeviceInfo.isTablet() ? 4 : 2,
  },
});

export default CrossText;
