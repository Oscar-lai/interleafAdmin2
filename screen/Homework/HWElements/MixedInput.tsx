import {customAlphabet} from 'nanoid/non-secure';
import React, {useEffect, useRef, useState} from 'react';

// import {SmallImageDisplay} from '../../../../components/SmallImageDisplay';

// import {FIBInput, FIBInputBox} from '../../../../theme/typography';
// import {nanoid} from 'nanoid';
// import Fraction from './Fraction';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Filling, Sandwich} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';
import Fraction from './Fraction';
import {SmallImageDisplay} from './SmallImageDisplay';

interface IMixed {
  sandwich: Sandwich;
  ReadOnly: boolean;
  condition?: (n: number) => void;
  modelAns?: boolean;
}

export const Mixed: React.FC<IMixed> = ({
  sandwich,
  ReadOnly,
  condition,
  modelAns,
}) => {
  const bread_temp = sandwich.bread;
  const fillings = sandwich.fillings;
  const bread: any[] = Object.values(bread_temp);

  const [ID] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  let fillingCounter = -1;

  // let isMcSlash = false;

  // fillings.map((fill: any) => {
  //   if (fill.type === "mcSlash") {
  //     isMcSlash = true;
  //   }
  // });

  // if (content.type === "mc" && !isMcSlash) {
  //   return (
  //     <MCTextWrapper>
  //       {bread.map((b: string, index: number) => (
  //         <MCText>{b}</MCText>
  //       ))}
  //     </MCTextWrapper>
  //   );
  // }

  return (
    <View style={styles.mainContainer}>
      {bread.map((b: string, index: number) =>
        b !== '' ? (
          [...Array(b.length)].map((x, index) =>
            b[index] === ' ' ? (
              <Text style={styles.TextAnsContainer} key={ID + index + index}>
                &nbsp;
              </Text>
            ) : (
              <Text style={styles.TextAnsContainer} key={ID + index + index}>
                {b[index]}
              </Text>
            ),
          )
        ) : (
          <MyFilling
            ReadOnly={ReadOnly}
            modelAns={modelAns ?? false}
            condition={condition}
            key={ID + index}
            filling={fillings[++fillingCounter]}
          />
        ),
      )}
    </View>
  );
};

interface IFilling {
  filling: Filling;
  ReadOnly: boolean;
  condition?: (n: number) => void;
  modelAns: boolean;
}

const MyFilling: React.FC<IFilling> = ({
  filling,
  ReadOnly,
  condition,
  modelAns,
}) => {
  let formattedFilling = <></>;

  const ans = modelAns ? filling.modelAns ?? '' : filling.ans ?? '';
  const [myAns, setMyAns] = useState(ans);

  // return nth instantly if it is mc type stuff
  if (
    filling.type === 'mcBox' ||
    filling.type === 'mcPig' ||
    filling.type === 'mcStringPig'
  ) {
    return <></>;
  }

  const [ID] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  switch (filling.type) {
    case 'fiB': {
      const length = filling.length;

      const fillingType = filling.food[0];

      if (fillingType === 'symbol') {
        formattedFilling = (
          <TextInput
            style={[
              styles.OperatorInputBox,
              modelAns ? {color: MYCOLOR.lightRed} : {},
            ]}
            onChangeText={text => {
              setMyAns(text);
              filling.ans = text;
            }}
            autoCapitalize={'none'}
            autoCorrect={false}
            value={myAns}
            maxLength={1}
            editable={!ReadOnly}
          />
        );
        // Title Box for bar chart title
      } else if (fillingType === 'title') {
        formattedFilling = (
          <View style={styles.titleContainer}>
            <TextInput
              style={[
                styles.FibTextInput,
                {width: Math.ceil(length / 2) * 40, maxWidth: '90%'},
                modelAns ? {color: MYCOLOR.lightRed} : {},
              ]}
              value={myAns}
              onChangeText={text => {
                setMyAns(text);
                filling.ans = text;
              }}
              maxLength={length}
              editable={!ReadOnly}
            />
          </View>
        );
      } else {
        formattedFilling = (
          <TextInput
            style={[
              styles.FibTextInput,
              {width: Math.ceil(length / 2) * 40},
              modelAns ? {color: MYCOLOR.lightRed} : {},
            ]}
            onChangeText={text => {
              setMyAns(text);
              filling.ans = text;
            }}
            value={myAns}
            maxLength={length}
            editable={!ReadOnly}
          />
        );
      }

      break;
    }
    case 'img': {
      let imgURL = '';
      if (typeof filling.food[0] === 'string') {
        imgURL = filling.food[0];
      }
      formattedFilling = <SmallImageDisplay url={imgURL} />;
      break;
    }
    case 'mcSlash': {
      const ansArray = filling.food;
      const length = filling.length;

      formattedFilling = (
        <>
          {ansArray.map((ans: any, index: number) => (
            <React.Fragment key={ID + index}>
              <TouchableOpacity
                style={[
                  styles.McSlashLabel,
                  ans === myAns
                    ? {borderColor: modelAns ? MYCOLOR.lightRed : '#B5CD33'}
                    : {},
                ]}
                disabled={ReadOnly}
                onPress={() => {
                  setMyAns(ans);
                  filling.ans = ans;
                  if (condition) {
                    condition(Math.random());
                  }
                }}>
                <Text
                  style={[
                    styles.TextAnsContainer,
                    {marginVertical: 0},
                    ans === myAns
                      ? {color: modelAns ? MYCOLOR.lightRed : '#B5CD33'}
                      : {},
                  ]}>
                  {ans}
                </Text>
              </TouchableOpacity>

              {index !== length - 1 && (
                <Text style={styles.TextAnsContainer}>/</Text>
              )}
            </React.Fragment>
          ))}
        </>
      );
      break;
    }
    case 'fraction': {
      formattedFilling = (
        <View style={styles.FractionContainer}>
          <Fraction
            modelAns={modelAns}
            ReadOnly={ReadOnly}
            fillings={filling}
          />
        </View>
      );
      break;
    }
    case 'italic': {
      const italicStr = filling.food[0];
      const length = filling.length;

      if (typeof italicStr === 'string') {
        formattedFilling = (
          <>
            {[...Array(length)].map((x, index) =>
              italicStr[index] === ' ' ? (
                <Text style={styles.TextItalic} key={index}>
                  &nbsp;
                </Text>
              ) : (
                <Text style={styles.TextItalic} key={index}>
                  {italicStr[index]}
                </Text>
              ),
            )}
          </>
        );
      }

      break;
    }
    default: {
      formattedFilling = <></>;
      break;
    }
  }

  return formattedFilling;
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 7.5,
    zIndex: -1,
  },
  TextAnsContainer: {
    fontSize: 20,
    color: '#707070',
    fontFamily: myFont.GEN,
    height: 50,
    lineHeight: 50,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  OperatorInputBox: {
    width: 25,
    height: 25,
    fontSize: 18,
    fontFamily: myFont.GEN,
    margin: 0,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#707070',
    color: '#707070',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 2,
    marginVertical: 12.5,
    padding: 0,
    zIndex: -2,
  },
  FibTextInput: {
    height: 25,
    fontSize: 18,
    fontFamily: myFont.GEN,
    marginVertical: 12.5,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 100,
    color: '#707070',
    textAlign: 'center',
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
    paddingBottom: 2,
    paddingTop: 0,
    zIndex: -2,
  },
  McSlashLabel: {
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
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#FFF',
    height: 34,
    marginVertical: 3,
    borderRadius: 50,
    paddingHorizontal: 22,
    marginHorizontal: 10,
  },
  TextItalic: {
    fontSize: 20,
    color: '#707070',
    fontFamily: 'Poppins-Italic',
    height: 25,
    lineHeight: 27,
    marginVertical: 12.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FractionContainer: {
    height: 70,
    lineHeight: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
