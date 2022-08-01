import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import TermListScreen from '../screen/TermListScreen';
import ChapterListScreen from '../screen/ChapterListScreen';
import CorrPage from '../screen/Homework/CorrPage';
import Theme from '../screen/Theme';
import Institute from '../screen/Institute';
import TutTermListScreen from '../screen/TutTermListScreen';
import TutChapterListScreen from '../screen/TutChapterListScreen';

const Stack = createStackNavigator();
const StackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="主目錄"
      component={Theme}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="教育機構"
      component={Institute}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="tutTerm"
      component={TutTermListScreen}
      options={({route}) => ({title: route.params.title})}
    />
    <Stack.Screen
      name="tutChapter"
      component={TutChapterListScreen}
      options={({route}) => ({title: route.params.title})}
    />
    <Stack.Screen
      name="term"
      component={TermListScreen}
      options={({route}) => ({title: route.params.title})}
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
