import {customAlphabet} from 'nanoid/non-secure';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {MYCOLOR, myFont} from '../../../theme/typography';
import DeviceInfo from 'react-native-device-info';
import CrossText from './HWComponent/CrossText';

interface FractionProps {
  fillings: any;
  ReadOnly: boolean;
  modelAns?: boolean;
  color?: string;
  bold?: boolean;
}

export interface IFraction {
  integer?: (string | ISpecialFractElement)[];
  denominator: (string | ISpecialFractElement)[];
  'new-denominator': string[];
  'crossed-denominator': number[];
  numerator: (string | ISpecialFractElement)[];
  'new-numerator': string[];
  'crossed-numerator': number[];
}

interface ISpecialFractElement {
  type: string;
  food: string;
}

const Fraction: React.FC<FractionProps> = ({
  fillings,
  ReadOnly,
  modelAns,
  color,
  bold,
}) => {
  const fractionData = fillings.food[0];

  const numerator = fractionData.numerator ?? [];
  const denominator = fractionData.denominator ?? [];
  const integer = fractionData.integer;
  const int = integer ? integer[0] : null;

  const sub_fillings = fillings.sub_fillings ?? [];

  let sub_fillings_counter = -1;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10),
  );

  // for crossing top side
  let topFront = '',
    topMiddle = '',
    topEnd = '';

  const topFlag = fractionData['crossed-numerator'] ? true : false;

  if (topFlag) {
    const topSliceBegin = fractionData['crossed-numerator'][0];
    const topSliceEnd = fractionData['crossed-numerator'][1];

    if (numerator[0]) {
      topFront = numerator[0].slice(0, topSliceBegin);
      topMiddle = numerator[0].slice(topSliceBegin, topSliceEnd);
      topEnd = numerator[0].slice(topSliceEnd, numerator[0].length);
    }
  }

  // for crossing bot side
  let botFront = '',
    botMiddle = '',
    botEnd = '';

  const botFlag = fractionData['crossed-denominator'] ? true : false;

  if (botFlag) {
    const botSliceBegin = fractionData['crossed-denominator'][0];
    const botSliceEnd = fractionData['crossed-denominator'][1];

    if (denominator[0]) {
      botFront = denominator[0].slice(0, botSliceBegin);
      botMiddle = denominator[0].slice(botSliceBegin, botSliceEnd);
      botEnd = denominator[0].slice(botSliceEnd, denominator[0].length);
    }
  }

  //To increase the space between fraction text if there are any text input
  let numOrDenoInput =
    numerator.some((value: string) => value === '') ||
    denominator.some((value: string) => value === '');

  const [myWidth, setMyWidth] = useState<number>(0);
  const [crossWidth, setCrossWidth] = useState<number>(0);

  const onLayout = useCallback(event => {
    const {width} = event.nativeEvent.layout;
    setMyWidth(width);
  }, []);

  const onCrossLayout = useCallback(event => {
    const {width} = event.nativeEvent.layout;
    setCrossWidth(width);
  }, []);

  //edit below if there is anything special to add on the fraction
  //function to cater different style inside fraction
  function specialStyle(type: string) {
    if (type === 'italic') {
      return {fontFamily: 'Poppins-Italic'};
    } else {
      return {};
    }
  }

  return (
    <View
      style={[
        styles.FractionContainer,
        topFlag ? {paddingTop: DeviceInfo.isTablet() ? 12 : 8} : {},
      ]}>
      {int !== null && (
        <View style={styles.FractionLeftContainer}>
          {int !== '' && (
            <Text
              style={[
                styles.FractionText,
                {marginRight: -10},
                color ? {color: color} : {},
                bold ? {fontFamily: 'Poppins-Bold'} : {},
                typeof int === 'object' ? specialStyle(int.type) : {},
              ]}>
              {typeof int === 'object' ? int.food : int}
            </Text>
          )}
          {int === '' && (
            <FractionInput
              ReadOnly={ReadOnly}
              fill={sub_fillings[++sub_fillings_counter]}
              modelAns={modelAns ?? false}
              bold={bold}
            />
          )}
        </View>
      )}
      <View style={styles.FractionRightContainer} onLayout={onLayout}>
        <View style={styles.NumeratorContainer}>
          {!topFlag && (
            <View style={styles.FractionTextContainer}>
              {numerator.map(
                (item: string | ISpecialFractElement, index: number) => (
                  <React.Fragment key={'n' + id + index}>
                    {item !== '' && (
                      <Text
                        style={[
                          styles.FractionText,
                          color ? {color: color} : {},
                          numOrDenoInput
                            ? {marginBottom: DeviceInfo.isTablet() ? 5 : 3}
                            : {},
                          bold ? {fontFamily: 'Poppins-Bold'} : {},
                          typeof item === 'object'
                            ? specialStyle(item.type)
                            : {},
                        ]}>
                        {typeof item === 'object' ? item.food : item}
                      </Text>
                    )}
                    {item === '' && (
                      <FractionInput
                        modelAns={modelAns ?? false}
                        ReadOnly={ReadOnly}
                        fill={sub_fillings[++sub_fillings_counter]}
                        bold={bold}
                      />
                    )}
                  </React.Fragment>
                ),
              )}
            </View>
          )}
          {topFlag && (
            <>
              <Text
                style={[
                  styles.FractionText,
                  color ? {color: color} : {},
                  bold ? {fontFamily: 'Poppins-Bold'} : {},
                ]}>
                {topFront}
              </Text>
              <CrossText
                style={[
                  styles.FractionTextCrossed,
                  color ? {color: color} : {},
                  bold ? {fontFamily: 'Poppins-Bold'} : {},
                ]}>
                {topMiddle}
              </CrossText>
              <View style={styles.NewTextBox} onLayout={onCrossLayout}>
                {fractionData['new-numerator'][0] === '' ? (
                  <FractionInput
                    modelAns={modelAns ?? false}
                    ReadOnly={ReadOnly}
                    fill={sub_fillings[++sub_fillings_counter]}
                    bold={bold}
                  />
                ) : (
                  <Text
                    style={[
                      styles.FractionText,
                      color ? {color: color} : {},
                      bold ? {fontFamily: 'Poppins-Bold'} : {},
                    ]}>
                    {fractionData['new-numerator'][0]}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.FractionText,
                  color ? {color: color} : {},
                  bold ? {fontFamily: 'Poppins-Bold'} : {},
                ]}>
                {topEnd}
              </Text>
            </>
          )}
        </View>
        <View
          style={[
            styles.Line,
            {
              width: numOrDenoInput
                ? myWidth
                : topFlag
                ? (myWidth - crossWidth) * 0.8
                : myWidth * 0.8,
            },
            topFlag ? {alignSelf: 'flex-start'} : {},
            topFlag ? {left: (myWidth - crossWidth) * 0.1} : {},
            color ? {backgroundColor: color} : {},
          ]}
        />
        <View style={styles.DenominatorContainer}>
          {!botFlag && (
            <View style={styles.FractionTextContainer}>
              {denominator.map(
                (item: string | ISpecialFractElement, index: number) => (
                  <React.Fragment key={'n' + id + index}>
                    {item !== '' && (
                      <Text
                        style={[
                          styles.FractionText,
                          color ? {color: color} : {},
                          numOrDenoInput
                            ? {marginBottom: DeviceInfo.isTablet() ? 5 : 3}
                            : {},
                          bold ? {fontFamily: 'Poppins-Bold'} : {},
                          typeof item === 'object'
                            ? specialStyle(item.type)
                            : {},
                        ]}>
                        {typeof item === 'object' ? item.food : item}
                      </Text>
                    )}
                    {item === '' && (
                      <FractionInput
                        modelAns={modelAns ?? false}
                        ReadOnly={ReadOnly}
                        fill={sub_fillings[++sub_fillings_counter]}
                        bold={bold}
                      />
                    )}
                  </React.Fragment>
                ),
              )}
            </View>
          )}
          {botFlag && (
            <>
              <Text
                style={[
                  styles.FractionText,
                  color ? {color: color} : {},
                  bold ? {fontFamily: 'Poppins-Bold'} : {},
                ]}>
                {botFront}
              </Text>
              <CrossText
                style={[
                  styles.FractionTextCrossed,
                  color ? {color: color} : {},
                  bold ? {fontFamily: 'Poppins-Bold'} : {},
                ]}>
                {botMiddle}
              </CrossText>
              <View style={styles.NewTextBox}>
                {fractionData['new-denominator'][0] === '' ? (
                  <FractionInput
                    modelAns={modelAns ?? false}
                    ReadOnly={ReadOnly}
                    fill={sub_fillings[++sub_fillings_counter]}
                    bold={bold}
                  />
                ) : (
                  <Text
                    style={[
                      styles.FractionText,
                      color ? {color: color} : {},
                      bold ? {fontFamily: 'Poppins-Bold'} : {},
                    ]}>
                    {fractionData['new-denominator'][0]}
                  </Text>
                )}
              </View>
              <Text
                style={[
                  styles.FractionText,
                  color ? {color: color} : {},
                  bold ? {fontFamily: 'Poppins-Bold'} : {},
                ]}>
                {botEnd}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default Fraction;

interface IFractionInput {
  fill: any;
  modelAns: boolean;
  ReadOnly: boolean;
  bold?: boolean;
}

const FractionInput: React.FC<IFractionInput> = ({
  fill,
  modelAns,
  ReadOnly,
  bold,
}) => {
  const ans = modelAns ? fill.modelAns ?? '' : fill.ans ?? '';

  const [myAns, setMyAns] = useState(ans);

  let inputWidthFactor = DeviceInfo.isTablet() ? 35 : 22;

  return (
    <TextInput
      editable={!ReadOnly}
      style={[
        styles.FractionInputBox,
        {width: fill.length * inputWidthFactor},
        modelAns ? {color: MYCOLOR.lightRed} : {},
        bold ? {fontFamily: 'Poppins-Bold'} : {},
      ]}
      maxLength={fill.length}
      value={myAns}
      onChangeText={text => {
        setMyAns(text);
        fill.ans = text;
      }}
    />
  );
};

const styles = StyleSheet.create({
  FractionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: DeviceInfo.isTablet() ? 80 : 50,
    flexShrink: 0,
    paddingHorizontal: DeviceInfo.isTablet() ? 3 : 2,
    // backgroundColor: 'black',
  },
  FractionLeftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: DeviceInfo.isTablet() ? 70 : 50,
    marginRight: DeviceInfo.isTablet() ? 10 : 8,
  },
  FractionRightContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // marginHorizontal: DeviceInfo.isTablet() ? 16 : 12,
    height: DeviceInfo.isTablet() ? 70 : 50,
  },
  NumeratorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Line: {
    // alignSelf: 'flex-start',
    height: DeviceInfo.isTablet() ? 3.5 : 2,
    backgroundColor: '#707070',
  },
  DenominatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FractionInputBox: {
    backgroundColor: '#FFF',
    borderRadius: 100,
    height: DeviceInfo.isTablet() ? 40 : 25,
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
    fontFamily: myFont.GEN,
    marginVertical: DeviceInfo.isTablet() ? 10 : 6,
    // marginHorizontal: DeviceInfo.isTablet() ? 20 : 10,
    textAlign: 'center',
    color: '#707070',
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
  FractionText: {
    height: DeviceInfo.isTablet() ? 40 : 25,
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
    color: '#707070',
    fontFamily: myFont.GEN,
    lineHeight: DeviceInfo.isTablet() ? 40 : 25,
    // marginHorizontal: DeviceInfo.isTablet() ? 15 : 8,
    // marginVertical: DeviceInfo.isTablet() ? 10 : 6,
  },
  FractionTextCrossed: {
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
    fontFamily: myFont.GEN,
    color: '#707070',
    height: DeviceInfo.isTablet() ? 36 : 24,
    lineHeight: DeviceInfo.isTablet() ? 36 : 24,
    marginHorizontal: DeviceInfo.isTablet() ? 8 : 5,
    // textDecorationLine: 'line-through',
    // textDecorationStyle: 'solid',
  },
  FractionTextContainer: {
    flexDirection: 'row',
    marginHorizontal: DeviceInfo.isTablet() ? 15 : 8,
    alignItems: 'center',
  },
  NewTextBox: {
    left: DeviceInfo.isTablet() ? 8 : 5,
    bottom: DeviceInfo.isTablet() ? 12 : 8,
  },
});
