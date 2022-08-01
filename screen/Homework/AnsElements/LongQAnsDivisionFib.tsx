import {customAlphabet} from 'nanoid/non-secure';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
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
}

export const LongQAnsDivisionFib: React.FC<IDivisionFib> = ({sandwich}) => {
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
                x === '-' ? (
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
                x === '-' ? (
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
                x === '-' ? (
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
                    x === '-' ? (
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
                    ? {width: sandwich.bread[myKeys[index + 3]].length * 30}
                    : {width: sandwich.bread[myKeys[index + 3]].length * 18},
                ]}
              />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  BigWrapper: {
    marginTop: DeviceInfo.isTablet() ? 18 : 9,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
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
    marginTop: DeviceInfo.isTablet() ? 6 : 3,
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
    borderTopWidth: DeviceInfo.isTablet() ? 5 : 2,
    borderTopColor: MYCOLOR.lightRed,
    borderBottomColor: 'transparent',
    paddingLeft: DeviceInfo.isTablet() ? 6 : 3,
  },
  DivisorWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: DeviceInfo.isTablet() ? 3 : 2,
    borderRightColor: MYCOLOR.lightRed,
    borderBottomRightRadius: DeviceInfo.isTablet() ? 12 : 7,
    paddingHorizontal: DeviceInfo.isTablet() ? 5 : 3,
    marginRight: DeviceInfo.isTablet() ? -3 : -2,
  },
  DivisionText: {
    margin: DeviceInfo.isTablet() ? 6 : 3,
    width: DeviceInfo.isTablet() ? 19 : 13,
    fontSize: DeviceInfo.isTablet() ? 24 : 18,

    color: MYCOLOR.lightRed,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  Line: {
    height: DeviceInfo.isTablet() ? 4 : 2,
    backgroundColor: MYCOLOR.lightRed,
    marginVertical: DeviceInfo.isTablet() ? 5 : 3,
    transform: [{translateX: -1}],
    borderRadius: 12,
  },
});
