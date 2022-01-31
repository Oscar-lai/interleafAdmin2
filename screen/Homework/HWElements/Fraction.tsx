import {customAlphabet} from 'nanoid/non-secure';
import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {MYCOLOR, myFont} from '../../../theme/typography';

interface FractionProps {
  fillings: any;
  ReadOnly: boolean;
  modelAns?: boolean;
  color?: string;
}

const Fraction: React.FC<FractionProps> = ({
  fillings,
  ReadOnly,
  modelAns,
  color,
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

  const [myWidth, setMyWidth] = useState<number>(0);

  const onLayout = useCallback(event => {
    const {width} = event.nativeEvent.layout;
    setMyWidth(width);
  }, []);

  return (
    <View style={styles.FractionContainer}>
      {int !== null && (
        <View style={styles.FractionLeftContainer}>
          {int !== '' && (
            <Text
              style={[
                styles.FractionText,
                {marginRight: -10},
                color ? {color: color} : {},
              ]}>
              {int}
            </Text>
          )}
          {int === '' && (
            <FractionInput
              ReadOnly={ReadOnly}
              fill={sub_fillings[++sub_fillings_counter]}
              modelAns={modelAns ?? false}
            />
          )}
        </View>
      )}
      <View style={styles.FractionRightContainer} onLayout={onLayout}>
        <View style={styles.NumeratorContainer}>
          {!topFlag &&
            numerator.map((item: string, index: number) => (
              <React.Fragment key={'n' + id + index}>
                {item !== '' && (
                  <Text
                    style={[styles.FractionText, color ? {color: color} : {}]}>
                    {item}
                  </Text>
                )}
                {item === '' && (
                  <FractionInput
                    modelAns={modelAns ?? false}
                    ReadOnly={ReadOnly}
                    fill={sub_fillings[++sub_fillings_counter]}
                  />
                )}
              </React.Fragment>
            ))}
          {topFlag && (
            <>
              <Text style={[styles.FractionText, color ? {color: color} : {}]}>
                {topFront}
              </Text>
              <Text
                style={[
                  styles.FractionTextCrossed,
                  color ? {color: color} : {},
                ]}>
                {topMiddle}
              </Text>
              {fractionData.new_numerator[0] === '' ? (
                <FractionInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  fill={sub_fillings[++sub_fillings_counter]}
                />
              ) : (
                <Text
                  style={[styles.FractionText, color ? {color: color} : {}]}>
                  {fractionData.new_numerator[0]}
                </Text>
              )}
              <Text style={[styles.FractionText, color ? {color: color} : {}]}>
                {topEnd}
              </Text>
            </>
          )}
        </View>
        <View
          style={[
            styles.Line,
            {width: myWidth},
            color ? {backgroundColor: color} : {},
          ]}
        />
        <View style={styles.DenominatorContainer}>
          {!botFlag &&
            denominator.map((item: string, index: number) => (
              <React.Fragment key={'n' + id + index}>
                {item !== '' && (
                  <Text
                    style={[styles.FractionText, color ? {color: color} : {}]}>
                    {item}
                  </Text>
                )}
                {item === '' && (
                  <FractionInput
                    modelAns={modelAns ?? false}
                    ReadOnly={ReadOnly}
                    fill={sub_fillings[++sub_fillings_counter]}
                  />
                )}
              </React.Fragment>
            ))}
          {botFlag && (
            <>
              <Text style={[styles.FractionText, color ? {color: color} : {}]}>
                {botFront}
              </Text>
              <Text
                style={[
                  styles.FractionTextCrossed,
                  color ? {color: color} : {},
                ]}>
                {botMiddle}
              </Text>
              {fractionData.new_denominator[0] === '' ? (
                <FractionInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  fill={sub_fillings[++sub_fillings_counter]}
                />
              ) : (
                <Text
                  style={[styles.FractionText, color ? {color: color} : {}]}>
                  {fractionData.new_denominator[0]}
                </Text>
              )}
              <Text style={[styles.FractionText, color ? {color: color} : {}]}>
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
}

const FractionInput: React.FC<IFractionInput> = ({
  fill,
  modelAns,
  ReadOnly,
}) => {
  const ans = modelAns ? fill.modelAns ?? '' : fill.ans ?? '';

  const [myAns, setMyAns] = useState(ans);

  return (
    <TextInput
      editable={!ReadOnly}
      style={[
        styles.FractionInputBox,
        {width: fill.length * 22},
        modelAns ? {color: MYCOLOR.lightRed} : {},
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
    height: 50,
    flexShrink: 0,
  },
  FractionLeftContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  FractionRightContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    height: 50,
  },
  NumeratorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Line: {
    height: 2,
    backgroundColor: '#707070',
  },
  DenominatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FractionInputBox: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    height: 25,
    fontSize: 18,
    fontFamily: myFont.GEN,
    marginVertical: 6,
    marginHorizontal: 10,
    textAlign: 'center',
    color: '#707070',
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 2,
    padding: 0,
  },
  FractionText: {
    height: 25,
    fontSize: 18,
    color: '#707070',
    fontFamily: myFont.GEN,
    lineHeight: 25,
    marginHorizontal: 10,
  },
  FractionTextCrossed: {
    fontSize: 18,
    fontFamily: myFont.GEN,
    color: '#707070',
    height: 24,
    lineHeight: 24,
    marginHorizontal: 5,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});
