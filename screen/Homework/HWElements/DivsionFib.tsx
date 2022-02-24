import {customAlphabet} from 'nanoid/non-secure';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {MYCOLOR} from '../../../theme/typography';
import DeviceInfo from 'react-native-device-info';

interface IDivisionFib {
  sandwich: {
    bread: {
      [id: string]: any;
    };
    fillings: any[];
    operators?: string;
    layer: number[];
  };
  modelAns?: boolean;
  ReadOnly: boolean;
}

export const DivisionFib: React.FC<IDivisionFib> = ({
  sandwich,
  ReadOnly,
  modelAns,
}) => {
  let fillingCounter = -1;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );
  const [id2] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );
  const [id3] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );
  const [id4] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  const myKeys = Object.keys(sandwich.bread);

  return (
    <View style={styles.BigWrapper}>
      <View style={styles.DivisionWrapper}>
        {/* First layers is the quotient(answer) at the top */}
        <View style={styles.QuotientWrapper}>
          <View style={styles.Wrapper}>
            {typeof sandwich.bread['1'] === 'string' &&
              [...Array(sandwich.bread['1'].length)].map((x, index) => (
                <Text style={styles.DivisionText} key={index}>
                  {sandwich.bread['1'][index]}
                </Text>
              ))}
            {Array.isArray(sandwich.bread['1']) &&
              sandwich.bread['1'].map((x, index) =>
                x === '' ? (
                  <SmallDivisionInput
                    modelAns={modelAns ?? false}
                    ReadOnly={ReadOnly}
                    key={id + index}
                    fill={sandwich.fillings[++fillingCounter]}
                  />
                ) : x === '-' ? (
                  <Text style={styles.DivisionText} key={id + index}>
                    &nbsp;
                  </Text>
                ) : (
                  <Text style={styles.DivisionText} key={id + index}>
                    {x}
                  </Text>
                ),
              )}
          </View>
        </View>
        {/* Two layers are in the middle */}
        <View style={styles.MiddleWrapper}>
          {/* one the left is the divisor */}
          <View style={styles.DivisorWrapper}>
            {typeof sandwich.bread['2'] === 'string' && (
              <Text style={styles.DivisionText}>{sandwich.bread['2']}</Text>
            )}
            {Array.isArray(sandwich.bread['2']) &&
              sandwich.bread['2'].map((x, index) =>
                x === '' ? (
                  <SmallDivisionInput
                    modelAns={modelAns ?? false}
                    ReadOnly={ReadOnly}
                    key={id2 + index}
                    fill={sandwich.fillings[++fillingCounter]}
                  />
                ) : x === '-' ? (
                  <Text style={styles.DivisionText} key={id2 + index}>
                    &nbsp;
                  </Text>
                ) : (
                  <Text style={styles.DivisionText} key={id2 + index}>
                    {x}
                  </Text>
                ),
              )}
          </View>
          {/* one the right is the dividend */}
          <View style={styles.DividendWrapper}>
            {typeof sandwich.bread['3'] === 'string' &&
              [...Array(sandwich.bread['3'].length)].map((x, index) => (
                <Text style={styles.DivisionText} key={index}>
                  {sandwich.bread['3'][index]}
                </Text>
              ))}
            {Array.isArray(sandwich.bread['3']) &&
              sandwich.bread['3'].map((x, index) =>
                x === '' ? (
                  <SmallDivisionInput
                    modelAns={modelAns ?? false}
                    ReadOnly={ReadOnly}
                    key={id3 + index}
                    fill={sandwich.fillings[++fillingCounter]}
                  />
                ) : x === '-' ? (
                  <Text style={styles.DivisionText} key={id3 + index}>
                    &nbsp;
                  </Text>
                ) : (
                  <Text style={styles.DivisionText} key={id3 + index}>
                    {x}
                  </Text>
                ),
              )}
          </View>
        </View>
        {/* all the remaining layers are displayed one by one */}
        {[...Array(myKeys.length - 3)].map((x, index) => (
          <View style={styles.QuotientWrapper} key={id4 + index + 'aaaa'}>
            <View style={styles.Wrapper} key={id4 + index}>
              {typeof sandwich.bread[myKeys[index + 3]] === 'string' &&
                [...Array(sandwich.bread[myKeys[index + 3]].length)].map(
                  (x, index2) => (
                    <Text
                      style={styles.DivisionText}
                      key={id4 + index + index2}>
                      {sandwich.bread[myKeys[index + 3]][index2]}
                    </Text>
                  ),
                )}
              {Array.isArray(sandwich.bread[myKeys[index + 3]]) &&
                sandwich.bread[myKeys[index + 3]].map(
                  (x: string, index3: number) =>
                    x === '' ? (
                      <SmallDivisionInput
                        modelAns={modelAns ?? false}
                        ReadOnly={ReadOnly}
                        key={index + id4 + index3}
                        fill={sandwich.fillings[++fillingCounter]}
                      />
                    ) : x === '-' ? (
                      <Text
                        style={styles.DivisionText}
                        key={index + id4 + index3}>
                        &nbsp;
                      </Text>
                    ) : (
                      <Text
                        style={styles.DivisionText}
                        key={index + id4 + index3}>
                        {x}
                      </Text>
                    ),
                )}
            </View>
            {index % 2 !== 1 && (
              <View
                style={[
                  styles.Line,
                  DeviceInfo.isTablet()
                    ? {width: sandwich.bread[myKeys[index + 3]].length * 53}
                    : {width: sandwich.bread[myKeys[index + 3]].length * 30},
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

interface IDivisionInputBox {
  fill: {
    type: string;
    food: string;
    length: number;
    modelAns: string;
    ans?: any;
  };
  modelAns: boolean;
  ReadOnly: boolean;
}

const SmallDivisionInput: React.FC<IDivisionInputBox> = ({
  fill,
  ReadOnly,
  modelAns,
}) => {
  const ans = modelAns ? fill.modelAns ?? '' : fill.ans ?? '';
  const [myAns, setMyAns] = useState(ans);

  return (
    <TextInput
      style={[
        styles.SmallDivisionInputBox,
        modelAns ? {color: MYCOLOR.lightRed} : {},
      ]}
      editable={!ReadOnly}
      maxLength={1}
      value={myAns}
      onChangeText={text => {
        setMyAns(text);
        fill.ans = text;
      }}
    />
  );
};

const styles = StyleSheet.create({
  BigWrapper: {
    marginTop: DeviceInfo.isTablet() ? 30 : 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DivisionWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginRight: '10%',
  },
  QuotientWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  MiddleWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: DeviceInfo.isTablet() ? 10 : 5,
  },
  Wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  OpacityWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  DividendWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: DeviceInfo.isTablet() ? 0 : 1,
    borderTopWidth: DeviceInfo.isTablet() ? 5 : 3,
    borderTopColor: '#707070',
    borderBottomColor: 'transparent',
    paddingLeft: DeviceInfo.isTablet() ? 10 : 5,
  },
  DivisorWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: DeviceInfo.isTablet() ? 5 : 3,
    borderRightColor: '#707070',
    borderBottomRightRadius: DeviceInfo.isTablet() ? 20 : 12,
    paddingHorizontal: DeviceInfo.isTablet() ? 8 : 5,
    marginRight: -2,
    marginTop: -2,
    paddingVertical: DeviceInfo.isTablet() ? 5 : 0,
  },
  DivisionText: {
    margin: DeviceInfo.isTablet() ? 10 : 5,
    width: DeviceInfo.isTablet() ? 35 : 22,
    fontSize: DeviceInfo.isTablet() ? 45 : 30,

    color: '#707070',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  SmallDivisionInputBox: {
    backgroundColor: '#FFF',
    textAlign: 'center',
    fontSize: DeviceInfo.isTablet() ? 45 : 30,
    fontFamily: 'Poppins-Bold',
    marginVertical: DeviceInfo.isTablet() ? 10 : 5,
    marginHorizontal: DeviceInfo.isTablet() ? 8 : 4,
    width: DeviceInfo.isTablet() ? 40 : 24,
    height: DeviceInfo.isTablet() ? 55 : 43,
    color: '#707070',
    borderRadius: DeviceInfo.isTablet() ? 10 : 8,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 5 : 3,
    shadowOpacity: 0.5,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    padding: 0,
  },
  Line: {
    height: DeviceInfo.isTablet() ? 6 : 3,
    backgroundColor: '#707070',
    marginVertical: DeviceInfo.isTablet() ? 9 : 5,
    transform: [{translateX: -2}],
    borderRadius: 20,
  },
});
