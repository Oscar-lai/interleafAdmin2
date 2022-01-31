import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TextInput} from 'react-native';
import {Sandwich} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';

interface IHMS {
  sandwich: Sandwich;
  ReadOnly: boolean;
  modelAns?: boolean;
}

const HWComponent: React.FC<IHMS> = ({sandwich, ReadOnly, modelAns}) => {
  const fill = sandwich.fillings;

  const [Hour, setHour] = useState<string>(
    modelAns ? fill[0].modelAns ?? '' : fill[0].ans ?? '',
  );
  const [Min, setMin] = useState<string>(
    modelAns ? fill[1].modelAns ?? '' : fill[2].ans ?? '',
  );
  const [Second, setSecond] = useState<string>(
    modelAns ? fill[2].modelAns ?? '' : fill[2].ans ?? '',
  );

  useEffect(() => {
    fill[0].ans = Hour;
  }, [Hour]);

  useEffect(() => {
    fill[1].ans = Min;
  }, [Min]);

  useEffect(() => {
    fill[2].ans = Second;
  }, [Second]);

  return (
    <View style={styles.BigWrapper}>
      <Text style={styles.Title}>鐘面顯示的時間是</Text>
      <View style={styles.BottomWrapper}>
        <View style={styles.BoxWrapper}>
          <TextInput
            editable={!ReadOnly}
            style={[styles.Input, modelAns ? {color: MYCOLOR.lightRed} : {}]}
            value={Hour}
            onChangeText={text => {
              setHour(text);
            }}
            maxLength={2}
          />
          <Text style={styles.SubTitle}>時</Text>
        </View>
        <Text style={styles.colonText}>:</Text>
        <View style={styles.BoxWrapper}>
          <TextInput
            editable={!ReadOnly}
            style={[styles.Input, modelAns ? {color: MYCOLOR.lightRed} : {}]}
            value={Min}
            onChangeText={text => {
              setMin(text);
            }}
            maxLength={2}
          />
          <Text style={styles.SubTitle}>分</Text>
        </View>
        <Text style={styles.colonText}>:</Text>
        <View style={styles.BoxWrapper}>
          <TextInput
            editable={!ReadOnly}
            style={[styles.Input, modelAns ? {color: MYCOLOR.lightRed} : {}]}
            value={Second}
            onChangeText={text => {
              setSecond(text);
            }}
            maxLength={2}
          />
          <Text style={styles.SubTitle}>秒</Text>
        </View>
      </View>
    </View>
  );
};

export default HWComponent;

const styles = StyleSheet.create({
  BigWrapper: {
    width: '100%',
    marginVertical: 50,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Title: {
    fontSize: 20,
    fontFamily: myFont.GEN,
    color: '#707070',
    marginBottom: 10,
  },
  SubTitle: {
    fontSize: 20,
    fontFamily: myFont.GEN,
    color: '#D2D2D2',
  },
  BottomWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  BoxWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colonText: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#707070',
    marginTop: 6,
  },
  Input: {
    height: 35,
    fontSize: 18,
    width: 40,
    fontFamily: myFont.GEN,
    marginVertical: 7.5,
    marginHorizontal: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    // borderWidth: 1,
    // borderColor: '#FFF',
    // borderBottomColor: '#707070',
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
    padding: 0,
  },
});
