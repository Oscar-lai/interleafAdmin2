import {customAlphabet} from 'nanoid/non-secure';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Filling, Sandwich} from '../../../hooks/useHWQ';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/Ionicons';
import {MYCOLOR} from '../../../theme/typography';
Icon.loadFont();

interface IStraight {
  sandwich: Sandwich;
}

export const LongQAnsStraight: React.FC<IStraight> = ({sandwich}) => {
  const bread = sandwich.bread;
  const operators = sandwich.operator ?? [];
  const layer = sandwich.layer;

  const breadKey = Object.keys(bread);

  let breadCounter = 0;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

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
                    {/* display the actual value of item */}
                    {[...Array(bread[breadCounter.toString()].length)].map(
                      (x, index) => (
                        <Text style={styles.StraightText} key={id + index}>
                          {bread[breadCounter.toString()][index]}
                        </Text>
                      ),
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
                          {/* display the actual value of item one by one */}
                          {[...Array(a.length)].map((x, index) => (
                            <Text key={index} style={[styles.StraightText]}>
                              {a[index]}
                            </Text>
                          ))}
                        </React.Fragment>
                      ),
                    )}
                  </View>
                )}
              </React.Fragment>
            ))}
            {/* after processing all item in this layer,
            display the operator and line if it is not the last layer */}
            {index !== layer.length - 1 && (
              <Text
                style={[
                  styles.Operator,
                  DeviceInfo.isTablet()
                    ? {right: longest * 28}
                    : {right: longest * 19},
                ]}>
                {operators[index]}
              </Text>
            )}
            {index !== layer.length - 1 && (
              <View
                style={[
                  styles.Line,
                  DeviceInfo.isTablet()
                    ? {width: longest * 29 + 35}
                    : {width: longest * 17 + 25},
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
  BigStraightWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    width: '100%',
    marginTop: DeviceInfo.isTablet() ? 15 : 8,
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
    paddingLeft: DeviceInfo.isTablet() ? 37 : 26,
    marginBottom: DeviceInfo.isTablet() ? 8 : 5,
    position: 'relative',
    width: 'auto',
  },
  Operator: {
    position: 'absolute',
    bottom: DeviceInfo.isTablet() ? 8 : 5,
    width: DeviceInfo.isTablet() ? 23 : 15,
    height: DeviceInfo.isTablet() ? 27 : 15,
    fontSize: DeviceInfo.isTablet() ? 23 : 15,
    lineHeight: DeviceInfo.isTablet() ? 27 : 15,
    color: MYCOLOR.lightRed,
    fontFamily: 'Poppins-Bold',
  },
  StraightText: {
    margin: DeviceInfo.isTablet() ? 7 : 4,
    width: DeviceInfo.isTablet() ? 27 : 11,
    fontSize: DeviceInfo.isTablet() ? 30 : 18,

    height: DeviceInfo.isTablet() ? 37 : 23,
    letterSpacing: 6,
    color: MYCOLOR.lightRed,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  StraightLineDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: DeviceInfo.isTablet() ? 9 : 6,
    height: DeviceInfo.isTablet() ? 35 : 21,
    flexShrink: 0,
  },
  OperatorLineContainer: {
    height: DeviceInfo.isTablet() ? 4 : 2,
  },
  Line: {
    position: 'absolute',
    width: '100%',
    height: DeviceInfo.isTablet() ? 4 : 2,
    backgroundColor: MYCOLOR.lightRed,
    bottom: 0,
    right: 0,
    borderRadius: 10,
  },
});
