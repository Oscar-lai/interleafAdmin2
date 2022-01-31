import React from 'react';
import {View, SectionList, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import AppText from '../components/AppText';
import ListItem from '../components/ListItem';
import {MYCOLOR} from '../theme/typography';

import chineseChapter from '../JSON/chineseChapter.json';

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

interface IChapterListScreen {
  navigation: any;
  route: any;
}

const ChapterListScreen: React.FC<IChapterListScreen> = function ({
  navigation,
  route,
}) {
  const term = route.params.term;
  let termData: ItermData[] = [];

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

  const inset = useSafeAreaInsets();

  return (
    <SectionList
      sections={termData}
      keyExtractor={item => item.code.toString()}
      renderItem={({item}) => {
        return (
          <ListItem
            title={item.code}
            subtitle={item.chineseName}
            icon
            onPress={() =>
              navigation.navigate('question', {
                chapter: item.code,
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
      renderSectionHeader={({section}) => <Header>{section.code}</Header>}
    />
  );
};

export default ChapterListScreen;

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.primary_light,
  },
});
