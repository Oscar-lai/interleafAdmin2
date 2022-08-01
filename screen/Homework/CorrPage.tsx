import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewToken,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {RawWrapper} from '../../theme/sharedComponents';

import Icon from 'react-native-vector-icons/Feather';
import {MYCOLOR, myFont} from '../../theme/typography';
Icon.loadFont();

import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import HWProgressBar from '../../components/HWProgressBar';
import useChapterQ from '../../hooks/useChapterQ';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HWQ} from '../../hooks/useHWQ';
import CorrDisplay from './CorrDisplay';
import TrueFalseButton from '../../components/TrueFalseButton';
import addQuestionType from '../../helper/questionType';
Icon2.loadFont();

import firestore from '@react-native-firebase/firestore';
import useTutQ from '../../hooks/useTutQ';

interface CorrPageProps {
  navigation: any;
  route: any;
}

const CorrPage: React.FC<CorrPageProps> = ({navigation, route}) => {
  const chapter = route.params.chapter;
  const chapterName = route.params.chineseName;

  const tut = route.params.tut ?? '';

  const QList = useChapterQ(chapter, tut);

  const qStatus = QList.map(element => {
    return element.checked;
  });
  const qTypes = QList.map(element => {
    return addQuestionType(element);
  });

  let checkedNumber = 0;
  for (let element of QList) {
    if (element.checked) {
      checkedNumber++;
    }
  }

  const flatListRef = useRef<FlatList<any>>(null);

  const [currQ, setcurrQ] = useState<number>(0);

  // for Auto scrolling
  function ScrollToQ(index: number) {
    flatListRef?.current?.scrollToIndex({animated: true, index: index});
  }

  //after pressing button
  async function nextQ(thisQ: number, qid: string, checking: boolean) {
    let path = tut
      ? `customQuestion/${tut}/questions/${chapter}/dish/${qid}`
      : `questions/${chapter}/dish/${qid}`;
    await firestore().doc(path).update({checked: checking});
    if (thisQ < QList.length - 1) {
      ScrollToQ(currQ + 1);
    }
  }

  const ViewableItemsChanged = useCallback(
    (info: {viewableItems: ViewToken[]; changed: ViewToken[]}) => {
      if (info) {
        if (info.viewableItems[0]) {
          setcurrQ(info.viewableItems[0].index ?? 0);
        }
      }
    },
    [],
  );

  const inset = useSafeAreaInsets();

  let bannerColor = MYCOLOR.lightRed;
  let bannerMessage = '錯誤';
  switch (qStatus[currQ]) {
    case true:
      bannerColor = '#B5CD33';
      bannerMessage = '確認';
      break;
    case false:
      bannerColor = MYCOLOR.lightRed;
      bannerMessage = '錯誤';
      break;
    case null:
      bannerColor = MYCOLOR.lightGray;
      bannerMessage = '未確認';
      break;
  }

  return (
    <RawWrapper customStyle={{backgroundColor: '#F8F8F8'}}>
      <View
        style={[
          styles.topBar,
          {
            backgroundColor: bannerColor,
            paddingTop: inset.top,
          },
        ]}>
        <View style={styles.BackButtonWrapper}>
          <TouchableOpacity
            style={styles.BackButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={20} color="#FFFFFFB2" />
            <Text style={styles.BackButtonText}>退出</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.CorrectText}>{bannerMessage}</Text>
        <View style={styles.InfoWrapper}>
          <Text numberOfLines={1} style={styles.TopicText}>
            {chapterName}
          </Text>
          <View style={styles.InfoDetailWrapper}>
            <Text style={styles.DetailText}>
              {'確認: ' + `${checkedNumber}/${QList.length}`}
            </Text>
          </View>
        </View>
      </View>
      {QList.length > 0 && (
        <HWProgressBar
          ScrollToQ={ScrollToQ}
          curr={currQ}
          length={QList.length}
          statusArray={qStatus}
        />
      )}
      {QList.length > 0 && (
        <View style={styles.QWrapper}>
          <View style={styles.MiddleWrapper}>
            <FlatList
              data={QList}
              horizontal
              keyExtractor={item => item.id}
              initialScrollIndex={0}
              snapToInterval={widthPercentageToDP('100')}
              showsHorizontalScrollIndicator={false}
              decelerationRate={'fast'}
              initialNumToRender={QList.length}
              ref={flatListRef}
              onViewableItemsChanged={ViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              renderItem={({item, index}: {item: HWQ; index: number}) => {
                return (
                  <View style={styles.ListItem}>
                    <CorrDisplay
                      sandwiches={item.sandwiches}
                      correct
                      Qindex={index}
                      type={qTypes[index]}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}

      <TrueFalseButton
        leftOnPress={() => nextQ(currQ, QList[currQ].id, false)}
        rightOnPress={() => nextQ(currQ, QList[currQ].id, true)}
      />
    </RawWrapper>
  );
};

export default CorrPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  ListItem: {
    width: widthPercentageToDP('100%'),
    flexDirection: 'column',
    height: '100%',
  },
  QWrapper: {
    height: 1,
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MiddleWrapper: {
    height: '100%',
    width: '100%',
  },
  LeftRightWrapper: {
    width: 45,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: '5%',
  },
  LeftRightText: {
    fontSize: 10,
    color: MYCOLOR.whiteSmoke,
    fontFamily: myFont.GEN,
  },
  BackButtonWrapper: {
    width: 1,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  BackButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: '#FFFFFFB2',
    paddingHorizontal: '5%',
    marginBottom: '3%',
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
  },
  BackButtonText: {
    color: '#FFFFFFB2',
    fontFamily: myFont.GEN,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 34,
  },
  InfoWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 1,
    flex: 1,
  },
  InfoDetailWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  DateWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '5%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '5%',
    flexGrow: 0,
    paddingVertical: '5%',
  },
  bottomBar: {
    flexDirection: 'row',
    width: '100%',
    height: '13%',
  },
  TopicText: {
    fontSize: 20,
    fontFamily: myFont.GEN,
    color: '#FFFFFFB2',
  },
  DetailText: {
    fontSize: 16,
    fontFamily: myFont.GEN,
    color: '#FFFFFFB2',
  },
  CorrectText: {
    color: '#FFF',
    fontFamily: myFont.GEN,
    fontSize: 20,
  },
});
