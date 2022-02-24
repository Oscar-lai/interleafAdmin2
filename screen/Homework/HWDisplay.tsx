import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Classifier from './Classifier';

import {customAlphabet} from 'nanoid/non-secure';
import {MYCOLOR, myFont} from '../../theme/typography';
import {Sandwich} from '../../hooks/useHWQ';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DeviceInfo from 'react-native-device-info';


interface IQuestionDisplay {
  sandwiches: Sandwich[];
  camera: boolean;
  photo: string[];
  Qindex: number;
  lastQ: boolean;
  modelAns?: boolean;
  readOnly?: boolean;
  submit: () => void;
  //   noSwipe: (flag: boolean) => void;
  navigation: any;
}

const QuestionDisplay: React.FC<IQuestionDisplay> = ({
  sandwiches,
  Qindex,
  lastQ,
  camera,
  modelAns,
  readOnly,
  submit,
  navigation,
  photo,
}) => {
  let FullQuestion = <></>;
  //   let TimeUsedBefore = 0;

  // const [id] = useState(nanoid(16));
  //   const id = nanoid(16);

  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

  //   if (sandwiches) {
  // get the time users has used from this q before if any
  // if (time) {
  //   TimeUsedBefore = time;
  // }

  // load all the lines from the question sandwich
  if (sandwiches) {
    FullQuestion = (
      // scroll to input when keyboard is up
      <KeyboardAwareScrollView
        // this is for the weird bouncing bug
        keyboardOpeningTime={Number.MAX_SAFE_INTEGER}
        showsVerticalScrollIndicator={false}
        style={{height: 1, flex: 1}}>
        <View style={styles.HWQWrapper}>
          {sandwiches.map((line, index: number) => (
            <Classifier
              index={Qindex}
              key={nanoid + index.toString()}
              sandwich={line}
              ReadOnly={readOnly ?? false}
              navigation={navigation}
              photo={photo}
            />
          ))}
          {lastQ && (
            <TouchableOpacity style={styles.SubmitButton} onPress={submit}>
              <Text style={styles.SubmitButtonText}>提交</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAwareScrollView>
    );
  }

  return FullQuestion;
};

// use the memo here to prevent each q re-render when parent states change
export default React.memo(QuestionDisplay);

const styles = StyleSheet.create({
  HWQWrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  SubmitButton: {
    height: DeviceInfo.isTablet() ? 70 : 40,
    width: DeviceInfo.isTablet() ? '35%' : '55%',
    backgroundColor: MYCOLOR.mainOrange,
    color: 'white',
    borderRadius: 50,
    marginTop: '10%',
    marginBottom: '15%',
    marginHorizontal: '5%',
    flexShrink: 0,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  SubmitButtonText: {
    fontFamily: myFont.GEN,
    color: '#FFF',
    fontSize: DeviceInfo.isTablet() ? 30 : 22,
  },
});
