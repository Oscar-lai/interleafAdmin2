import {customAlphabet} from 'nanoid/non-secure';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Filling} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';
import Fraction from '../HWElements/Fraction';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';

import checkEquation, {splitEquation} from '../../../helper/checkEuqation';

export const LongQModelAns: React.FC<{filling: Filling}> = ({filling}) => {
  const modelAns = filling.modelAns;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  let {width} = useSafeAreaFrame();
  let containerWidth = DeviceInfo.isTablet() ? width * 0.8 : width * 0.86;
  let equalWidth = DeviceInfo.isTablet() ? 16 : 11;
  let textWidth = DeviceInfo.isTablet() ? 12 : 8;
  let equationSide = (containerWidth - equalWidth) / 2;

  const [myWidth, setMyWidth] = useState<number>(equationSide);

  //for equation answer showing
  useEffect(() => {
    let digit = 0;
    modelAns.forEach((item: any) => {
      if (checkEquation(item)) {
        splitEquation(item).forEach((side: any, eindex: number) => {
          if (eindex !== 1) {
            if (typeof side === 'string') {
              if (side.length > digit) {
                digit = side.length;
              }
            } else if (typeof side === 'object') {
              let oneSideDigit = 0;
              for (let key in side) {
                if (typeof side[key] === 'string') {
                  oneSideDigit += side[key].length;
                } else if (typeof side[key] === 'object') {
                  oneSideDigit += 7;
                }
              }
              if (oneSideDigit > digit) {
                digit = oneSideDigit;
              }
            }
          }
        });
      }
    });
    let aproxWidth = digit * textWidth;
    if (aproxWidth > equationSide) {
      setMyWidth(aproxWidth);
    }
  }, [equationSide, modelAns, textWidth]);

  return (
    <ScrollView
      directionalLockEnabled
      style={styles.LongQModelAnsContainer}
      contentContainerStyle={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      }}>
      {Array.isArray(modelAns) &&
        modelAns.map((ans, index: number) => (
          <React.Fragment key={index + id}>
            <View style={styles.bitTextContainer}>
              {typeof ans === 'string' ? (
                checkEquation(ans) ? (
                  splitEquation(ans).map((e: any, eIndex: number) => (
                    <View
                      style={
                        eIndex !== 1
                          ? {
                              width: myWidth,
                              alignItems:
                                eIndex === 0 ? 'flex-end' : 'flex-start',
                            }
                          : {}
                      }>
                      <Text style={styles.LongQAnsText}>{e}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.LongQAnsText}>{ans}</Text>
                )
              ) : checkEquation(ans) ? (
                splitEquation(ans).map((e: any, eIndex: number) => (
                  <View
                    style={[
                      {flexDirection: 'row', alignItems: 'center'},
                      eIndex !== 1
                        ? {
                            width: myWidth,
                            justifyContent:
                              eIndex === 0 ? 'flex-end' : 'flex-start',
                          }
                        : {},
                    ]}>
                    {Object.keys(e).map((key: any, index2: number) => (
                      <React.Fragment key={index + index2 + id}>
                        {typeof e[key] === 'string' ? (
                          <Text style={styles.LongQAnsText}>{e[key]}</Text>
                        ) : (
                          <Fraction
                            color={MYCOLOR.lightRed}
                            modelAns
                            ReadOnly
                            fillings={{food: [e[key]]}}
                          />
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                ))
              ) : (
                Object.keys(ans).map((key: any, index2: number) => (
                  <React.Fragment key={index + index2 + id}>
                    {typeof ans[key] === 'string' ? (
                      <Text style={styles.LongQAnsText}>{ans[key]}</Text>
                    ) : (
                      <Fraction
                        color={MYCOLOR.lightRed}
                        modelAns
                        ReadOnly
                        fillings={{food: [ans[key]]}}
                      />
                    )}
                  </React.Fragment>
                ))
              )}
            </View>
          </React.Fragment>
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  LongQModelAnsContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  LongQAnsText: {
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
    textAlign: 'center',
    color: MYCOLOR.lightRed,
    flexShrink: 0,
    height: DeviceInfo.isTablet() ? 40 : 25,
    lineHeight: DeviceInfo.isTablet() ? 40 : 25,
    margin: 0,
    flexWrap: 'wrap',
    fontFamily: myFont.GEN,
  },
  textContatiner: {
    width: '100%',
    alignItems: 'flex-start',
    marginVertical: DeviceInfo.isTablet() ? 8 : 6,
  },
  bitTextContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: DeviceInfo.isTablet() ? 8 : 6,
  },
  equationContainer: {
    // justifyContent: 'center',
    // width: DeviceInfo.isTablet()
    //   ? widthPercentageToDP('86%')
    //   : widthPercentageToDP('80%'),
    // backgroundColor: 'black',
  },
});
