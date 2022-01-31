import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ModelAnsClassifier} from '../ModelAnsClassifier';

interface ConditionerProps {
  sandwich: {
    conditional: any;
    condition: any;
    result: any;
    type: string;
    fillings: any[];
  };
}

const Conditioner: React.FC<ConditionerProps> = ({sandwich}) => {
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
  let currCondition = sandwich.fillings[sandwich.condition.filling].modelAns;

  return (
    <View style={styles.Wrapper}>
      <ModelAnsClassifier sandwich={top} />
      {currCondition === myCondition && <ModelAnsClassifier sandwich={bottom} />}
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
