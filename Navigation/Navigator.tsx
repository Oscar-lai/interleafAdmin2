import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TermListScreen from '../screen/TermListScreen';
import ChapterListScreen from '../screen/ChapterListScreen';
import CorrPage from '../screen/Homework/CorrPage';

const Stack = createStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="term"
      component={TermListScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="chapter"
      component={ChapterListScreen}
      options={({route}) => ({title: route.params.chineseName})}
    />
    <Stack.Screen
      name="question"
      component={CorrPage}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

const Navigator: React.FC = function () {
  return <StackNavigator />;
};

export default Navigator;
