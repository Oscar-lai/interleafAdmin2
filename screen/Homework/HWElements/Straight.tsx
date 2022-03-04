import {transform} from '@babel/core';
import {customAlphabet} from 'nanoid/non-secure';
import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {Filling, Sandwich} from '../../../hooks/useHWQ';
import {MYCOLOR} from '../../../theme/typography';
import DeviceInfo from 'react-native-device-info';
import deviceInfoModule from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont();

interface IStraight {
  sandwich: Sandwich;
  ReadOnly: boolean;
  modelAns?: boolean;
}

export const Straight: React.FC<IStraight> = ({
  sandwich,
  ReadOnly,
  modelAns,
}) => {
  const bread = sandwich.bread;
  const filling = sandwich.fillings;
  const operators = sandwich.operator ?? [];
  const layer = sandwich.layer;

  const breadKey = Object.keys(bread);

  let breadCounter = 0;
  let fillingCounter = -1;

  const spacesTemp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const [spaces, setSpaces] = useState<number[]>(spacesTemp);

  // use for telling all the child to clear their state
  const [ClearDataDummy, setClearDataDummy] = useState<number>(0);

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  let maxLength = 0;

  breadKey.map((key: string) => {
    if (bread[key].length > maxLength) {
      maxLength = bread[key].length;
    }
  });

  const longest = useMemo(() => {
    let temp = 0;
    Object.values(bread).map(s => {
      if (s.length > temp) {
        temp = s.length;
      }
    });
    console.log(temp);
    return temp;
  }, []);

  return (
    <View style={styles.BigStraightWrapper}>
      <View style={styles.StraightWrapper}>
        {/* first map each layer, how many layer is there? */}
        {layer.map((l: any, index: number) => (
          <View style={styles.UpperStraightContainer} key={id + 'A' + index}>
            {/* then map each item inside the layer, how many no. is in this layer? */}
            {[...Array(l)].map((a, b) => (
              <React.Fragment key={id + 'B' + b}>
                {/* if this item is simply string */}
                {typeof bread[(++breadCounter).toString()] === 'string' && (
                  <View style={styles.StraightLineDisplay}>
                    {/* display input box if it is empty */}
                    {bread[breadCounter.toString()] === '' ? (
                      <StraightInputBox
                        modelAns={modelAns ?? false}
                        ReadOnly={ReadOnly}
                        filling={filling[++fillingCounter]}
                        clearIndicator={ClearDataDummy}
                      />
                    ) : (
                      // else display the actual value of item
                      [...Array(bread[breadCounter.toString()].length)].map(
                        (x, index) => (
                          <View style={styles.DummyWrapper} key={index}>
                            {bread[breadCounter][index] !== '.' && (
                              <View
                                style={[
                                  styles.DummySpace,
                                  {
                                    width: bread[breadCounter]
                                      .slice(index, bread[breadCounter].length)
                                      .includes('.')
                                      ? spaces[
                                          index +
                                            maxLength -
                                            bread[breadCounter].length
                                        ] > 0
                                        ? DeviceInfo.isTablet()
                                          ? 20
                                          : 14
                                        : 0
                                      : spaces[
                                          index +
                                            maxLength -
                                            bread[breadCounter].length -
                                            1
                                        ] > 0
                                      ? DeviceInfo.isTablet()
                                        ? 20
                                        : 14
                                      : 0,
                                  },
                                ]}
                              />
                            )}
                            <Text
                              style={[
                                styles.StraightText,
                                bread[breadCounter][index] === '.'
                                  ? {
                                      marginHorizontal: -6,
                                      width: 12,
                                    }
                                  : {},
                              ]}
                              key={id + index}>
                              {bread[breadCounter.toString()][index]}
                            </Text>
                          </View>
                        ),
                      )
                    )}
                  </View>
                )}
                {/* if this item is not string but array */}
                {Array.isArray(bread[breadCounter.toString()]) && (
                  <View style={styles.StraightLineDisplay}>
                    {/* map each item in the line */}
                    {bread[breadCounter.toString()].map(
                      (a: string, index: number) => (
                        <React.Fragment key={id + 'C' + index}>
                          {/* if this is " ", display input box */}
                          {a === '' ? (
                            <View style={styles.DummyWrapper} key={index}>
                              <View
                                style={[
                                  styles.DummySpace,
                                  {
                                    width:
                                      spaces[index - 1] > 0
                                        ? DeviceInfo.isTablet()
                                          ? 20
                                          : 16
                                        : 0,
                                  },
                                ]}
                              />
                              <SmallStraightInputBox
                                modelAns={modelAns ?? false}
                                ReadOnly={ReadOnly}
                                filling={filling[++fillingCounter]}
                                spaces={spaces}
                                setSpaces={setSpaces}
                                index={index}
                                clearIndicator={ClearDataDummy}
                              />
                            </View>
                          ) : (
                            // else display the actual value of item one by one
                            [...Array(a.length)].map((x, index) => (
                              <Text
                                key={index}
                                style={[
                                  styles.StraightText,
                                  bread[breadCounter][index] === '.'
                                    ? {
                                        marginHorizontal: -4,
                                        width: 12,
                                      }
                                    : {},
                                ]}>
                                {a[index]}
                              </Text>
                            ))
                          )}
                        </React.Fragment>
                      ),
                    )}
                  </View>
                )}
              </React.Fragment>
            ))}
            {/* after processing all item in this layer,
            display the operator and line if it is not the last layer */}
            {index !== layer.length - 1 &&
              (operators[index] === '' ? (
                <OperatorInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  filling={filling[++fillingCounter]}
                  clearIndicator={ClearDataDummy}
                />
              ) : (
                <Text
                  style={[
                    styles.Operator,
                    DeviceInfo.isTablet()
                      ? {right: longest * 58}
                      : {right: longest * 32},
                  ]}>
                  {operators[index]}
                </Text>
              ))}
            {index !== layer.length - 1 && (
              <View
                style={[
                  styles.Line,
                  DeviceInfo.isTablet()
                    ? {width: longest * 55 + 70}
                    : {width: longest * 32 + 50},
                ]}
              />
            )}
          </View>
        ))}
      </View>
      {!ReadOnly && (
        <TouchableOpacity
          style={styles.clearButtonWrapper}
          onPress={() => {
            setClearDataDummy(ClearDataDummy + 1);
            setSpaces(spacesTemp);
          }}>
          <Icon
            name="trash-bin"
            color={MYCOLOR.lightRed}
            size={DeviceInfo.isTablet() ? 40 : 27}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface IStraightInputs {
  filling: Filling;
  ReadOnly: boolean;
  modelAns: boolean;
  clearIndicator: number;
}

interface ISmallStraightInputs {
  filling: Filling;
  ReadOnly: boolean;
  modelAns: boolean;
  spaces: number[];
  setSpaces: (n: number[]) => void;
  index: number;
  clearIndicator: number;
}

const StraightInputBox: React.FC<IStraightInputs> = ({
  filling,
  ReadOnly,
  modelAns,
  clearIndicator,
}) => {
  const [myWidth, setMyWidth] = useState<string>('46px');
  const ans = modelAns ? filling.modelAns ?? '' : filling.ans ?? '';

  const [myAns, setMyAns] = useState(ans);

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  useEffect(() => {
    if (!ReadOnly) {
      setMyAns('');
      filling.ans = '';
    }
  }, [clearIndicator]);

  return (
    <TextInput
      style={[styles.StraightInput, modelAns ? {color: MYCOLOR.lightRed} : {}]}
      maxLength={5}
      value={myAns}
      editable={!ReadOnly}
      onChangeText={text => {
        setMyWidth((text.length * 22 + 2).toString() + 'px');
        setMyAns(text);
        filling.ans = text;
      }}
      id={id}
    />
  );
};

const SmallStraightInputBox: React.FC<ISmallStraightInputs> = ({
  filling,
  ReadOnly,
  modelAns,
  spaces,
  setSpaces,
  index,
  clearIndicator,
}) => {
  const ans = modelAns ? filling.modelAns ?? '' : filling.ans ?? '';

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  if (ans === '') {
    filling.ans = '';
  }

  const [myAns, setMyAns] = useState(ans);

  useEffect(() => {
    if (!ReadOnly) {
      setMyAns('');
      filling.ans = '';
    }
  }, [clearIndicator]);

  return (
    // <View
    //   style={[
    //     myAns === '.'
    //       ? {
    //           // marginLeft: DeviceInfo.isTablet() ? -2 : 0,
    //         }
    //       : {},
    //     {
    //       // zIndex: 800,
    //       // marginVertical: DeviceInfo.isTablet() ? 10 : 5,
    //       // marginHorizontal: DeviceInfo.isTablet() ? 8 : 4,
    //       backgroundColor: 'red',
    //     },
    //   ]}>
    <TextInput
      style={[
        styles.SmallStraightInput,
        modelAns ? {color: MYCOLOR.lightRed} : {},
        myAns === '.'
          ? {
              width: DeviceInfo.isTablet() ? 12 : 8,
              marginRight: DeviceInfo.isTablet() ? -18 : -12,
              marginLeft: DeviceInfo.isTablet() ? -2 : 0,
            }
          : {},
      ]}
      maxLength={1}
      editable={!ReadOnly}
      value={myAns}
      onChangeText={text => {
        setMyAns(text);
        filling.ans = text;
        if (text === '.') {
          let temp = spaces.slice(0);
          temp[index] = temp[index] + 1;
          setSpaces(temp);
        } else {
          let temp = spaces.slice(0);
          if (temp[index] > 0) {
            temp[index] = temp[index] - 1;
            setSpaces(temp);
          }
        }
      }}
      id={id}
    />
    // </View>
  );
};

const OperatorInput: React.FC<IStraightInputs> = ({
  filling,
  ReadOnly,
  modelAns,
  clearIndicator,
}) => {
  const ans = modelAns ? filling.modelAns ?? '' : filling.ans ?? '';
  const [myAns, setMyAns] = useState(ans);

  useEffect(() => {
    if (!ReadOnly) {
      setMyAns('');
      filling.ans = '';
    }
  }, [clearIndicator]);

  return (
    <TextInput
      style={[
        styles.OperatorInputBox,
        modelAns ? {color: MYCOLOR.lightRed} : {},
      ]}
      maxLength={1}
      editable={!ReadOnly}
      value={myAns}
      onChangeText={text => {
        setMyAns(text);
        filling.ans = text;
      }}
    />
  );
};

const styles = StyleSheet.create({
  StraightInput: {
    backgroundColor: 'transparent',
    textAlign: 'right',
    fontSize: DeviceInfo.isTablet() ? 45 : 30,
    maxWidth: DeviceInfo.isTablet() ? 200 : 130,
    minWidth: DeviceInfo.isTablet() ? 42 : 46,
    height: DeviceInfo.isTablet() ? 55 : 32,
    margin: DeviceInfo.isTablet() ? 8 : 4,
    letterSpacing: 4,
    color: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 16 : 12,
    padding: 0,
  },
  SmallStraightInput: {
    backgroundColor: '#FFF',
    textAlign: 'center',
    fontSize: DeviceInfo.isTablet() ? 45 : 30,
    fontFamily: 'Poppins-Bold',
    marginVertical: DeviceInfo.isTablet() ? 10 : 5,
    marginHorizontal: DeviceInfo.isTablet() ? 8 : 4,
    width: DeviceInfo.isTablet() ? 42 : 24,
    height: DeviceInfo.isTablet() ? 55 : 36,
    color: '#707070',
    borderRadius: DeviceInfo.isTablet() ? 10 : 8,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 5 : 3,
    shadowOpacity: 0.2,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    padding: 0,
  },
  BigStraightWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    marginTop: DeviceInfo.isTablet() ? 30 : 15,
  },
  StraightWrapper: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  UpperStraightContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: DeviceInfo.isTablet() ? 75 : 50,
    marginBottom: DeviceInfo.isTablet() ? 15 : 10,
    position: 'relative',
    width: 'auto',
  },
  Operator: {
    position: 'absolute',
    bottom: DeviceInfo.isTablet() ? 16 : 12,
    width: DeviceInfo.isTablet() ? 45 : 30,
    height: DeviceInfo.isTablet() ? 45 : 30,
    fontSize: DeviceInfo.isTablet() ? 45 : 30,
    lineHeight: DeviceInfo.isTablet() ? 45 : 30,
    color: '#909090',
    fontFamily: 'Poppins-Bold',
  },
  OperatorInputBox: {
    color: '#909090',
    fontFamily: 'Poppins-Bold',
    position: 'absolute',
    bottom: DeviceInfo.isTablet() ? 28 : 18,
    left: DeviceInfo.isTablet() ? 0 : 5,
    width: DeviceInfo.isTablet() ? 45 : 30,
    height: DeviceInfo.isTablet() ? 45 : 30,
    fontSize: DeviceInfo.isTablet() ? 35 : 25,
    borderRadius: 50,
    textAlign: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.2,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    padding: 0,
  },
  StraightText: {
    margin: DeviceInfo.isTablet() ? 10 : 5,
    width: DeviceInfo.isTablet() ? 35 : 22,
    fontSize: DeviceInfo.isTablet() ? 45 : 30,

    height: DeviceInfo.isTablet() ? 70 : 42,
    letterSpacing: 6,
    color: '#707070',
    fontFamily: 'Poppins-Bold',
    textAlign: 'right',
  },
  StraightLineDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: DeviceInfo.isTablet() ? 18 : 12,
    height: DeviceInfo.isTablet() ? 70 : 42,
    flexShrink: 0,
  },
  OperatorLineContainer: {
    height: DeviceInfo.isTablet() ? 7 : 4,
  },
  Line: {
    position: 'absolute',
    width: '100%',
    height: DeviceInfo.isTablet() ? 7 : 4,
    backgroundColor: '#909090',
    bottom: 0,
    right: 0,
    borderRadius: 20,
  },
  DummyWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  DummySpace: {
    height: DeviceInfo.isTablet() ? 55 : 36,
  },
  clearButtonWrapper: {
    width: DeviceInfo.isTablet() ? 50 : 30,
    height: DeviceInfo.isTablet() ? 50 : 30,
    marginLeft: DeviceInfo.isTablet() ? 40 : 30,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
