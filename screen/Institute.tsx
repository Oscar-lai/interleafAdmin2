import React from 'react';
import {FlatList, View} from 'react-native';

import ListItem from '../components/ListItem';
import Screen from '../components/Screen';
import {MYCOLOR} from '../theme/typography';
import useTut from '../hooks/useTut';
// import chineseChapter from '../JSON/chineseChapter.json';
// import chineseName from '../JSON/chineseName.json';

interface IInstitute {
  navigation: any;
}

const Institute: React.FC<IInstitute> = function ({navigation}) {
  let tutorList = useTut();

  return (
    <Screen>
      <FlatList
        data={tutorList}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => {
          return (
            <ListItem
              title={item.name}
              subtitle={item.questionNumber.toString()}
              icon
              onPress={() => {
                navigation.navigate('tutTerm', {
                  title: item.name,
                  id: item.id,
                });
              }}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: MYCOLOR.whiteSmoke,
            }}
          />
        )}
      />
    </Screen>
  );
};

export default Institute;
