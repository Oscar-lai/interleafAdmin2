import {nanoid} from 'nanoid';
import {customAlphabet} from 'nanoid/non-secure';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Line} from 'react-native-svg';
import {MYCOLOR, myFont} from '../../../theme/typography';
import DeviceInfo from 'react-native-device-info';

interface IDivision {
  sandwich: {
    bread: {
      [id: string]: string | string[];
    };
    fillings: any[];
    operators?: string;
    layer: number[];
  };
  ReadOnly: boolean;
  modelAns?: boolean;
}

export const Division: React.FC<IDivision> = ({
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

  return (
    <View style={styles.BigWrapper}>
      <View style={styles.DivisionWrapper}>
        {/* First layers is the quotient(answer) at the top */}
        <View style={styles.QuotientWrapper}>
          <View style={styles.Wrapper}>
            {typeof sandwich.bread['1'] === 'string' && (
              <Text style={styles.DivisionText}>{sandwich.bread['1']}</Text>
            )}
            {Array.isArray(sandwich.bread['1']) &&
              sandwich.bread['1'].map((x, index) => (
                <SmallDivisionInput
                  ReadOnly={ReadOnly}
                  key={id + index}
                  fill={sandwich.fillings[++fillingCounter]}
                  modelAns={modelAns ?? false}
                />
              ))}
          </View>
        </View>
        {/* Two layers are in the middle */}
        <View style={styles.MiddleWrapper}>
          {/* one the left is the divisor */}
          <View style={styles.DivisorWrapper}>
            {typeof sandwich.bread['2'] === 'string' &&
              [...Array(sandwich.bread['2'].length)].map((x, index) => (
                <Text style={styles.DivisionText} key={index}>
                  {sandwich.bread['2'][index]}
                </Text>
              ))}
            {Array.isArray(sandwich.bread['2']) &&
              sandwich.bread['2'].map((x, index) => (
                <SmallDivisionInput
                  ReadOnly={ReadOnly}
                  key={id2 + index}
                  fill={sandwich.fillings[++fillingCounter]}
                  modelAns={modelAns ?? false}
                />
              ))}
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
              sandwich.bread['3'].map((x, index) => (
                <SmallDivisionInput
                  ReadOnly={ReadOnly}
                  key={id3 + index}
                  fill={sandwich.fillings[++fillingCounter]}
                  modelAns={modelAns ?? false}
                />
              ))}
          </View>
        </View>
        {/* The bottom layers will extend infinitely */}
        <View style={styles.InfiniteWrapper}>
          <InfiniteDivisionInput
            ReadOnly={ReadOnly}
            fill={sandwich.fillings[++fillingCounter]}
            modelAns={modelAns ?? false}
          />
        </View>
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
  ReadOnly: boolean;
  modelAns: boolean;
}

const SmallDivisionInput: React.FC<IDivisionInputBox> = ({
  fill,
  ReadOnly,
  modelAns,
}) => {
  const ans = modelAns ? fill.modelAns ?? '' : fill.ans ?? '';
  const [myAns, setMyAns] = useState(ans);

  if (ans === '') {
    fill.ans = '';
  }

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

interface DivisionAns {
  [id: string]: string[];
}

const InfiniteDivisionInput: React.FC<IDivisionInputBox> = ({
  fill,
  ReadOnly,
  modelAns,
}) => {
  const ans = modelAns ? fill.modelAns ?? [] : fill.ans ?? [];
  const [myAns, setMyAns] = useState<DivisionAns>(ans);

  if (ans === []) {
    fill.ans = [];
  }

  const NumOfLayers = ReadOnly
    ? Object.keys(myAns).length
    : Object.keys(myAns).length + 1;

  const lengthOfRow = fill.length;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  useEffect(() => {
    fill.ans = myAns;
  }, [myAns]);

  return (
    <React.Fragment>
      {[...Array(NumOfLayers)].map((x, index) => (
        <View
          style={[
            styles.OpacityWrapper,
            index > 0 && index === Object.keys(myAns).length
              ? {opacity: 1}
              : {},
          ]}
          key={index + id}>
          <View style={styles.Wrapper}>
            {[...Array(lengthOfRow)].map((AnsInThisBox, offset) => (
              <InfiniteSmallDivisionInput
                key={id + index + offset}
                AnsIndex={index}
                offset={offset}
                length={lengthOfRow}
                ans={myAns}
                setAns={setMyAns}
                ReadOnly={ReadOnly}
                opacity={
                  !modelAns && index > 0 && index === Object.keys(myAns).length
                }
                modelAns={modelAns}
              />
            ))}
          </View>
          {!(index % 2) && (
            <View
              style={[
                styles.Line,
                DeviceInfo.isTablet()
                  ? {width: lengthOfRow * 53}
                  : {width: lengthOfRow * 30},
              ]}
            />
          )}
        </View>
      ))}
    </React.Fragment>
  );
};

interface IDivisionInput {
  ans: DivisionAns;
  setAns: Dispatch<SetStateAction<DivisionAns>>;
  AnsIndex: number;
  offset: number;
  length: number;
  ReadOnly: boolean;
  opacity: boolean;
  modelAns: boolean;
}

const InfiniteSmallDivisionInput: React.FC<IDivisionInput> = ({
  ans,
  AnsIndex,
  offset,
  length,
  setAns,
  ReadOnly,
  opacity,
  modelAns,
}) => {
  const realAns = ans[Object.keys(ans)[AnsIndex]]
    ? ans[Object.keys(ans)[AnsIndex]][offset]
    : '';

  return (
    <TextInput
      style={[
        styles.InfiniteSmallDivisionInputBox,
        modelAns ? {color: MYCOLOR.lightRed} : {},
        // even the opacity is below 1, android version shadow will still be full color
        // so we need to shut the whole shadow thing down
        opacity ? {shadowColor: '#FFF'} : {},
      ]}
      maxLength={1}
      value={realAns}
      editable={!ReadOnly}
      onChangeText={text => {
        let InputAns = text;
        setAns(ans => {
          // make a copy of this object
          let tempAns = Object.assign({}, ans);

          // if this is new line
          if (AnsIndex >= Object.keys(ans).length) {
            const lastKey =
              Object.keys(tempAns)[Object.keys(tempAns).length - 1];
            // add all box of new block as empty string
            let newKey;
            if (lastKey) {
              newKey = (+lastKey + 1).toString();
            } else {
              newKey = '1';
            }

            tempAns[newKey] = Array(length).fill('');
            // then replace the input one with input
            tempAns[newKey][offset] = InputAns;
          } else {
            // updated ans in the object block
            let UpdatedArrayAns = tempAns[Object.keys(tempAns)[AnsIndex]];
            UpdatedArrayAns[offset] = InputAns;

            // remove all empty blanks at the end
            tempAns = RemoveArrayEmptyBlock(tempAns);
          }
          // set new ans
          return tempAns;
        });
      }}
    />
  );
};

function RemoveArrayEmptyBlock(obj: DivisionAns): DivisionAns {
  while (isLastBlockAllEmpty(obj)) {
    if (Object.keys(obj).length - 1 === 0) {
      obj = {};
      break;
    }
    if (Object.keys(obj).length - 1 > 0) {
      delete obj[Object.keys(obj)[Object.keys(obj).length - 1]];
    }
  }
  return obj;
}

function isLastBlockAllEmpty(obj: DivisionAns) {
  let flag = true;
  // get the last array
  const lastArray = obj[Object.keys(obj)[Object.keys(obj).length - 1]];

  // if any item is not empty return false
  lastArray.map((item, index) => {
    if (item !== '') {
      flag = false;
    }
  });

  // else all item is empty string and return true
  return flag;
}

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
  InfiniteWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    marginTop: DeviceInfo.isTablet() ? -8 : 0,
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
    height: DeviceInfo.isTablet() ? 55 : 36,
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
  InfiniteSmallDivisionInputBox: {
    backgroundColor: '#FFF',
    textAlign: 'center',
    fontSize: DeviceInfo.isTablet() ? 45 : 30,
    fontFamily: 'Poppins-Bold',
    marginVertical: DeviceInfo.isTablet() ? 10 : 5,
    marginHorizontal: DeviceInfo.isTablet() ? 8 : 4,
    width: DeviceInfo.isTablet() ? 40 : 24,
    height: DeviceInfo.isTablet() ? 55 : 36,
    color: '#707070',
    borderRadius: DeviceInfo.isTablet() ? 10 : 8,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.5,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    marginBottom: 5,
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
