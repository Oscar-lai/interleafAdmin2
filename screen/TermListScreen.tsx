import React from 'react';
import {FlatList, View} from 'react-native';

import ListItem from '../components/ListItem';
import Screen from '../components/Screen';
import {MYCOLOR} from '../theme/typography';

// import chineseChapter from '../JSON/chineseChapter.json';
// import chineseName from '../JSON/chineseName.json';

const terms = [
  '01a',
  '01b',
  '02a',
  '02b',
  '03a',
  '03b',
  '04a',
  '04b',
  '05a',
  '05b',
  '06a',
  '06b',
];
const chineseTerms = [
  '小一上',
  '小一下',
  '小二上',
  '小二下',
  '小三上',
  '小三下',
  '小四上',
  '小四下',
  '小五上',
  '小五下',
  '小六上',
  '小六下',
];

let termData: any[] = [];
terms.forEach((term, index) => {
  let object = {
    code: term,
    chineseName: chineseTerms[index],
  };
  termData.push(object);
});

interface ITermListScreen {
  navigation: any;
  // route: RouteProp<{params: {type: string}}, 'params'>;
}

const TermListScreen: React.FC<ITermListScreen> = function ({navigation}) {
  return (
    <Screen>
      <FlatList
        data={termData}
        keyExtractor={item => item.code.toString()}
        renderItem={({item}) => {
          return (
            <ListItem
              title={item.code}
              subtitle={item.chineseName}
              icon
              onPress={() =>
                navigation.navigate('chapter', {
                  term: item.code,
                  chineseName: item.chineseName,
                })
              }
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

export default TermListScreen;
