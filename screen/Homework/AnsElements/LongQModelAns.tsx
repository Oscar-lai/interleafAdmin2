import {customAlphabet} from 'nanoid/non-secure';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Filling} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';
import Fraction from '../HWElements/Fraction';

export const LongQModelAns: React.FC<{filling: Filling}> = ({filling}) => {
  const modelAns = filling.modelAns;

  const [id] = useState(
    customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16),
  );

  return (
    <View style={styles.LongQModelAnsContainer}>
      {Array.isArray(modelAns) &&
        modelAns.map((ans, index: number) => (
          <React.Fragment key={index + id}>
            {typeof ans === 'string' ? (
              <Text style={styles.LongQAnsText}>{ans}</Text>
            ) : (
              Object.keys(ans).map((key: any, index2: number) => (
                <React.Fragment key={index + index2 + id}>
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
                </React.Fragment>
              ))
            )}
          </React.Fragment>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  LongQModelAnsContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  LongQAnsText: {
    fontSize: 18,
    textAlign: 'center',
    color: MYCOLOR.lightRed,
    flexShrink: 0,
    height: 50,
    lineHeight: 50,
    margin: 0,
    flexWrap: 'wrap',
    fontFamily: myFont.GEN,
  },
});
