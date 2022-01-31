import {SafeAreaView, StyleSheet} from 'react-native';

import React from 'react';

import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface IScreen {
  style?: object;
}

const Screen: React.FC<IScreen> = function ({children, style}) {
  const inset = useSafeAreaInsets();
  return (
    <SafeAreaView
      style={[
        {
          paddingTop: inset.top,
          flex: 1,
        },
        style,
      ]}>
      {children}
    </SafeAreaView>
  );
};

export default Screen;
