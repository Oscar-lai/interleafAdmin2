import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Classifier from './Classifier';

import {customAlphabet} from 'nanoid/non-secure';
import {COLOR, MYCOLOR, myFont} from '../../theme/typography';
import {Sandwich} from '../../hooks/useHWQ';
import {ModelAnsClassifier} from './ModelAnsClassifier';
import {ScrollView} from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Entypo';
Icon.loadFont();

import Icon2 from 'react-native-vector-icons/AntDesign';
import {widthPercentageToDP} from 'react-native-responsive-screen';
Icon2.loadFont();

import DeviceInfo from 'react-native-device-info';

interface ICorrDisplay {
  sandwiches: Sandwich[];
  //   correct: boolean;
  Qindex: number;
  currIndex: number;
  MarkHW: (index: number, currIndex: number, mark: boolean) => void;
  SubmitMark: () => void;
}

const MarkDisplay: React.FC<ICorrDisplay> = ({
  sandwiches,
  Qindex,
  currIndex,
  MarkHW,
  SubmitMark,
}) => {
  // return the overview if it is the last hardcoded page
  if (Qindex === -1 && currIndex === -1) {
    return (
      <View style={styles.FinsihWrapper}>
        <View style={styles.noHWWrapper}>
          <Icon2 name="checkcircleo" size={120} color={MYCOLOR.whiteSmoke} />
          <Text style={styles.noHWText}>已完成所有批改</Text>
        </View>
        <TouchableOpacity style={styles.SubmitButton} onPress={SubmitMark}>
          <Text style={styles.SubmitButtonText}>提交批改</Text>
        </TouchableOpacity>
      </View>
    );
  }
  let FullQuestion = <></>;

  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

  function MarkQ(mark: boolean) {
    MarkHW(Qindex, currIndex, mark);
  }

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
              key={nanoid + index.toString()}
              index={Qindex}
              sandwich={line}
              ReadOnly
              navigation={{}}
            />
          ))}
          <View style={styles.ButtonContainer}>
            <TouchableOpacity
              onPress={() => MarkQ(false)}
              style={[
                styles.Button,
                {
                  backgroundColor: MYCOLOR.lightRed,
                },
              ]}>
              <Icon name="cross" size={24} color={COLOR.whitesmoke} />
              <Text style={styles.ButtonText}>錯誤</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => MarkQ(true)}
              style={[
                styles.Button,
                {
                  backgroundColor: '#B5CD33',
                },
              ]}>
              <Icon name="check" size={24} color={COLOR.whitesmoke} />
              <Text style={styles.ButtonText}>正確</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      </ScrollView>
    );
  }

  return FullQuestion;
};

export default React.memo(MarkDisplay);

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
    width: '40%',
    backgroundColor: MYCOLOR.mainGreen,
    color: 'white',
    borderRadius: 30,
    fontSize: 20,
    marginTop: '10%',
    marginBottom: '15%',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SubmitButtonText: {
    fontFamily: myFont.GEN,
    color: '#FFF',
    fontSize: 20,
  },
  SuggerstAnsText: {
    fontSize: DeviceInfo.isTablet() ? 30 : 20,
    color: MYCOLOR.lightRed,
    fontFamily: myFont.GEN,
    width: '100%',
  },
  ButtonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: '10%',
  },
  Button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 43,
    width: 115,
    borderRadius: 50,
  },
  ButtonText: {
    fontSize: 18,
    color: COLOR.whitesmoke,
    fontFamily: myFont.GEN,
    marginLeft: 5,
  },
  FinsihWrapper: {
    width: widthPercentageToDP(100),
    height: 1,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noHWWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '40%',
    paddingBottom: '15%',
  },
  noHWText: {
    color: MYCOLOR.whiteSmoke,
    fontFamily: myFont.GEN,
    fontSize: 20,
    marginTop: '5%',
  },
});
