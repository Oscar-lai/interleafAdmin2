import {customAlphabet} from 'nanoid/non-secure';
import React, {useState} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Filling} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';
import Fraction from '../HWElements/Fraction';
import DeviceInfo from 'react-native-device-info';

export const LongQModelAns: React.FC<{filling: Filling}> = ({filling}) => {
  const modelAns = filling.modelAns;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  return (
    <ScrollView
      directionalLockEnabled
      style={styles.LongQModelAnsContainer}
      contentContainerStyle={{
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}>
      {Array.isArray(modelAns) &&
        modelAns.map((ans, index: number) => (
          <React.Fragment key={index + id}>
            <View style={styles.bitTextContainer}>
              {typeof ans === 'string' ? (
                // <View style={styles.textContatiner}>
                <Text style={styles.LongQAnsText}>{ans}</Text>
              ) : (
                // </View>
                Object.keys(ans).map((key: any, index2: number) => (
                  <React.Fragment key={index + index2 + id}>
                    {/* <View style={styles.textContatiner}> */}
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
                    {/* </View> */}
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
});
