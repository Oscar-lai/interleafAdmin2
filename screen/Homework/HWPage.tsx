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
import useHWQ, {HWQ, Sandwich} from '../../hooks/useHWQ';
import QuestionDisplay from './HWDisplay';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {AppID} from '../../firebase/Config';
import {Image} from 'react-native-compressor';
import {SpinLoader} from '../../components/SpinLoader';
Icon2.loadFont();
import DeviceInfo from 'react-native-device-info';
import HWBanner from './HWBanner';

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

  //to indicate the working progress
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

    //set up the progress array
    if (!qStatus.length) {
      let progress = Array(RealHW.length).fill(null);
      setQStatus(progress);
    }
  }, [QList]);

  function pureStraight(sandwiches: Sandwich[]) {
    let output = true;
    for (let line of sandwiches) {
      if (!line.type.includes('string') && line.type !== 'straight') {
        output = false;
        break;
      }
    }
    return output;
  }

  //function for checking whether all the questions have been done
  function checkAllDone(sandwiches: Sandwich[]) {
    let allFilled = true;
    for (let line of sandwiches) {
      if (line.fillings.length) {
        for (let blank of line.fillings) {
          // if an ans is required
          if (blank.modelAns) {
            // catch if ans is null
            let notDone;
            if (typeof blank.modelAns === 'object') {
              //if the ans is Array
              if (Array.isArray(blank.modelAns)) {
                notDone = !blank.ans || !blank.ans.length;
              } else {
                //if the ans is object
                notDone = !blank.ans || !Object.keys(blank.ans).length;
              }
            } else {
              //string type ans
              notDone = !blank.ans && blank.ans !== '';
            }
            if (notDone) {
              allFilled = false;
            }
          }
          //check the subfilling
          if (blank.sub_fillings && blank.sub_fillings.length) {
            for (let subFilling of blank.sub_fillings) {
              if (subFilling.modelAns) {
                // catch if ans is null
                if (!subFilling.ans && subFilling.ans !== '') {
                  allFilled = false;
                }
              }
            }
          }
        }
      }
      if (!allFilled) {
        break;
      }
    }
    if (allFilled) {
      return true;
    }
    return false;
  }

  //Every time go to next question-> the status array will be updated for the progress bar
  useEffect(() => {
    let progress = [...qStatus];
    RealHW.forEach((hwq, qIndex) => {
      let done = false;
      let straightType = pureStraight(hwq.sandwiches);
      if (hwq.camera === false) {
        //skip the straight
        if (!straightType) {
          done = checkAllDone(hwq.sandwiches);
        }
        //unless you check on this q, striaght will be shown as done
        else if (qIndex === currQ) {
          done = true;
        }
      } else {
        if (photoArray[qIndex] !== '') {
          done = true;
        }
      }

      if (done) {
        progress[qIndex] = 1;
      }
    });
    setQStatus(progress);
  }, [currQ]);

  //API for submitting homework
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
    RealHW.map(hwq => {
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
      if (RealRealHW[questionId].camera === false) {
        let done = checkAllDone(RealRealHW[questionId].sandwiches);
        if (!done) {
          unfinished.push(counter);
        }
      }
      counter++;
    }

    if (unfinished.length > 0) {
      let temp = '';
      unfinished.map(Qindex => {
        temp += '、';
        temp += Qindex.toString();
      });
      // remove first char, since we add an extra '、' at first
      temp = temp.substring(1);

      Toast.show({
        type: 'error',
        text1: '錯誤',
        text2: `請先完成第${temp} 題`,
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

  return (
    <SafeWrapper key={key} customStyle={{backgroundColor: '#F8F8F8'}}>
      {isLoading && <SpinLoader />}
      <HWBanner
        goBack={() => navigation.goBack()}
        focus={focus}
        QNum={QNum}
        daysOfDistribution={daysOfDistribution}
      />
      {RealHW.length > 0 && (
        <HWProgressBar
          ScrollToQ={ScrollToQ}
          curr={currQ}
          length={RealHW.length}
          statusArray={qStatus}
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
});
