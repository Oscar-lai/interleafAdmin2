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
import {SafeWrapper} from '../../theme/sharedComponents';
import auth from '@react-native-firebase/auth';
import Storage from '@react-native-firebase/storage';

import Icon from 'react-native-vector-icons/Feather';
import {MYCOLOR, myFont} from '../../theme/typography';
Icon.loadFont();

import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import HWProgressBar from '../../components/HWProgressBar';
import useHWQ, {HWQ} from '../../hooks/useHWQ';
import QuestionDisplay from './HWDisplay';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {AppID} from '../../firebase/Config';
import {Image} from 'react-native-compressor';
import {SpinLoader} from '../../components/SpinLoader';
Icon2.loadFont();

interface HWPageProps {
  navigation: any;
  route: any;
}

let RealHW: HWQ[] = [];
let photoArray: string[] = [];

const HWPage: React.FC<HWPageProps> = ({navigation, route}) => {
  const daysOfDistribution = route.params?.daysOfDistribution ?? null;
  const focus = route.params?.focus ?? null;
  const QNum = route.params?.QNum ?? null;
  const HWid = route.params?.HWid ?? '';
  const SID = route.params?.SID ?? '';

  const QList = useHWQ(SID, HWid);

  const flatListRef = useRef<FlatList<any>>(null);

  const [currQ, setcurrQ] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<any>();

  // key for whole component to force re-render when RealHW is updated
  const [key, setkey] = useState<string>('abcd');

  // array to show which of the questions is longQ
  const [needTakePhoto, setNeedTakePhoto] = useState<number[]>([]);

  // for Auto scrolling
  function ScrollToQ(index: number) {
    flatListRef?.current?.scrollToIndex({animated: true, index: index});
  }

  const ViewableItemsChanged = useCallback(
    (info: {viewableItems: ViewToken[]; changed: ViewToken[]}) => {
      if (info) {
        if (info.viewableItems[0]) setcurrQ(info.viewableItems[0].index ?? 0);
      }
    },
    [],
  );

  // set up RealHW, needTakePhoto etc, plus refreshing
  useEffect(() => {
    // set up the HW variable
    RealHW = QList.slice(0);

    // set up the photo array
    photoArray = Array(RealHW.length).fill('');

    // set up needTakePhoto
    let temp: number[] = [];
    Object.values(RealHW).forEach((Q, index) => {
      if (Q.camera === true) {
        temp.push(index);
      }
    });
    setNeedTakePhoto(temp);

    // force the component to re-render since RealHW cannot be a state
    // il faut que utiliser la cle a force re-render
    setkey('1234567');
  }, [QList]);

  const SubmitHW = useCallback(() => {
    var flag = true;

    // check if all picture taken
    for (var i = 0; i < photoArray.length; i++) {
      if (needTakePhoto.includes(i)) {
        if (photoArray[i] === '') {
          flag = false;
          Toast.show({
            type: 'error',
            text1: '錯誤',
            text2: `請拍下第${i + 1}題的答案`,
            visibilityTime: 1000,
          });
          break;
        }
      }
    }
    // if not return
    if (!flag) {
      return;
    }

    // convert RealHW from array form to object form and add time + delete id
    let RealRealHW: {
      [id: string]: HWQ;
    } = {};
    RealHW.map((hwq, index) => {
      let temp = JSON.parse(JSON.stringify(hwq));
      // temp.time = TimeArray[index];
      temp.time = 1;
      delete temp.id;
      RealRealHW[hwq.id] = temp;
    });

    // add time for last q
    // if (startTime) {
    //   let endTime = new Date();
    //   let timeDiff = endTime.getTime() - startTime.getTime(); //in ms
    //   timeDiff /= 1000; // in s

    //   if (TimeArray[currentCountTimeQuestion]) {
    //     // add the new time on top of it
    //     let temp = TimeArray.slice(0);
    //     temp[currentCountTimeQuestion] =
    //       temp[currentCountTimeQuestion] + timeDiff;
    //     setTimeArray(temp);
    //   } else {
    //     // if not then simply set it
    //     TimeArray[currentCountTimeQuestion] = timeDiff;
    //   }
    //   // reset these variable to count the next q
    //   setStartTime(endTime);
    //   setCurrentCountTimeQuestion(currentQuestion);
    // }

    // add time inside object
    // let counter1 = 0;
    // for (let questionId in RealHW) {
    //   RealRealHW[questionId]['time'] = TimeArray[counter1];
    //   counter1++;
    // }

    // check if all Q done
    var counter = 1;
    let unfinished: number[] = [];
    for (let questionId in RealRealHW) {
      if (RealRealHW[questionId]['camera'] === false) {
        for (let line of RealRealHW[questionId]['sandwiches']) {
          if (line['fillings'].length)
            for (let blank of line['fillings']) {
              // if an ans is required
              if (blank['modelAns']) {
                // catch if ans is null
                if (!blank['ans']) {
                  // if ans is empty string, still let it pass
                  if (blank['ans'] !== '') {
                    // toast(`請完成第${counter}題`);
                    // return;
                    if (!unfinished.includes(counter)) {
                      unfinished.push(counter);
                    }
                  }
                }
              }
            }
          if (unfinished.includes(counter)) {
            break;
          }
        }
      }
      counter++;
    }

    if (unfinished.length > 0) {
      let temp = '';
      unfinished.map(Qindex => {
        temp = temp + ' ';
        temp = temp + Qindex.toString();
      });
      Toast.show({
        type: 'error',
        text1: '錯誤',
        text2: `請完成第${temp} 題`,
        visibilityTime: 1000,
      });
      return;
    }

    // first upload photos to DB
    UploadToDB(RealRealHW).then(() => {
      // after upload finish, use api to upload back the HWQ
      auth()
        .currentUser?.getIdToken()
        .then(token => {
          console.log('this is before submit from main function');

          const data = RealRealHW;
          const header = {headers: {'x-auth-token': token}};

          axios
            .post(
              `https://${AppID}.web.app/api/homework/submit/${SID}/${HWid}`,
              data,
              header,
            )
            .then(res => {
              console.log(res.data);
              setIsLoading(false);
              navigation.goBack();
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
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: '提交失敗',
            visibilityTime: 1000,
          });
        });
    });
  }, []);

  if (isLoading) {
    return <SpinLoader />;
  }

  return (
    <SafeWrapper key={key} customStyle={{backgroundColor: '#F8F8F8'}}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.BackButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-left" size={24} color={MYCOLOR.whiteSmoke} />
          <Text style={styles.BackButtonText}>退出練習</Text>
        </TouchableOpacity>
        <View style={styles.InfoWrapper}>
          {focus.map((topic: any, index: number) => (
            <Text numberOfLines={1} style={styles.TopicText} key={index}>
              {topic.chineseName}
            </Text>
          ))}
          <View style={styles.InfoDetailWrapper}>
            <Text style={styles.DetailText}>{QNum + '題'}</Text>
            <View style={styles.DateWrapper}>
              <Icon2 name="calendar-month-outline" size={20} color="#B2B2B2" />
              <Text style={styles.DetailText}>{daysOfDistribution}</Text>
            </View>
          </View>
        </View>
      </View>
      {RealHW.length > 0 && (
        <HWProgressBar
          ScrollToQ={ScrollToQ}
          curr={currQ}
          length={RealHW.length}
        />
      )}
      {RealHW.length > 0 && (
        <View style={styles.QWrapper}>
          <View style={styles.MiddleWrapper}>
            <FlatList
              data={RealHW}
              horizontal
              keyExtractor={item => item.id}
              initialScrollIndex={0}
              snapToInterval={widthPercentageToDP('100')}
              showsHorizontalScrollIndicator={false}
              decelerationRate={'fast'}
              initialNumToRender={RealHW.length}
              ref={flatListRef}
              onViewableItemsChanged={ViewableItemsChanged}
              viewabilityConfig={{
                itemVisiblePercentThreshold: 50,
              }}
              renderItem={({item, index}: {item: HWQ; index: number}) => {
                return (
                  <View style={styles.ListItem}>
                    <QuestionDisplay
                      sandwiches={item.sandwiches}
                      submit={SubmitHW}
                      camera={item.camera}
                      Qindex={index}
                      lastQ={index === QList.length - 1}
                      navigation={navigation}
                      photo={photoArray}
                    />
                  </View>
                );
              }}
            />
          </View>
        </View>
      )}
    </SafeWrapper>
  );

  async function UploadToDB(RealRealHW: {[id: string]: HWQ}) {
    setIsLoading(true);
    // upload all photo to firebase
    const photoPromise = photoArray.map(async (photo, index) => {
      // for (const [index, photo] of photoArray.entries()) {
      if (photo !== '') {
        // make var for storing photo path
        var photoPath =
          'res/' + SID + '/' + HWid + '/' + index.toString() + '.jpg';

        let PhotoCompressed = '';
        // compress the photo before upload

        PhotoCompressed = await Image.compress(photo, {
          compressionMethod: 'auto',
          input: 'uri',
          returnableOutputType: 'base64',
          quality: 0.4,
        });

        console.log('after compress photo');

        // upload to firebase storage if compress succeed
        if (PhotoCompressed) {
          // create ref
          const ImagesRef = Storage().ref(photoPath);
          var metadata = {
            contentType: 'image/jpeg',
          };
          // upload
          const res = await ImagesRef.putString(
            PhotoCompressed,
            'base64',
            metadata,
          );

          console.log('this is after upload' + photoPath);

          if (res) {
            // if upload succeed, also put the photopath inside the ansbook to be submitted
            const AnsObject = {
              type: 'ResImg',
              bread: {
                '1': photoPath,
              },
              layer: [1],
              fillings: [],
            };

            const myKey = Object.keys(RealRealHW)[index];
            if (RealRealHW) {
              if (RealRealHW[myKey].sandwiches) {
                RealRealHW[myKey].sandwiches.push(AnsObject);
                console.log('push jor a ans' + photoPath);
              }
            }
          }
        }
      }
    });

    await Promise.all(photoPromise);
    console.log('this is after upload all');
    console.log('from upload photo part: ' + RealRealHW);
  }
};

export default HWPage;

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
    width: 1,
    flex: 1,
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
  BackButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 1000,
    borderWidth: 2,
    borderColor: MYCOLOR.whiteSmoke,
    paddingHorizontal: '2%',
    marginBottom: '3%',
  },
  BackButtonText: {
    color: MYCOLOR.whiteSmoke,
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
    marginVertical: '3%',
  },
  TopicText: {
    fontSize: 28,
    fontFamily: myFont.GEN,
    color: MYCOLOR.lightGreen,
  },
  DetailText: {
    fontSize: 16,
    fontFamily: myFont.GEN,
    color: '#B2B2B2',
  },
});
