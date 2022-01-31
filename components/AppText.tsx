import React from 'react';
import {Text, StyleSheet, Platform} from 'react-native';

interface IAppText {
  style?: object;
}

const AppText: React.FC<IAppText> = function ({children, style}) {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
  },
});
