import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Filling} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';

interface IInfiniteInput {
  filling: Filling;
  bread: {
    [id: string]: string | string[];
  };
  ReadOnly: boolean;
  modelAns?: boolean;
}

interface IInfiniteInputItem {
  filling: Filling;
}

interface IInfiniteInputReadOnly {
  filling: Filling;
  modelAns: boolean;
  isArrayAns: boolean;
}

export const InfiniteInput: React.FC<IInfiniteInput> = ({
  filling,
  bread,
  ReadOnly,
  modelAns,
}) => {
  // check if this q use array or ojbect as ans
  let isArrayAns = Array.isArray(filling.modelAns);

  const title = bread ? bread['1'] ?? '' : '';

  if (ReadOnly) {
    return (
      <>
        <Text style={styles.Title}>{title}</Text>
        <InfiniteInputReadOnly
          isArrayAns={isArrayAns}
          modelAns={modelAns ?? false}
          filling={filling}
        />
      </>
    );
  }

  if (isArrayAns) {
    return (
      <>
        <Text style={styles.Title}>{title}</Text>
        <InfiniteInputUnordered filling={filling} />
      </>
    );
  } else {
    return (
      <>
        <Text style={styles.Title}>{title}</Text>
        <InfiniteInputOrdered filling={filling} />
      </>
    );
  }
};

const InfiniteInputReadOnly: React.FC<IInfiniteInputReadOnly> = ({
  filling,
  modelAns,
  isArrayAns,
}) => {
  let fiBAns = modelAns ? filling.modelAns : filling.ans;

  if (!isArrayAns) {
    if (fiBAns) fiBAns = Object.values(fiBAns) ?? [];
  }

  const [myAns] = useState<any>(fiBAns ?? []);

  return (
    <View style={styles.FiBContainer}>
      {[...Array(myAns.length)].map((x, i) => (
        <TextInput
          style={[
            styles.FillingContainer,
            modelAns ? {color: MYCOLOR.lightRed} : {},
          ]}
          key={i}
          value={myAns[i] ? myAns[i] : ''}
          editable={false}
        />
      ))}
    </View>
  );
};

const InfiniteInputUnordered: React.FC<IInfiniteInputItem> = ({filling}) => {
  let fiBAns = filling.ans;

  const [myAns, setMyAns] = useState<any>(fiBAns ? fiBAns : []);

  useEffect(() => {
    console.log(myAns);
    filling.ans = myAns;
  }, [myAns]);

  return (
    <View style={styles.FiBContainer}>
      {[...Array(myAns.length + 1)].map((x, i) => (
        <TextInput
          style={[
            styles.FillingContainer,
            // non-first last child will be blurred
            i > 0 && i === myAns.length ? {opacity: 0.8} : {},
          ]}
          key={i}
          value={myAns[i] ? myAns[i] : ''}
          onChangeText={text => {
            const ans = text;
            if (i === myAns.length) {
              setMyAns((myAns: string[]) => {
                // copy this whole array and replace the one with new ans
                let newAns = [...Array(myAns.length + 1)].map((x, index) => {
                  return i === index ? ans : myAns[index];
                });
                // remove all undefined
                newAns = newAns.filter(item => item !== undefined);
                // set new ans
                return newAns;
              });
            } else {
              setMyAns((myAns: string[]) => {
                // copy this whole array and replace the one with new ans
                let newAns = [...Array(myAns.length)].map((x, index) => {
                  return i === index ? ans : myAns[index];
                });
                // remove all undefined
                newAns = newAns.filter(item => item !== '');
                // set new ans
                return newAns;
              });
            }
          }}
        />
      ))}
    </View>
  );
};

const InfiniteInputOrdered: React.FC<IInfiniteInputItem> = ({filling}) => {
  let fiBAns = filling.ans;

  interface OrderedAns {
    [id: string]: string;
  }

  const [myAns, setMyAns] = useState<OrderedAns>(fiBAns ? fiBAns : {});

  useEffect(() => {
    console.log(myAns);
    filling.ans = myAns;
  }, [myAns]);

  return (
    <View style={styles.FiBContainer}>
      {[...Array(Object.keys(myAns).length + 1)].map((x, i) => (
        <TextInput
          style={[
            styles.FillingContainer,
            // non-first last child will be blurred
            i > 0 && i === Object.keys(myAns).length ? {opacity: 0.8} : {},
          ]}
          key={i}
          value={myAns[(i + 1).toString()] ? myAns[(i + 1).toString()] : ''}
          onChangeText={text => {
            const ans = text;
            setMyAns(myAns => {
              // copy the old ans as new object
              let tempAns = Object.assign({}, myAns);

              // if this is new line
              if (i === Object.keys(myAns).length) {
                const lastKey =
                  Object.keys(tempAns)[Object.keys(tempAns).length - 1];
                // find the key of this new line
                let newKey;
                if (lastKey) {
                  newKey = (+lastKey + 1).toString();
                } else {
                  newKey = '1';
                }
                // use this key to add new ans to this ans object
                tempAns[newKey] = ans;
              } else {
                // updated ans in the object block
                tempAns[(i + 1).toString()] = ans;
                // remove all empty blanks
                for (let key in tempAns) {
                  if (tempAns[key] === '') {
                    delete tempAns[key];
                  }
                }

                // make the order of keys in order and start from 0 again
                let finalAns: OrderedAns = {};
                let counter = 1;

                for (let key in tempAns) {
                  finalAns[counter.toString()] = tempAns[key];
                  counter++;
                }

                tempAns = finalAns;
              }

              return tempAns;
            });
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  Title: {
    fontSize: 18,
    fontFamily: myFont.GEN,
    color: '#707070',
    lineHeight: 30,
    width: '100%',
    marginVertical: 12,
  },
  FillingContainer: {
    width: 48,
    height: 28,
    margin: 3,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: 18,
    fontSize: 18,
    fontFamily: myFont.GEN,
    textAlign: 'center',
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
  FiBContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '90%',
    marginTop: 15,
  },
});
