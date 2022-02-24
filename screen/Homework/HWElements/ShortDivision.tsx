import {customAlphabet} from 'nanoid/non-secure';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {MYCOLOR} from '../../../theme/typography';
import DeviceInfo from 'react-native-device-info';
interface ShortDivisionProps {
  sandwich: {
    bread: {
      [id: string]: string | string[] | any;
    };
    fillings: any[];
    operators?: string;
    layer: number[];
  };
  ReadOnly: boolean;
  modelAns?: boolean;
}

const ShortDivision: React.FC<ShortDivisionProps> = ({
  sandwich,
  ReadOnly,
  modelAns,
}) => {
  let width = sandwich.layer[0];
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
        {/* First layers is the layer at the top */}
        <View style={styles.MiddleWrapper}>
          {/* this layer consist of 2 column */}
          {/* first on is the ans of the left */}
          {/* which could be simply text */}
          <View style={styles.DivisorWrapper}>
            {typeof sandwich.bread['1'] === 'string' && (
              <Text style={styles.DivisionText}>{sandwich.bread['1']}</Text>
            )}
            {/* or an array that needs input */}
            {Array.isArray(sandwich.bread['1']) &&
              sandwich.bread['1'].map((x, index) => (
                <SmallDivisionInput
                  ReadOnly={ReadOnly}
                  key={id2 + index}
                  fill={sandwich.fillings[++fillingCounter]}
                  modelAns={modelAns ?? false}
                />
              ))}
          </View>
          {/* second column is the one on the right */}
          <View style={styles.DividendWrapper}>
            {/* which can consist of many column itself depending on the question */}
            {[...Array(width)].map((x, index) => (
              // each column can be
              <View style={styles.DividendItem} key={id + index}>
                {/* either simply text */}
                {typeof sandwich.bread[(index + 2).toString()] === 'string' &&
                  [...Array(sandwich.bread[(index + 2).toString()].length)].map(
                    (x, index2) => (
                      <Text style={styles.DivisionText} key={id3 + index2}>
                        {sandwich.bread[(index + 2).toString()][index2]}
                      </Text>
                    ),
                  )}
                {/* or an array that requires input */}
                {Array.isArray(sandwich.bread[(index + 2).toString()]) &&
                  sandwich.bread[(index + 2).toString()].map(
                    (x: any, index: number) => (
                      <SmallDivisionInput
                        ReadOnly={ReadOnly}
                        key={id3 + index}
                        fill={sandwich.fillings[++fillingCounter]}
                        modelAns={modelAns ?? false}
                      />
                    ),
                  )}
              </View>
            ))}
          </View>
        </View>
        {/* afterwards it is an infinitely extendable layer */}
        <View style={styles.InfiniteWrapper}>
          <InfiniteDivisionWrapper
            ReadOnly={ReadOnly}
            width={width}
            fills={sandwich.fillings}
            currentCounter={fillingCounter}
            modelAns={modelAns ?? false}
          />
        </View>
      </View>
    </View>
  );
};

export default ShortDivision;

interface IInfiniteDivisionInput {
  fill: {
    type: string;
    food: string;
    length: number;
    modelAns: string;
    ans?: any;
  };
  layers: number[];
  setLayer: (n: number[]) => void;
  column: number;
  ReadOnly: boolean;
  modelAns: boolean;
}

interface DivisionAns {
  [id: string]: string[];
}

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

interface IInfiniteDivisionWrapper {
  fills: {
    type: string;
    food: string;
    length: number;
    modelAns: string;
    ans?: any;
  }[];
  width: number;
  currentCounter: number;
  ReadOnly: boolean;
  modelAns: boolean;
}

const InfiniteDivisionWrapper: React.FC<IInfiniteDivisionWrapper> = ({
  fills,
  width,
  currentCounter,
  ReadOnly,
  modelAns,
}) => {
  let realFill: any[] = [];
  [...Array(width + 1)].map((x, index) => {
    realFill.push(fills[++currentCounter]);
  });

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  let layerTemp: number[] = Array(width);
  layerTemp.fill(1);

  const [layers, setLayers] = useState<number[]>(layerTemp);
  const [HighestLayers, setHighestLayers] = useState(1);

  let columnCounter = -1;

  useEffect(() => {
    let temp = layers.slice(0);
    let highest = temp.sort((a, b) => a - b)[temp.length - 1];
    setHighestLayers(highest);
  }, [layers]);

  return (
    <View style={styles.InfiniteBigWrapper}>
      {/* for the divisor on the left */}
      <View style={styles.InfiniteColumnWrapper}>
        <InfiniteDivisionInput
          layers={layers}
          setLayer={setLayers}
          column={++columnCounter}
          key={id + 'key'}
          fill={realFill[0]}
          ReadOnly={ReadOnly}
          modelAns={modelAns}
        />
      </View>
      {/* for the answer on the right */}
      <View style={styles.InfiniteColumnWrapper}>
        {[...Array(width)].map((ansItems, index) => (
          <InfiniteDivisionInput
            key={id + index + 'keykey'}
            fill={realFill[index + 1]}
            column={++columnCounter}
            layers={layers}
            setLayer={setLayers}
            ReadOnly={ReadOnly}
            modelAns={modelAns}
          />
        ))}
        {/* the L sign of short division only appears on the (lastest - 1)th layer */}
        {[...Array(ReadOnly ? HighestLayers - 2 : HighestLayers - 1)].map(
          (x, index) => (
            <View
              style={[
                styles.OpacityWrapperForSign,
                DeviceInfo.isTablet() ? {top: index * 90 + 25,} : {
                  top: index * 58 + 15,
                },
                index > 1 &&
                  index === HighestLayers && {
                    opacity: 0.5,
                  },
              ]}
              key={index + id}>
              <View style={styles.DivisionSign} />
            </View>
          ),
        )}
      </View>
    </View>
  );
};

const InfiniteDivisionInput: React.FC<IInfiniteDivisionInput> = ({
  fill,
  column,
  layers,
  setLayer,
  ReadOnly,
  modelAns,
}) => {
  const ans = modelAns ? fill.modelAns ?? {} : fill.ans ?? {};
  const length = fill.length;
  const [myAns, setMyAns] = useState<DivisionAns>(ans);

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  useEffect(() => {
    fill.ans = myAns;
    console.log(myAns);
  }, [myAns]);

  useEffect(() => {
    const L = Object.keys(myAns).length + 1;
    let temp = layers.slice(0);
    temp[column] = L;
    setLayer(temp);
  }, [myAns]);

  return (
    <View style={styles.IndividualAnsWrapper}>
      {[
        ...Array(
          ReadOnly ? Object.keys(myAns).length : Object.keys(myAns).length + 1,
        ),
      ].map((x, index) => (
        <View
          style={[
            styles.OpacityWrapper,
            !modelAns &&
              index === Object.keys(myAns).length &&
              index > 0 && {
                opacity: 0.5,
              },
          ]}
          key={index + id}>
          <View style={styles.Wrapper}>
            {[...Array(length)].map((AnsInThisBox, offset) => (
              <InfiniteSmallDivisionInput
                key={id + index + offset}
                AnsIndex={index}
                offset={offset}
                length={length}
                ans={myAns}
                setAns={setMyAns}
                ReadOnly={ReadOnly}
                opacity={!ReadOnly && index === Object.keys(myAns).length}
                modelAns={modelAns}
              />
            ))}
          </View>
          {/* {!(index % 2) && <Line />} */}
        </View>
      ))}
    </View>
  );
};

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
    if (item !== '') flag = false;
  });

  // else all item is empty string and return true
  return flag;
}

const styles = StyleSheet.create({
  BigWrapper: {
    marginTop: DeviceInfo.isTablet() ? 25 : 15,
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
  },
  InfiniteBigWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    position: 'relative',
    marginBottom: 60,
  },
  InfiniteColumnWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    marginTop: DeviceInfo.isTablet() ? 10 : 5,
    position: 'relative',
  },
  Wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: DeviceInfo.isTablet() ? 10 : 6,
    // backgroundColor:'gray'
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
    borderBottomWidth: DeviceInfo.isTablet() ? 5 : 3,
    borderLeftWidth: DeviceInfo.isTablet() ? 5 : 3,
    borderLeftColor: '#707070',
    borderBottomColor: '#707070',
  },
  DividendItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: DeviceInfo.isTablet() ? 10 : 5,
  },
  DivisorWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
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
  OpacityWrapperForSign: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'absolute',
    left: 0,
    zIndex: -999,
    // backgroundColor: 'gray',
  },
  DivisionSign: {
    width: '100%',
    height: DeviceInfo.isTablet() ? 77 : 50,
    borderBottomWidth: DeviceInfo.isTablet() ? 5 : 3,
    borderLeftWidth: DeviceInfo.isTablet() ? 5 : 3,
    borderLeftColor: '#707070',
    borderBottomColor: '#707070',
  },
  IndividualAnsWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingVertical: DeviceInfo.isTablet() ? 9 : 5,
    // backgroundColor:'gray'
  },
});
