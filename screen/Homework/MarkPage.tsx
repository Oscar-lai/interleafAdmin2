import React, {useCallback, useEffect, useRef, useState} from 'react';
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
import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/Feather';
import {MYCOLOR, myFont} from '../../theme/typography';
Icon.loadFont();

import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import HWProgressBar from '../../components/HWProgressBar';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HWQ} from '../../hooks/useHWQ';
import MarkDisplay from './MarkDisplay';
import useFinishedHWQ from '../../hooks/useFinishedHWQ';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {AppID} from '../../firebase/Config';
import {SpinLoader} from '../../components/SpinLoader';
Icon2.loadFont();

import DeviceInfo from 'react-native-device-info';
import HWBanner from './HWBanner';

interface CorrPageProps {
  navigation: any;
  route: any;
}

interface HWQforMarking extends HWQ {
  index: number;
  currIndex: number;
}

const MarkPage: React.FC<CorrPageProps> = ({navigation, route}) => {
  const daysOfDistribution = route.params?.daysOfDistribution ?? null;
  const focus = route.params?.focus ?? null;
  const QNum = route.params?.QNum ?? null;
  const HWid = route.params?.HWid ?? '';
  const SID = route.params?.SID ?? '';

  console.log(SID);
  console.log(HWid);

  const QList = useFinishedHWQ(SID, HWid);

  const flatListRef = useRef<FlatList<any>>(null);

  const [currQ, setcurrQ] = useState<number>(0);

  const [RealHW, setRealHW] = useState<HWQ[]>([]);

  const [HW2BDisplayed, setHW2BDisplayed] = useState<HWQforMarking[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  //to indicate the marking progress
  const [qStatus, setQStatus] = useState<
    (boolean | null | number | undefined)[]
  >([]);

  // for Auto scrolling
  function ScrollToQ(index: number) {
    flatListRef?.current?.scrollToIndex({animated: true, index: index});
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

  //API for submitting marking
  const SubmitMark = () => {
    setIsLoading(true);

    // check if all Q marked
    let flag = false;
    RealHW.map(q => {
      if (q.correct === null) {
        flag = true;
      }
    });

    // return if any q is unmarked
    if (flag) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: '請先完成批改所有題目',
        visibilityTime: 1000,
      });
      setIsLoading(false);
      return;
    }

    // convert RealHW from array form to object form and delete id
    let RealRealHW: {
      [id: string]: HWQ;
    } = {};

    RealHW.map((hwq, index) => {
      let temp = JSON.parse(JSON.stringify(hwq));
      delete temp.id;
      RealRealHW[hwq.id] = temp;
    });

    console.log('Real hw before submit: ');
    console.log(RealRealHW);

    // use api to submit HW to server
    auth()
      .currentUser?.getIdToken()
      .then(token => {
        const data = RealRealHW;
        const header = {headers: {'x-auth-token': token}};

        axios
          .post(
            `https://${AppID}.web.app/api/homework/mark/${SID}/${HWid}`,
            data,
            header,
          )
          .then(res => {
            console.log(res.data);
            setIsLoading(false);
            // navigation.goBack();
          })
          .catch(err => {
            console.log(err.response.data);
            setIsLoading(false);
            Toast.show({
              type: 'error',
              text1: '提交失敗',
              visibilityTime: 1000,
            });
          });
      })
      .catch(err => {
        console.log(err);

        console.log('token problem');
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: '提交失敗',
          visibilityTime: 1000,
        });
      });
  };

  //initiate the HW2BDisplayed array
  useEffect(() => {
    if (QList?.length > 0 && HW2BDisplayed.length === 0) {
      console.log('im updating the 2Bdisplay and shits');
      console.log('here is wt QList looks like');
      console.log(QList);
      // first make the real HW for later submit use
      const DummyQ = QList.slice(0);
      setRealHW(DummyQ);
      // here create a mirror of QList that only contain LongQ
      let temp: HWQforMarking[] = [];
      let counter = 0;
      DummyQ.map((q, index) => {
        if (q.camera === true) {
          // also add a index prop for marking purposes
          // (to determine which item of HWQ[] to set correct/false)
          let temptemp = {...q, index: index, currIndex: counter++};
          temp.push(temptemp);
        }
      });

      console.log('here is the 2Bdisplay state');
      console.log(temp);
      setHW2BDisplayed(temp);

      //set up the progress
      let progress: (boolean | undefined | number | null)[] = temp.map(
        element => {
          return element.correct;
        },
      );
      setQStatus(progress);
    }
  }, [QList]);

  //update the HW2BDisplayed array once all the questions have been marked
  useEffect(() => {
    if (qStatus.length > HW2BDisplayed.length) {
      //MarkHW update the length of qStatus so that the length is one unit longer
      let temp = [...HW2BDisplayed];
      // add last page for showing the overview
      let lastPageTemp = {
        id: 'overview',
        camera: false,
        sandwiches: [],
        demo: false,
        checked: false,
        tricky: false,
        objectManipulation: false,
        index: -1,
        currIndex: -1,
        correct: true,
        issuer: {
          id: '',
          classes: false,
          scheduling: false,
        },
      };
      temp.push(lastPageTemp);
      setHW2BDisplayed(temp);

      //scroll to the last page
      setTimeout(() => {
        ScrollToQ(HW2BDisplayed.length);
      }, 300);
    }
  }, [qStatus]);

  //function for the button below each question
  const MarkHW = (index: number, currIndex: number, mark: boolean) => {
    // set the correct props for real HW (the one to be submitted)
    let temp = QList.slice(0);
    temp[index].correct = mark;
    setRealHW(temp);
    // set the correct props for 2BDisplayed (for displaying top bar changes)
    let temp2 = HW2BDisplayed.slice(0);
    temp2[currIndex].correct = mark;
    setHW2BDisplayed(temp2);

    //set the progress
    let progress = [...qStatus];
    progress[currIndex] = mark;
    //check whether all are marked
    let allMarked = progress.every(element => {
      return typeof element === 'boolean';
    });
    if (allMarked) {
      progress.push(1);
    }
    setQStatus(progress);

    // scroll to next Q
    if (currIndex + 1 < HW2BDisplayed.length) {
      setTimeout(() => {
        ScrollToQ(currIndex + 1);
      }, 300);
    }
  };


  return (
    <RawWrapper
      customStyle={{backgroundColor: '#F8F8F8', position: 'relative'}}>
      {isLoading ? <SpinLoader /> : <></>}
      {HW2BDisplayed.length > 0 ? (
        <HWBanner
          focus={focus}
          QNum={QNum}
          goBack={() => navigation.goBack()}
          daysOfDistribution={daysOfDistribution + '呈交'}
          backgroundColor={
            HW2BDisplayed[currQ].currIndex === -1
              ? MYCOLOR.mainGreen
              : HW2BDisplayed[currQ].correct === true
              ? '#B5CD33'
              : HW2BDisplayed[currQ].correct === false
              ? MYCOLOR.lightRed
              : '#909090'
          }
          Title={
            HW2BDisplayed[currQ].currIndex === -1
              ? '批改總覽'
              : HW2BDisplayed[currQ].correct === true
              ? '正確'
              : HW2BDisplayed[currQ].correct === false
              ? '錯誤'
              : '待批改'
          }
          HWType={'批改'}
        />
      ) : (
        <></>
      )}
      {HW2BDisplayed.length > 0 ? (
        <HWProgressBar
          ScrollToQ={ScrollToQ}
          curr={currQ}
          length={HW2BDisplayed.length}
          statusArray={qStatus}
        />
      ) : (
        <></>
      )}
      {HW2BDisplayed.length > 0 ? (
        <View style={styles.QWrapper}>
          <View style={styles.MiddleWrapper}>
            <FlatList
              data={HW2BDisplayed}
              horizontal
              keyExtractor={item => item.id}
              initialScrollIndex={0}
              snapToInterval={widthPercentageToDP('100')}
              showsHorizontalScrollIndicator={false}
              decelerationRate={'fast'}
              initialNumToRender={HW2BDisplayed.length}
              ref={flatListRef}
              onViewableItemsChanged={ViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              renderItem={({
                item,
                index,
              }: {
                item: HWQforMarking;
                index: number;
              }) => {
                return (
                  <View style={styles.ListItem}>
                    <MarkDisplay
                      sandwiches={item.sandwiches}
                      Qindex={item.index}
                      currIndex={item.currIndex}
                      MarkHW={MarkHW}
                      SubmitMark={SubmitMark}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
      ) : (
        <></>
      )}
    </RawWrapper>
  );
};

export default MarkPage;

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
});
