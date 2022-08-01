import React, {useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

import ListItem from '../components/ListItem';
import Screen from '../components/Screen';
import {MYCOLOR} from '../theme/typography';
import DeviceInfo from 'react-native-device-info';
import useQuizTerms from '../hooks/useQuizTerms';


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

interface ITutTermListScreen {
  navigation: any;
  route: any;
}

const TutTermListScreen: React.FC<ITutTermListScreen> = function ({
  navigation,
  route,
}) {
  let tut = route.params.id ?? '';
  const termsQInfo = useQuizTerms(tut);



  return (
    <Screen>

      <FlatList
        data={termData}
        keyExtractor={item => item.code.toString()}
        renderItem={({item}) => {
          return (
            <ListItem
              title={item.chineseName}
              subtitle={
                (termsQInfo.sets[item.code]
                  ? `考卷: ${termsQInfo.sets[item.code]}   `
                  : '') +
                (termsQInfo.terms[item.code]
                  ? `題目: ${termsQInfo.terms[item.code]}`
                  : '')
              }
              icon={
                termsQInfo.sets[item.code] || termsQInfo.terms[item.code]
                  ? true
                  : false
              }
              grey={
                termsQInfo.sets[item.code] || termsQInfo.terms[item.code]
                  ? false
                  : true
              }
              onPress={() => {
                if (termsQInfo.sets[item.code] || termsQInfo.terms[item.code]) {
                  navigation.navigate('tutChapter', {
                    term: item.code,
                    id: tut,
                    chineseName: item.chineseName,
                    title: item.chineseName,
                  });
                }
              }}
            />
          );
        }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: '100%',
              height: DeviceInfo.isTablet() ? 1.5 : 1,
              backgroundColor: MYCOLOR.whiteSmoke,
            }}
          />
        )}
      />
    </Screen>
  );
};

export default TutTermListScreen;

const styles = StyleSheet.create({
  backButton: {
    marginVertical: DeviceInfo.isTablet() ? '1%' : '-1%',
    width: '100%',
    marginLeft: DeviceInfo.isTablet() ? '5%' : '7%',
  },
});
