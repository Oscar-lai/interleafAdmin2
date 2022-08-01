import React, {useState} from 'react';
import {View, SectionList, StyleSheet, FlatList} from 'react-native';

import {BackButton2} from '../theme/sharedComponents';
import AppText from '../components/AppText';
import ListItem from '../components/ListItem';
import {MYCOLOR} from '../theme/typography';

import useQuiz, {IChapter} from '../hooks/useQuiz';
import DeviceInfo from 'react-native-device-info';
import Screen from '../components/Screen';
import ToggleButton from '../components/ToggleButton';
const chineseChapter: Isyllabus = require('../JSON/chineseChapter.json');

export interface Isyllabus {
  [id: string]: IChapter[];
}

interface ItermData {
  code: string;
  chineseName: string;
  data: Ichapter[];
}

interface Ichapter {
  code: string;
  chineseName: string;
}

const Header: React.FC = function ({children}) {
  return (
    <View style={styles.header}>
      <AppText style={{fontWeight: 'bold'}}>{children}</AppText>
    </View>
  );
};

interface ITutChapterListScreen {
  navigation: any;
  route: any;
}

const TutChapterListScreen: React.FC<ITutChapterListScreen> = function ({
  navigation,
  route,
}) {
  const term = route.params.term;
  let tut = route.params.id ?? '';
  let termData: ItermData[] = [];
  //   let setsData: [] = [];

  const quizInfo = useQuiz(tut);
  const chapterInfo = quizInfo.chapters[term] ? quizInfo.chapters[term] : {};
  const setsInfo = quizInfo.sets[term] ? quizInfo.sets[term] : {};

  //term - chapter array
  for (let topic of chineseChapter[term]) {
    let object: ItermData = {
      code: topic.id,
      chineseName: topic.chineseName,
      data: [],
    };
    for (let chapter of topic.chapters) {
      let chapterObject = {
        code: chapter.id,
        chineseName: chapter.chineseName,
      };
      object.data.push(chapterObject);
    }
    termData.push(object);
  }

  //sets array

  const [viewChapter, setViewChapter] = useState<boolean>(false);

  return (
    <Screen>
      <View
        style={{
          backgroundColor: '#FFF',
          paddingVertical: '5%',
          paddingHorizontal: '5%',
        }}>
        <ToggleButton
          openText="課題"
          closeText="考卷"
          value={viewChapter}
          setValue={setViewChapter}
          onChange={() => {}}
        />
      </View>
      {viewChapter === false &&
        (setsInfo && Object.keys(setsInfo).length > 0 ? (
          <FlatList
            data={Object.keys(setsInfo)}
            keyExtractor={item => item}
            renderItem={({item}) => {
              return (
                <ListItem
                  title={setsInfo[item].name}
                  subtitle={
                    setsInfo[item].questionNumber
                      ? `題目: ${setsInfo[item].questionNumber}`
                      : ''
                  }
                  icon
                  onPress={() =>
                    navigation.navigate('question', {
                      chapter: item,
                      chineseName: setsInfo[item].name,
                      tut: tut,
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
        ) : (
          <View style={{marginTop: '3%', alignItems: 'center'}}>
            <AppText style={{color: MYCOLOR.whiteSmoke}}>
              這個年級沒有任何考卷
            </AppText>
          </View>
        ))}
      {viewChapter === true && (
        <SectionList
          sections={termData}
          keyExtractor={item => item.code.toString()}
          renderItem={({item}) => {
            return (
              <ListItem
                title={item.chineseName}
                subtitle={
                  chapterInfo[item.code]
                    ? `題目: ${chapterInfo[item.code]}`
                    : ''
                }
                icon={chapterInfo[item.code] ? true : false}
                grey={chapterInfo[item.code] ? false : true}
                onPress={() => {
                  if (chapterInfo[item.code]) {
                    navigation.navigate('question', {
                      chapter: item.code,
                      chineseName: item.chineseName,
                      tut: tut,
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
          renderSectionHeader={({section}) => <Header>{section.code}</Header>}
        />
      )}
    </Screen>
  );
};

export default TutChapterListScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.primary_light,
  },
  backButton: {
    marginVertical: DeviceInfo.isTablet() ? '1%' : '-1%',
    width: '100%',
    marginLeft: DeviceInfo.isTablet() ? '5%' : '7%',
  },
});
