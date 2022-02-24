import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View, _Text} from 'react-native';
import {Sandwich} from '../../../hooks/useHWQ';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {MYCOLOR, myFont} from '../../../theme/typography';

interface INumberLine {
  sandwich: Sandwich;
  ReadOnly: boolean;
  modelAns?: boolean;
}

type ValueType = [number, number];

export const NumberLine: React.FC<INumberLine> = ({
  sandwich,
  ReadOnly,
  modelAns,
}) => {
  const filling = sandwich.fillings[0];
  const start = +sandwich.bread['1'];

  let defaultValue = [start, start];

  if (ReadOnly) {
    defaultValue = modelAns
      ? filling.modelAns ?? defaultValue
      : filling.ans ?? defaultValue;
  }

  if (typeof defaultValue[0] === 'string') {
    defaultValue = defaultValue.map(v => {
      return Number(v);
    });
  }

  console.log('Line ans');
  console.log(defaultValue);

  const [oldState, setOldState] = useState<ValueType | number[]>(defaultValue);
  const [value, setValue] = useState<number[]>(defaultValue);
  const [Key, setKey] = useState<string>(Math.random().toString());

  let marks = [];

  for (let i = 0; i <= 18; i++) {
    marks.push(i);
  }

  useEffect(() => {
    console.log(value);
  }, [value]);

  useEffect(() => {
    console.log(Key);
  }, [Key]);

  return (
    <View style={styles.Wrapper}>
      <MultiSlider
        values={value}
        key={Key}
        sliderLength={widthPercentageToDP('70%')}
        selectedStyle={{
          backgroundColor: MYCOLOR.mainOrange,
          height: 8,
        }}
        unselectedStyle={{
          backgroundColor: '#EAEAEA',
          height: 8,
        }}
        min={0}
        max={18}
        isMarkersSeparated
        customMarkerLeft={value[1] === start ? LowerMarker : MarkerDummy}
        customMarkerRight={value[0] === start ? UpperMarker : MarkerDummy}
        step={1}
        snapped
        allowOverlap
        enabledOne={!ReadOnly}
        enabledTwo={!ReadOnly}
        onValuesChange={(v: number[]) => {
          if (v[0] !== start && v[1] !== start) {
            v[0] = oldState[0];
            v[1] = oldState[1];
            setValue([oldState[0], oldState[1]]);
            setKey(Math.random().toString());
          } else {
            setOldState(v);
            var stringValue = v.map(e => {
              return e.toString();
            });
            filling.ans = stringValue;
            setValue([v[0], v[1]]);
          }
        }}
      />
      <View style={styles.MarkingWrapper}>
        {marks.map(num => (
          <Text style={styles.MarkingText} key={num}>
            {num}
          </Text>
        ))}
      </View>
    </View>
  );
};

const LowerMarker = () => {
  return (
    <View style={styles.customMarkerLeftContainer}>
      <View style={styles.customMarkerLeft}>
        {/* <Text style={styles.myText}>−</Text> */}
        <View style={styles.MarkerLineAbove} />
      </View>
    </View>
  );
};

const UpperMarker = () => {
  return (
    <View style={styles.customMarkerRightContainer}>
      <View style={styles.customMarkerRight}>
        {/* <Text style={styles.myText}>+</Text> */}
        <View style={styles.MarkerLineBelow} />
      </View>
    </View>
  );
};

const MarkerDummy = () => {
  return <></>;
};

const styles = StyleSheet.create({
  Wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 55,
    marginTop: 20,
  },
  customMarkerRightContainer: {
    width: 30,
    height: 55,
    paddingBottom: 45,
    marginBottom: 45,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    position: 'relative',

    // transform: [{translateY: 60}],
  },
  customMarkerRight: {
    width: 30,
    height: 30,
    borderRadius: 40,
    backgroundColor: MYCOLOR.mainOrange,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -5,
  },
  customMarkerLeftContainer: {
    width: 30,
    height: 65,
    paddingBottom: 45,
    marginBottom: 45,
    // marginTop: 120,
    transform: [{translateY: 60}],
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  customMarkerLeft: {
    width: 30,
    height: 30,
    borderRadius: 40,
    backgroundColor: MYCOLOR.mainOrange,
    marginTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginLeft: -5,
  },
  MarkerLineBelow: {
    position: 'absolute',
    top: 30,
    left: 11,
    width: 7,
    height: 25,
    backgroundColor: MYCOLOR.mainOrange,
  },
  MarkerLineAbove: {
    position: 'absolute',
    top: -35,
    left: 11,
    width: 7,
    height: 35,
    backgroundColor: MYCOLOR.mainOrange,
  },
  myText: {
    fontFamily: myFont.GEN,
    color: '#FFF',
    fontSize: 18,
  },
  MarkingWrapper: {
    width: widthPercentageToDP('72%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -16,
  },
  MarkingText: {
    width: 14,
    fontSize: 12,
  },
});
