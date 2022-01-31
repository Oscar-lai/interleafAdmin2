import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Sandwich} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';
import BarChartPressable from './BarChartPressable';

interface IBarChart {
  sandwich: Sandwich;
  ReadOnly: boolean;
  modelAns?: boolean;
}

const BarChartY: React.FC<IBarChart> = ({sandwich, ReadOnly, modelAns}) => {
  const fillings = sandwich.fillings;

  const bread = sandwich.bread;
  const layer = sandwich.layer;

  const xLabel = bread['x-label'];
  const yLabel = bread['y-label'];
  const xLegend = bread['x-legend'];
  const yLegend = bread['y-legend'];

  let counter = 0;

  // const [myWidth, setMyWidth] = useState<number>(0);

  // const onLayout = useCallback(event => {
  //   const {width} = event.nativeEvent.layout;
  //   setMyWidth(width);
  // }, []);

  return (
    <View style={styles.BarChartContainer}>
      <View style={styles.BarContainer}>
        {xLabel === '' ? (
          <XLabelInput
            modelAns={modelAns ?? false}
            ReadOnly={ReadOnly}
            fill={fillings[++counter]}
          />
        ) : (
          <Text style={styles.XLabelText}>{xLabel}</Text>
        )}
        <View style={styles.XLegendContainer}>
          {xLegend.map((value: string, index: number) => (
            <React.Fragment key={index}>
              {value === '' ? (
                <XLegendInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  key={index}
                  fill={fillings[++counter]}
                  percent={100 / xLegend.length}
                />
              ) : (
                <Text
                  style={[
                    styles.XLegendDisplay,
                    {width: `${100 / xLegend.length}%`},
                  ]}
                  key={index}>
                  {value}
                </Text>
              )}
            </React.Fragment>
          ))}
        </View>
        <BarChartPressable
          height={layer[0]}
          width={layer[1]}
          fill={fillings[0]}
          type="y"
          ReadOnly={ReadOnly}
          modelAns={modelAns ?? false}
        />
      </View>
      <View style={[styles.Ycontainer, {height: yLegend.length * 28}]}>
        <View style={styles.YLegendContainer}>
          {yLegend.map((legend: string, index: number) => (
            <React.Fragment key={index}>
              {legend === '-' ? (
                <View style={styles.YLegendDummy} />
              ) : legend === '' ? (
                <YLegendInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  fill={fillings[++counter]}
                />
              ) : (
                <Text
                  style={[
                    styles.YLegendText,
                    {fontSize: legend.length > 3 ? 12 : 14},
                  ]}>
                  {legend}
                </Text>
              )}
            </React.Fragment>
          ))}
        </View>
        <View style={styles.YLabelcontainer}>
          {yLabel === '' ? (
            <YLabelInput
              modelAns={modelAns ?? false}
              ReadOnly={ReadOnly}
              fill={fillings[++counter]}
            />
          ) : (
            <TextInput
              style={styles.YLabelText}
              value={yLabel}
              editable={false}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default BarChartY;

interface IInput {
  fill: any;
  ReadOnly: boolean;
  modelAns: boolean;
}

const XLabelInput: React.FC<IInput> = ({fill, ReadOnly, modelAns}) => {
  const [myAns, setmyAns] = useState<string>(
    modelAns ? fill.modelAns ?? '' : fill.ans ?? '',
  );

  return (
    <TextInput
      editable={!ReadOnly}
      value={myAns}
      onChangeText={text => {
        setmyAns(text);
        fill.ans = text;
      }}
      style={[styles.XLabelInputBox, modelAns ? {color: MYCOLOR.lightRed} : {}]}
    />
  );
};

interface IXLegendInput {
  fill: any;
  percent: number;
  ReadOnly: boolean;
  modelAns: boolean;
}

const XLegendInput: React.FC<IXLegendInput> = ({
  fill,
  percent,
  ReadOnly,
  modelAns,
}) => {
  const [myAns, setmyAns] = useState<string>(
    modelAns ? fill.modelAns ?? '' : fill.ans ?? '',
  );

  return (
    <TextInput
      editable={!ReadOnly}
      style={[
        styles.XLegendInputBox,
        modelAns ? {color: MYCOLOR.lightRed} : {},
        {width: percent + '%'},
      ]}
      value={myAns}
      onChangeText={text => {
        setmyAns(text);
        fill.ans = text;
      }}
    />
  );
};

const YLabelInput: React.FC<IInput> = ({fill, ReadOnly, modelAns}) => {
  const [myAns, setmyAns] = useState<string>(
    modelAns ? fill.modelAns ?? '' : fill.ans ?? '',
  );

  return (
    <TextInput
      editable={!ReadOnly}
      value={myAns}
      onChangeText={text => {
        setmyAns(text);
        fill.ans = text;
      }}
      style={[styles.YLabelInputBox, modelAns ? {color: MYCOLOR.lightRed} : {}]}
    />
  );
};

const YLegendInput: React.FC<IInput> = ({fill, ReadOnly, modelAns}) => {
  const [myAns, setmyAns] = useState<string>(
    modelAns ? fill.modelAns ?? '' : fill.ans ?? '',
  );

  return (
    <TextInput
      editable={!ReadOnly}
      value={myAns}
      onChangeText={text => {
        setmyAns(text);
        fill.ans = text;
      }}
      style={[
        styles.YLegendInputBox,
        modelAns ? {color: MYCOLOR.lightRed} : {},
        {borderColor: myAns !== '' ? '#DDDDDD' : '#707070'},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  BarChartContainer: {
    width: '100%',
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  BarContainer: {
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 1,
    flex: 1,
  },
  Ycontainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  YLabelcontainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    marginHorizontal: 3,
  },
  YLegendContainer: {
    height: '100%',
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  XLegendContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '5%',
    transform: [{translateX: -15}],
  },
  YLabelInputBox: {
    textAlign: 'center',
    height: 28,
    width: 85,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: 10,
    fontSize: 16,
    marginRight: -8,
    fontFamily: myFont.GEN,
    transform: [{rotate: '270deg'}],
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
  YLabelText: {
    textAlign: 'center',
    height: 28,
    width: 100,
    color: '#000',
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: myFont.GEN,
    marginRight: 3,
    transform: [{rotate: '270deg'}],
  },
  XLabelInputBox: {
    textAlign: 'center',
    height: 28,
    width: 55,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: 10,
    fontSize: 16,
    fontFamily: myFont.GEN,
    marginTop: 10,
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
  XLabelText: {
    textAlign: 'center',
    height: 28,
    width: 100,
    lineHeight: 28,
    color: '#707070',
    backgroundColor: 'transparent',
    fontSize: 16,
    fontFamily: myFont.GEN,
    marginTop: 10,
  },
  YLegendInputBox: {
    textAlign: 'center',
    height: 24,
    marginVertical: 2,
    width: 50,
    color: '#707070',
    fontFamily: myFont.GEN,
    backgroundColor: '#FFF',
    borderRadius: 20,
    fontSize: 14,
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
  YLegendText: {
    height: 24,
    marginVertical: 2,
    width: 50,
    color: '#707070',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  XLegendInputBox: {
    height: 28,
    fontFamily: myFont.GEN,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: 10,
    fontSize: 16,
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
  XLegendDisplay: {
    height: 28,
    width: 50,
    fontFamily: myFont.GEN,
    lineHeight: 28,
    color: '#707070',
    backgroundColor: 'transparent',
    fontSize: 16,
    textAlign: 'center',
  },
  YLegendDummy: {
    height: 28,
    width: 50,
  },
});
