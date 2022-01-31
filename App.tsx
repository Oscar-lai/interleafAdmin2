import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Setup from './Setup';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Setup />
      </SafeAreaProvider>
      <Toast ref={ref => Toast.setRef(ref)} />
    </NavigationContainer>
  );
};

export default App;
