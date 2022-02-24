import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Classifier from './Classifier';

import {customAlphabet} from 'nanoid/non-secure';
import {MYCOLOR, myFont} from '../../theme/typography';
import {Sandwich} from '../../hooks/useHWQ';
import {ModelAnsClassifier} from './ModelAnsClassifier';
import {ScrollView} from 'react-native-gesture-handler';

interface ICorrDisplay {
  sandwiches: Sandwich[];
  correct: boolean;
  Qindex: number;
}

const CorrDisplay: React.FC<ICorrDisplay> = ({sandwiches, Qindex, correct}) => {
  let FullQuestion = <></>;

  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

  // load all the lines from the question sandwich
  if (sandwiches) {
    FullQuestion = (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
        }}
        style={{height: '100%'}}>
        <View style={styles.HWQWrapper}>
          {sandwiches.map((line, index: number) => (
            <Classifier
              index={Qindex}
              key={nanoid + index.toString()}
              sandwich={line}
              navigation={{}}
            />
          ))}
        </View>
        {!correct && (
          <View style={styles.modelAnsWrapper}>
            <View style={styles.modelAnsInnerWrapper}>
              <Text style={styles.SuggerstAnsText}>建議答案：</Text>
              {sandwiches.map((line, index: number) => (
                <ModelAnsClassifier
                  key={nanoid + index.toString()}
                  sandwich={line}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    );
  }

  return FullQuestion;
};

export default React.memo(CorrDisplay);

const styles = StyleSheet.create({
  BigWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    minHeight: '100%',
  },
  HWQWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  modelAnsWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#E2E2E2',
    paddingHorizontal: 40,
    marginTop: 50,
    paddingTop: 20,
    paddingBottom: 50,
    // for making this invisible when img-x / img-y is expanded
    zIndex: -1,
  },
  modelAnsInnerWrapper: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  SubmitButton: {
    height: 40,
    width: '90%',
    backgroundColor: MYCOLOR.mainOrange,
    color: 'white',
    borderRadius: 30,
    fontSize: 20,
    marginTop: '10%',
    marginBottom: '15%',
    marginHorizontal: '5%',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubmitButtonText: {
    fontFamily: myFont.GEN,
    color: '#FFF',
    fontSize: 22,
  },
  SuggerstAnsText: {
    fontSize: 20,
    color: MYCOLOR.lightRed,
    fontFamily: myFont.GEN,
    width: '100%',
  },
});