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

interface IMcAns {
  filling: Filling;
  ReadOnly: boolean;
  condition?: (n: number) => void;
}
export const MCAns: React.FC<IMcAns> = ({filling, ReadOnly, condition}) => {
  const type = filling.type;

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
        {ansArray.map((ans: any, index: number) => (
          <TouchableOpacity
            disabled={ReadOnly}
            style={[
              styles.LabelContainer,
              styles.BoxContainer,
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
                myAns === ans
                  ? {
                      color: '#B5CD33',
                    }
                  : {},
              ]}>
              {LabelMap[index]}
            </Text>
            <Text
              style={[
                styles.McAnsText,
                myAns === ans
                  ? {
                      color: '#B5CD33',
                    }
                  : {},
              ]}>
              {ans}
            </Text>
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
                myAns === ans
                  ? {
                      color: '#B5CD33',
                    }
                  : {},
              ]}>
              {LabelMap[index]}
            </Text>
            <View style={styles.FractionContainer}>
              <Fraction
                ReadOnly={ReadOnly}
                color={myAns === ans ? '#B5CD33' : undefined}
                fillings={{food: [ans]}}
              />
            </View>
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
                myAns === ans
                  ? {
                      color: '#B5CD33',
                      marginRight: 0,
                    }
                  : {marginRight: 0},
              ]}>
              {LabelMap[index]}
            </Text>
            {Object.keys(ans).map((key: any, index2: number) => (
              <View style={styles.FractionContainer} key={index + index2 + id}>
                {typeof ans[key] === 'string' ? (
                  <Text
                    style={[
                      styles.McAnsText,
                      myAns === ans
                        ? {
                            color: '#B5CD33',
                          }
                        : {},
                    ]}>
                    {ans[key]}
                  </Text>
                ) : (
                  <Fraction
                    ReadOnly={ReadOnly}
                    color={myAns === ans ? '#B5CD33' : undefined}
                    fillings={{food: [ans[key]]}}
                  />
                )}
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </View>
    );
  } else if (type === 'mcStringPig') {
    return (
      <View style={styles.MCAnsContainer}>
        {ansArray.map((ans: any, index: number) => (
          <TouchableOpacity
            disabled={ReadOnly}
            style={[
              styles.LabelContainer,
              styles.StringPigContainer,
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
    width: widthPercentageToDP('100%') - 90,
    paddingHorizontal: 10,
  },
  LabelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: widthPercentageToDP('100%') - 110,
    flexWrap: 'wrap',
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 2,
    backgroundColor: '#FFF',
    borderWidth: 5,
    borderColor: '#FFF',
  },
  BoxContainer: {
    height: 55,
    borderRadius: 50,
    paddingHorizontal: 22,
    marginBottom: 25,
  },
  FracContainer: {
    height: 70,
    borderRadius: 50,
    paddingHorizontal: 22,
    marginBottom: 25,
  },
  PigContainer: {
    height: heightPercentageToDP('12%'),
    borderRadius: 20,
    paddingHorizontal: 22,
    marginBottom: 25,
  },
  StringPigContainer: {
    height: heightPercentageToDP('25%'),
    width: widthPercentageToDP('33%'),
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 25,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  McAnsText: {
    fontSize: 20,
    lineHeight: 45,
    fontFamily: 'Poppins-Bold',
    color: '#707070',
    textAlign: 'center',
  },
  McAnsLabel: {
    fontSize: 20,
    marginTop: 15,
    lineHeight: 30,
    fontFamily: 'Poppins-ExtraBold',
    color: '#909090',
    textAlign: 'center',
    marginRight: 32,
  },
  StringPigAnsLabel: {
    fontSize: 20,
    marginTop: 5,
    lineHeight: 30,
    fontFamily: 'Poppins-ExtraBold',
    color: '#909090',
    width: '100%',
  },
  FractionContainer: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
