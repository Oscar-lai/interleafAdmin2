import {transform} from '@babel/core';
import {customAlphabet} from 'nanoid/non-secure';
import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {Filling, Sandwich} from '../../../hooks/useHWQ';
import {MYCOLOR} from '../../../theme/typography';

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

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  console.log(bread);

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
                      />
                    ) : (
                      // else display the actual value of item
                      [...Array(bread[breadCounter.toString()].length)].map(
                        (x, index) => (
                          <Text style={styles.StraightText} key={id + index}>
                            {bread[breadCounter.toString()][index]}
                          </Text>
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
                            <SmallStraightInputBox
                              modelAns={modelAns ?? false}
                              ReadOnly={ReadOnly}
                              filling={filling[++fillingCounter]}
                            />
                          ) : (
                            // else display the actual value of item
                            <Text style={styles.StraightText}>{a}</Text>
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
                />
              ) : (
                <Text style={[styles.Operator, {right: longest * 32}]}>
                  {operators[index]}
                </Text>
              ))}
            {index !== layer.length - 1 && (
              <View style={[styles.Line, {width: longest * 32 + 50}]} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
};

interface IStraightInputs {
  filling: Filling;
  ReadOnly: boolean;
  modelAns: boolean;
}

const StraightInputBox: React.FC<IStraightInputs> = ({
  filling,
  ReadOnly,
  modelAns,
}) => {
  const [myWidth, setMyWidth] = useState<string>('46px');
  const ans = modelAns ? filling.modelAns ?? '' : filling.ans ?? '';

  const [myAns, setMyAns] = useState(ans);

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

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

const SmallStraightInputBox: React.FC<IStraightInputs> = ({
  filling,
  ReadOnly,
  modelAns,
}) => {
  const ans = modelAns ? filling.modelAns ?? '' : filling.ans ?? '';

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  if (ans === '') {
    filling.ans = '';
  }

  const [myAns, setMyAns] = useState(ans);

  return (
    <TextInput
      style={[
        styles.SmallStraightInput,
        modelAns ? {color: MYCOLOR.lightRed} : {},
      ]}
      maxLength={1}
      editable={!ReadOnly}
      value={myAns}
      onChangeText={text => {
        setMyAns(text);
        filling.ans = text;
      }}
      id={id}
    />
  );
};

const OperatorInput: React.FC<IStraightInputs> = ({
  filling,
  ReadOnly,
  modelAns,
}) => {
  const ans = modelAns ? filling.modelAns ?? '' : filling.ans ?? '';
  const [myAns, setMyAns] = useState(ans);

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
    fontSize: 30,
    maxWidth: 130,
    minWidth: 46,
    height: 32,
    margin: 4,
    letterSpacing: 4,
    color: '#FFF',
    borderRadius: 12,
    padding: 0,
  },
  SmallStraightInput: {
    backgroundColor: '#FFF',
    textAlign: 'center',
    fontSize: 30,
    fontFamily: 'Poppins-Bold',
    marginVertical: 5,
    marginHorizontal: 4,
    width: 24,
    height: 36,
    color: '#707070',
    borderRadius: 8,
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
  BigStraightWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
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
    paddingLeft: 50,
    marginBottom: 10,
    position: 'relative',
    width: 'auto',
  },
  Operator: {
    position: 'absolute',
    bottom: 12,
    width: 30,
    height: 30,
    fontSize: 30,
    lineHeight: 30,
    color: '#909090',
    fontFamily: 'Poppins-Bold',
  },
  OperatorInputBox: {
    color: '#909090',
    fontFamily: 'Poppins-Bold',
    position: 'absolute',
    bottom: 18,
    left: 5,
    width: 30,
    height: 30,
    fontSize: 25,
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
    shadowRadius: 3,
    shadowOpacity: 0.2,
    elevation: 2,
    padding: 0,
  },
  StraightText: {
    margin: 5,
    width: 22,
    fontSize: 30,
    letterSpacing: 6,
    color: '#707070',
    fontFamily: 'Poppins-Bold',
    textAlign: 'right',
  },
  StraightLineDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
    height: 42,
    flexShrink: 0,
  },
  OperatorLineContainer: {
    height: 4,
  },
  Line: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: '#909090',
    bottom: 0,
    right: 0,
    borderRadius: 20,
  },
});
