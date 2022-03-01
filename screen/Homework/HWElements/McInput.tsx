import React, {useState} from 'react';

import {Filling} from '../../../hooks/useHWQ';
import {customAlphabet} from 'nanoid/non-secure';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MCImageDisplay} from './McImageDisplay';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Fraction from './Fraction';

import DeviceInfo from 'react-native-device-info';
import QuestionText from './HWComponent/QuestionText';
import {checkAns} from '../../../helper/checkAns';
import {MYCOLOR} from '../../../theme/typography';

interface IMcAns {
  filling: Filling;
  ReadOnly: boolean;
  condition?: (n: number) => void;
  correction?: boolean;
}
interface ISpecialString {
  type: string;
  food: string;
  indexes: number[];
}

//edit below if there is anything special to add on the fraction
//function to cater different style inside fraction
export function specialStyle(type: string) {
  if (type === 'italic') {
    return styles.textItalic;
  } else {
    return {};
  }
}

export const MCAns: React.FC<IMcAns> = ({
  filling,
  ReadOnly,
  condition,
  correction,
}) => {
  const type = filling.type;
  const modelAns = filling.modelAns;
  const ansArray = filling.food;
  var McAns = filling.ans;

  const [myAns, setMyAns] = useState(McAns);

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  const LabelMap = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  if (type === 'mcPig') {
    return (
      <View style={styles.MCAnsContainer}>
        {ansArray.map((ans: any, index: number) => (
          <TouchableOpacity
            disabled={ReadOnly}
            style={[
              styles.LabelContainer,
              styles.PigContainer,
              correction && modelAns === ans
                ? {borderColor: MYCOLOR.lightRed}
                : {},
              myAns === ans
                ? {
                    borderColor: '#B5CD33',
                  }
                : {},
            ]}
            key={index.toString() + ans}
            onPress={() => {
              setMyAns(ans);
              filling.ans = ans;
              // if this is the top part of conditioner
              // set the Dummy useStat to a random number for refreshing the dom
              if (condition) {
                condition(Math.random());
              }
            }}>
            <Text
              style={[
                styles.McAnsLabel,
                correction && checkAns(modelAns, ans)
                  ? {color: MYCOLOR.lightRed}
                  : {},
                myAns === ans
                  ? {
                      color: '#B5CD33',
                      marginRight: 0,
                    }
                  : {marginRight: 0},
              ]}>
              {LabelMap[index]}
            </Text>
            <MCImageDisplay url={ans} />
          </TouchableOpacity>
        ))}
      </View>
    );
  } else if (type === 'mcBox') {
    return (
      <View style={styles.MCAnsContainer}>
        {ansArray.map((ans: string | ISpecialString, index: number) => (
          <TouchableOpacity
            disabled={ReadOnly}
            style={[
              styles.LabelContainer,
              styles.BoxContainer,
              correction && checkAns(modelAns, ans)
                ? {borderColor: MYCOLOR.lightRed}
                : {},
              checkAns(myAns, ans)
                ? {
                    borderColor: '#B5CD33',
                  }
                : {},
            ]}
            key={index.toString() + ans}
            onPress={() => {
              setMyAns(ans);
              filling.ans = ans;
              // if this is the top part of conditioner
              // set the Dummy useStat to a random number for refreshing the dom
              if (condition) {
                condition(Math.random());
              }
            }}>
            <Text
              style={[
                styles.McAnsLabel,
                correction && checkAns(modelAns, ans)
                  ? {color: MYCOLOR.lightRed}
                  : {},
                checkAns(myAns, ans)
                  ? {
                      color: '#B5CD33',
                    }
                  : {},
              ]}>
              {LabelMap[index]}
            </Text>
            <View style={styles.mcTextContainer}>
              <QuestionText
                style={[
                  styles.McAnsText,
                  correction && checkAns(modelAns, ans)
                    ? {color: MYCOLOR.lightRed}
                    : {},
                  checkAns(myAns, ans)
                    ? {
                        color: '#B5CD33',
                      }
                    : {},
                ]}
                specialChracterIndex={
                  typeof ans === 'object' ? ans.indexes : undefined
                }
                specialStyle={
                  typeof ans === 'object'
                    ? specialStyle(ans.type)
                    : {fontSize: DeviceInfo.isTablet() ? 37 : 26}
                }
                WithinOneLine>
                {typeof ans === 'object' ? ans.food : ans}
              </QuestionText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  } else if (type === 'mcFrac') {
    return (
      <View style={styles.MCAnsContainer}>
        {ansArray.map((ans: any, index: number) => (
          <TouchableOpacity
            disabled={ReadOnly}
            style={[
              styles.LabelContainer,
              styles.FracContainer,
              correction && checkAns(modelAns, ans)
                ? {borderColor: MYCOLOR.lightRed}
                : {},
              checkAns(myAns, ans)
                ? {
                    borderColor: '#B5CD33',
                  }
                : {},
            ]}
            key={index.toString() + ans}
            onPress={() => {
              setMyAns(ans);
              filling.ans = ans;
              // if this is the top part of conditioner
              // set the Dummy useStat to a random number for refreshing the dom
              if (condition) {
                condition(Math.random());
              }
            }}>
            <Text
              style={[
                styles.McAnsLabel,
                correction && checkAns(modelAns, ans)
                  ? {color: MYCOLOR.lightRed}
                  : {},
                checkAns(myAns, ans)
                  ? {
                      color: '#B5CD33',
                    }
                  : {},
              ]}>
              {LabelMap[index]}
            </Text>
            {typeof ans === 'string' ? (
              <View style={styles.mcTextContainer}>
                <Text
                  style={[
                    styles.McAnsText,
                    {marginLeft: DeviceInfo.isTablet() ? 15 : 8},
                    correction && checkAns(modelAns, ans)
                      ? {color: MYCOLOR.lightRed}
                      : {},
                    checkAns(myAns, ans)
                      ? {
                          color: '#B5CD33',
                        }
                      : {},
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
                  {ans}
                </Text>
              </View>
            ) : ans.denominator ? (
              <View style={styles.FractionContainer}>
                <Fraction
                  ReadOnly={ReadOnly}
                  color={
                    checkAns(myAns, ans)
                      ? '#B5CD33'
                      : correction && checkAns(modelAns, ans)
                      ? MYCOLOR.lightRed
                      : undefined
                  }
                  fillings={{food: [ans]}}
                  bold
                />
              </View>
            ) : (
              <View style={styles.mcTextContainer}>
                <QuestionText
                  style={[
                    styles.McAnsText,
                    correction && checkAns(modelAns, ans)
                      ? {color: MYCOLOR.lightRed}
                      : {},
                    checkAns(myAns, ans)
                      ? {
                          color: '#B5CD33',
                        }
                      : {},
                  ]}
                  containerStyle={{
                    marginLeft: DeviceInfo.isTablet() ? 15 : 8,
                  }}
                  specialChracterIndex={ans.indexes}
                  specialStyle={specialStyle(ans.type)}
                  WithinOneLine>
                  {ans.food}
                </QuestionText>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  } else if (type === 'mcStringFrac') {
    return (
      <View style={styles.MCAnsContainer}>
        {ansArray.map((ans: any, index: number) => (
          <TouchableOpacity
            disabled={ReadOnly}
            style={[
              styles.LabelContainer,
              styles.FracContainer,
              correction && checkAns(modelAns, ans)
                ? {borderColor: MYCOLOR.lightRed}
                : {},
              checkAns(myAns, ans)
                ? {
                    borderColor: '#B5CD33',
                  }
                : {},
            ]}
            key={index.toString() + ans}
            onPress={() => {
              setMyAns(ans);
              filling.ans = ans;
              // if this is the top part of conditioner
              // set the Dummy useStat to a random number for refreshing the dom
              if (condition) {
                condition(Math.random());
              }
            }}>
            <Text
              style={[
                styles.McAnsLabel,
                correction && checkAns(modelAns, ans)
                  ? {color: MYCOLOR.lightRed}
                  : {},
                checkAns(myAns, ans)
                  ? {
                      color: '#B5CD33',
                    }
                  : {},
              ]}>
              {LabelMap[index]}
            </Text>
            {Object.keys(ans).map((key: any, index2: number) => (
              <View style={styles.FractionContainer} key={index + index2 + id}>
                {typeof ans[key] === 'string' ? (
                  <QuestionText
                    style={[
                      styles.McAnsText,
                      correction && checkAns(modelAns, ans)
                        ? {color: MYCOLOR.lightRed}
                        : {},
                      checkAns(myAns, ans)
                        ? {
                            color: '#B5CD33',
                          }
                        : {},
                    ]}
                    specialStyle={{fontSize: DeviceInfo.isTablet() ? 37 : 26}}
                    containerStyle={
                      index2 === 0
                        ? {marginLeft: DeviceInfo.isTablet() ? 15 : 8}
                        : {}
                    }>
                    {ans[key]}
                  </QuestionText>
                ) : ans[key].denominator ? (
                  <Fraction
                    ReadOnly={ReadOnly}
                    color={
                      checkAns(myAns, ans)
                        ? '#B5CD33'
                        : correction && checkAns(modelAns, ans)
                        ? MYCOLOR.lightRed
                        : undefined
                    }
                    fillings={{food: [ans[key]]}}
                    bold
                  />
                ) : (
                  <QuestionText
                    style={[
                      styles.McAnsText,
                      correction && checkAns(modelAns, ans)
                        ? {color: MYCOLOR.lightRed}
                        : {},
                      checkAns(myAns, ans)
                        ? {
                            color: '#B5CD33',
                          }
                        : {},
                    ]}
                    containerStyle={
                      index2 === 0
                        ? {marginLeft: DeviceInfo.isTablet() ? 15 : 8}
                        : {}
                    }
                    specialChracterIndex={ans[key].indexes}
                    specialStyle={specialStyle(ans[key].type)}>
                    {ans[key].food}
                  </QuestionText>
                )}
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </View>
    );
  } else if (type === 'mcStringPig') {
    return (
      <View
        style={[
          styles.MCAnsContainer,
          {paddingHorizontal: DeviceInfo.isTablet() ? '15%' : 10},
        ]}>
        {ansArray.map((ans: any, index: number) => (
          <TouchableOpacity
            disabled={ReadOnly}
            style={[
              styles.LabelContainer,
              styles.StringPigContainer,
              correction && modelAns.img === ans.img
                ? {borderColor: MYCOLOR.lightRed}
                : {},
              myAns?.img === ans.img
                ? {
                    borderColor: '#B5CD33',
                  }
                : {},
            ]}
            key={index.toString() + ans}
            onPress={() => {
              setMyAns(ans);
              filling.ans = ans;
              // if this is the top part of conditioner
              // set the Dummy useStat to a random number for refreshing the dom
              if (condition) {
                condition(Math.random());
              }
            }}>
            <Text
              style={[
                styles.StringPigAnsLabel,
                correction && checkAns(modelAns, ans)
                  ? {color: MYCOLOR.lightRed}
                  : {},
                myAns === ans
                  ? {
                      color: '#B5CD33',
                      marginRight: 0,
                    }
                  : {marginRight: 0},
              ]}>
              {LabelMap[index]}
            </Text>
            <MCImageDisplay url={ans.img} />
            <Text
              style={[
                styles.McAnsText,
                correction && checkAns(modelAns, ans)
                  ? {color: MYCOLOR.lightRed}
                  : {},
                myAns === ans
                  ? {
                      color: '#B5CD33',
                    }
                  : {},
              ]}>
              {ans.string}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  MCAnsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: DeviceInfo.isTablet()
      ? widthPercentageToDP('85%')
      : widthPercentageToDP('100%') - 90,
    paddingHorizontal: DeviceInfo.isTablet() ? 25 : 10,
  },
  LabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: DeviceInfo.isTablet() ? 'flex-start' : 'center',
    width: DeviceInfo.isTablet()
      ? widthPercentageToDP('60%')
      : widthPercentageToDP('100%') - 110,
    flexWrap: 'wrap',
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.2,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    backgroundColor: '#FFF',
    borderWidth: DeviceInfo.isTablet() ? 10 : 5,
    borderColor: '#FFF',
    // backgroundColor: 'black',
  },
  BoxContainer: {
    height: DeviceInfo.isTablet() ? 85 : 55,
    borderRadius: 50,
    paddingHorizontal: DeviceInfo.isTablet() ? 30 : 22,
    marginBottom: DeviceInfo.isTablet() ? 35 : 25,
    marginLeft: DeviceInfo.isTablet() ? widthPercentageToDP('12.5%') - 25 : 0,
  },
  FracContainer: {
    height: DeviceInfo.isTablet() ? 90 : 70,
    borderRadius: 50,
    paddingHorizontal: DeviceInfo.isTablet() ? 30 : 22,
    marginBottom: DeviceInfo.isTablet() ? 35 : 25,
    marginLeft: DeviceInfo.isTablet() ? widthPercentageToDP('12.5%') - 25 : 0,
  },
  PigContainer: {
    height: DeviceInfo.isTablet()
      ? heightPercentageToDP('16%')
      : heightPercentageToDP('12%'),
    borderRadius: DeviceInfo.isTablet() ? 35 : 20,
    paddingLeft: DeviceInfo.isTablet() ? 15 : 22,
    marginBottom: DeviceInfo.isTablet() ? 35 : 25,
    width: DeviceInfo.isTablet()
      ? widthPercentageToDP('37%')
      : widthPercentageToDP('100%') - 110,
  },
  StringPigContainer: {
    height: DeviceInfo.isTablet()
      ? widthPercentageToDP('37%')
      : heightPercentageToDP('25%'),
    width: DeviceInfo.isTablet()
      ? widthPercentageToDP('28%')
      : widthPercentageToDP('33%'),
    borderRadius: DeviceInfo.isTablet() ? 35 : 20,
    paddingHorizontal: 10,
    marginBottom: DeviceInfo.isTablet() ? 35 : 25,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  McAnsText: {
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
    lineHeight: DeviceInfo.isTablet() ? 68 : 43,
    height: DeviceInfo.isTablet() ? 70 : 45,
    fontFamily: 'Poppins-Bold',
    color: '#707070',
    textAlign: 'center',
    // backgroundColor: 'gray',
  },
  McAnsLabel: {
    fontSize: DeviceInfo.isTablet() ? 30 : 20,
    marginTop: 15,
    lineHeight: DeviceInfo.isTablet() ? 40 : 30,
    fontFamily: 'Poppins-ExtraBold',
    color: '#909090',
    textAlign: 'center',
    marginRight: DeviceInfo.isTablet() ? 35 : 20,
    // backgroundColor: 'black',
  },
  StringPigAnsLabel: {
    fontSize: DeviceInfo.isTablet() ? 30 : 20,
    marginTop: 5,
    lineHeight: DeviceInfo.isTablet() ? 40 : 30,
    fontFamily: 'Poppins-ExtraBold',
    color: '#909090',
    width: '100%',
  },
  FractionContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor:'black',
    // flex: 1,
  },
  mcTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    // backgroundColor: 'black',
  },
  textItalic: {
    fontSize: DeviceInfo.isTablet() ? 32 : 22,
    fontFamily: 'Poppins-Italic',
  },
});
