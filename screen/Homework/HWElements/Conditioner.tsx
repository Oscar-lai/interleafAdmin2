import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Classifier from '../Classifier';

interface ConditionerProps {
  sandwich: any;
  ReadOnly: boolean;
}

const Conditioner: React.FC<ConditionerProps> = ({sandwich, ReadOnly}) => {
  let counter = -1;

  let top = sandwich.conditional;
  top.fillings = [];
  let bottom = sandwich.result;
  bottom.fillings = [];

  const topKey = Object.keys(top.bread);
  const bottomKey = Object.keys(bottom.bread);

  topKey.map((key: string) => {
    if (top.bread[key] === '') {
      top.fillings.push(sandwich.fillings[++counter]);
    }
  });

  bottomKey.map((key: string) => {
    if (bottom.bread[key] === '') {
      bottom.fillings.push(sandwich.fillings[++counter]);
    }
  });

  const myCondition = sandwich.condition.ans;
  let currCondition = sandwich.fillings[sandwich.condition.filling].ans;

  // just a dummy useState for refreshing the dom
  const [conditionDummy, setconditionDummy] = useState<number>(0);

  return (
    <View style={styles.Wrapper}>
      {/* the condition on top, must be shown no matter what */}
      <Classifier
        sandwich={top}
        condition={setconditionDummy}
        ReadOnly={ReadOnly}
        navigation={{}}
      />
      {/* only show below if the condition matches */}
      {currCondition === myCondition && (
        <Classifier sandwich={bottom} ReadOnly={ReadOnly} navigation={{}} />
      )}
    </View>
  );
};

export default Conditioner;

const styles = StyleSheet.create({
  Wrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
