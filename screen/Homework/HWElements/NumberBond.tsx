import {customAlphabet} from 'nanoid/non-secure';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Line} from 'react-native-svg';
import {Filling, Sandwich} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';
import DeviceInfo from 'react-native-device-info';

interface INumberBond {
  sandwich: Sandwich;
  ReadOnly: boolean;
  modelAns?: boolean;
}

export const NumberBond: React.FC<INumberBond> = ({
  sandwich,
  ReadOnly,
  modelAns,
}) => {
  const isReversed = Array.isArray(sandwich.bread['1']);
  let fillingCounter = -1;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  return (
    <View style={styles.BigWrapper}>
      {!isReversed ? (
        <View style={styles.NumberBondWrapper}>
          <View style={styles.SingleBallContainer}>
            {sandwich.bread['1'] === '' ? (
              <BallInput
                modelAns={modelAns ?? false}
                ReadOnly={ReadOnly}
                fill={sandwich.fillings[++fillingCounter]}
              />
            ) : (
              <View style={styles.Ball}>
                <Text style={styles.BallText}>{sandwich.bread['1']}</Text>
              </View>
            )}
            <View
              style={[
                styles.Line,
                {
                  transform: [{rotate: '123deg'}, {translateX: 60}],
                },
              ]}
            />
            <View
              style={[
                styles.Line,
                {
                  transform: [{rotate: '53deg'}, {translateX: 60}],
                },
              ]}
            />
          </View>
          <View style={styles.BallContainer}>
            {sandwich.bread['2'].map((text: string, index: number) =>
              text === '' ? (
                <BallInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  key={id + index}
                  fill={sandwich.fillings[++fillingCounter]}
                />
              ) : (
                <View style={styles.Ball} key={id + index}>
                  <Text style={styles.BallText}>{text}</Text>
                </View>
              ),
            )}
          </View>
        </View>
      ) : (
        <View style={styles.NumberBondWrapper}>
          <View style={styles.BallContainer}>
            {sandwich.bread['1'].map((text: string, index: number) =>
              text === '' ? (
                <BallInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  key={id + index}
                  fill={sandwich.fillings[++fillingCounter]}
                />
              ) : (
                <View style={styles.Ball} key={id + index}>
                  <Text style={styles.BallText}>{text}</Text>
                </View>
              ),
            )}
          </View>
          <View style={styles.SingleBallContainer}>
            {sandwich.bread['2'] === '' ? (
              <BallInput
                modelAns={modelAns ?? false}
                ReadOnly={ReadOnly}
                fill={sandwich.fillings[++fillingCounter]}
              />
            ) : (
              <View style={styles.Ball}>
                <Text style={styles.BallText}>{sandwich.bread['2']}</Text>
              </View>
            )}
            <View
              style={[
                styles.Line,
                {transform: [{rotate: '-123deg'}, {translateX: 60}]},
              ]}
            />
            <View
              style={[
                styles.Line,
                {transform: [{rotate: '-53deg'}, {translateX: 60}]},
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
};

interface IBallInputBox {
  fill: Filling;
  ReadOnly: boolean;
  modelAns: boolean;
}

const BallInput: React.FC<IBallInputBox> = ({fill, ReadOnly, modelAns}) => {
  const ans = modelAns ? fill.modelAns ?? '' : fill.ans ?? '';
  const [myAns, setMyAns] = useState(ans);

  return (
    <TextInput
      style={[styles.BallInputBox, modelAns ? {color: MYCOLOR.lightRed} : {}]}
      editable={!ReadOnly}
      maxLength={2}
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: DeviceInfo.isTablet() ? 30 : 15,
  },
  NumberBondWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  BallContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
  },
  SingleBallContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 0,
  },
  Ball: {
    width: DeviceInfo.isTablet() ? 140 : 80,
    height: DeviceInfo.isTablet() ? 140 : 80,
    flexShrink: 0,
    borderRadius: 70,
    borderWidth: DeviceInfo.isTablet() ? 10 : 5,
    borderColor: '#B2B2B2',
    marginVertical: DeviceInfo.isTablet() ? 20 : 10,
    marginHorizontal: DeviceInfo.isTablet() ? 40 : 24,
    backgroundColor: '#FFF',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: DeviceInfo.isTablet() ? 40 : 28,
    lineHeight: DeviceInfo.isTablet() ? 100 : 80,
  },
  BallInputBox: {
    width: DeviceInfo.isTablet() ? 140 : 80,
    height: DeviceInfo.isTablet() ? 140 : 80,
    flexShrink: 0,
    borderRadius: 70,
    borderWidth: DeviceInfo.isTablet() ? 10 : 5,
    borderColor: '#FFF',
    color: '#707070',
    fontFamily: 'Poppins-Bold',
    fontSize: DeviceInfo.isTablet() ? 50 : 36,
    marginVertical: DeviceInfo.isTablet() ? 20 : 10,
    marginHorizontal: DeviceInfo.isTablet() ? 40 : 24,
    backgroundColor: '#FFF',
    zIndex: 100,
    textAlign: 'center',
    position: 'relative',
    opacity: 1,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.3,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
  },
  Line: {
    width: DeviceInfo.isTablet() ? 240 : 120,
    height: DeviceInfo.isTablet() ? 10 : 5,
    backgroundColor: '#B2B2B2',
    position: 'absolute',
    zIndex: -1,
  },
  BallText: {
    color: '#707070',
    fontFamily: 'Poppins-Bold',
    fontSize: DeviceInfo.isTablet() ? 50 : 36,
  },
});
