import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import {Sandwich} from '../../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../../theme/typography';
import BarChartPressable from './BarChartPressable';
import DeviceInfo from 'react-native-device-info';

interface IBarChart {
  sandwich: Sandwich;
  ReadOnly: boolean;
  modelAns?: boolean;
}

const BarChartY: React.FC<IBarChart> = ({sandwich, ReadOnly, modelAns}) => {
  let legendXWidth = DeviceInfo.isTablet() ? 50 : 25;
  let legendYHeight = DeviceInfo.isTablet() ? 40 : 24;
  let yAxisThick = DeviceInfo.isTablet() ? 3 : 2;

  const fillings = sandwich.fillings;

  const bread = sandwich.bread;
  const layer = sandwich.layer;

  const xLabel = bread['x-label'];
  const yLabel = bread['y-label'];
  const xLegend = bread['x-legend'];
  const yLegend = bread['y-legend'];

  let counter = 0;

  const [myWidth, setMyWidth] = useState<number>(0);
  const [myHeight, setMyHeight] = useState<number>(0);

  const onLayout = useCallback(event => {
    const {height, width} = event.nativeEvent.layout;
    setMyWidth(width);
    setMyHeight(height);
  }, []);

  function xLengendSeparation(width: number) {
    let gridWidth = width / layer[1];
    let label_label_sparation = gridWidth;
    return label_label_sparation - legendXWidth;
  }

  function yLengendSeparation(height: number) {
    let gridHeight = height / layer[0];
    let label_label_sparation = gridHeight;
    return label_label_sparation - legendYHeight;
  }

  function yLengendSeparation_primary(height: number) {
    let gridWidth = height / layer[0];
    let label_axis_sparation = gridWidth / 2;
    return label_axis_sparation - legendXWidth / 2;
  }

  return (
    <View style={styles.BarChartContainer}>
      <View
        style={[
          styles.BarContainer,
          DeviceInfo.isTablet() ? {width: '80%'} : {flex: 1},
        ]}>
        {xLabel === '' ? (
          <XLabelInput
            modelAns={modelAns ?? false}
            ReadOnly={ReadOnly}
            fill={fillings[++counter]}
          />
        ) : (
          <Text style={styles.XLabelText}>{xLabel}</Text>
        )}
        <View
          style={[
            styles.XLegendContainer,
            {transform: [{translateX: -(legendXWidth / 2 + yAxisThick)}]},
          ]}>
          {xLegend.map((value: string, index: number) => (
            <React.Fragment key={index}>
              {value === '' ? (
                <XLegendInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  key={index}
                  fill={fillings[++counter]}
                  // marginRight={100 / xLegend.length}
                  marginRight={xLengendSeparation(myWidth)}
                  width={legendXWidth}
                />
              ) : (
                <Text
                  style={[
                    styles.XLegendDisplay,
                    {
                      width: legendXWidth,
                      marginRight: xLengendSeparation(myWidth),
                    },
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
          onLayout={onLayout}
        />
      </View>
      <View style={[styles.Ycontainer, {height: myHeight}]}>
        <View style={styles.YLegendContainer}>
          {yLegend.map((legend: string, index: number) => (
            <React.Fragment key={index}>
              {legend === '-' ? (
                <View
                  style={[
                    styles.YLegendDummy,
                    {
                      height: legendYHeight,
                      marginBottom:
                        index === 0
                          ? yLengendSeparation_primary(myHeight)
                          : yLengendSeparation(myHeight),
                    },
                  ]}
                />
              ) : legend === '' ? (
                <YLegendInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  fill={fillings[++counter]}
                  height={legendYHeight}
                  separation={
                    index === 0
                      ? yLengendSeparation_primary(myHeight)
                      : yLengendSeparation(myHeight)
                  }
                />
              ) : (
                <Text
                  style={[
                    styles.YLegendText,
                    {
                      height: legendYHeight,
                      marginBottom:
                        index === 0
                          ? yLengendSeparation_primary(myHeight)
                          : yLengendSeparation(myHeight),
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
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
  marginRight: number;
  ReadOnly: boolean;
  modelAns: boolean;
  width?: number;
}

const XLegendInput: React.FC<IXLegendInput> = ({
  fill,
  marginRight,
  ReadOnly,
  modelAns,
  width,
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
        {width: width, marginRight: marginRight},
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

interface IYLegendInput {
  fill: any;
  ReadOnly: boolean;
  modelAns: boolean;
  height: number;
  separation: number;
}

const YLegendInput: React.FC<IYLegendInput> = ({
  fill,
  ReadOnly,
  modelAns,
  height,
  separation,
}) => {
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
        {height: height, marginBottom: separation},
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
    // width: 1,
    // flex: 1,
  },
  Ycontainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'black',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  XLegendContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: DeviceInfo.isTablet() ? 6 : 3,
    // transform: [{translateX: -15}],
  },
  YLabelInputBox: {
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 40 : 22,
    width: DeviceInfo.isTablet() ? 120 : 85,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 10 : 8,
    fontSize: DeviceInfo.isTablet() ? 26 : 16,
    marginRight: DeviceInfo.isTablet() ? 20 : -5,
    fontFamily: myFont.GEN,
    transform: [{rotate: '270deg'}],
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.2,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    padding: 0,
  },
  YLabelText: {
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 50 : 28,
    width: DeviceInfo.isTablet() ? 150 : 50,
    color: '#707070',
    backgroundColor: 'transparent',
    fontSize: DeviceInfo.isTablet() ? 26 : 16,
    fontFamily: myFont.GEN,
    marginRight: DeviceInfo.isTablet() ? 8 : 3,
    transform: [{rotate: '270deg'}],
  },
  XLabelInputBox: {
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 40 : 28,
    width: DeviceInfo.isTablet() ? 90 : 55,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 15 : 10,
    fontSize: DeviceInfo.isTablet() ? 26 : 16,
    fontFamily: myFont.GEN,
    marginTop: DeviceInfo.isTablet() ? 15 : 10,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.2,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    padding: 0,
  },
  XLabelText: {
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 50 : 28,
    width: DeviceInfo.isTablet() ? 150 : 100,
    // lineHeight: DeviceInfo.isTablet() ? 40 : 28,
    color: '#707070',
    backgroundColor: 'transparent',
    fontSize: DeviceInfo.isTablet() ? 26 : 16,
    fontFamily: myFont.GEN,
    marginTop: DeviceInfo.isTablet() ? 15 : 10,
  },
  YLegendInputBox: {
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 40 : 24,
    width: DeviceInfo.isTablet() ? 60 : 40,
    marginHorizontal: DeviceInfo.isTablet() ? 7 : 3,
    color: '#707070',
    fontFamily: myFont.GEN,
    backgroundColor: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 15 : 10,
    fontSize: DeviceInfo.isTablet() ? 24 : 14,
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.2,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    padding: 0,
  },
  YLegendText: {
    // height: DeviceInfo.isTablet() ? 40 : 24,
    marginHorizontal: DeviceInfo.isTablet() ? 7 : 3,
    // lineHeight: DeviceInfo.isTablet() ? 40 : 24,
    fontSize: DeviceInfo.isTablet() ? 24 : 14,
    width: DeviceInfo.isTablet() ? 75 : 40,
    color: '#707070',
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  XLegendInputBox: {
    height: DeviceInfo.isTablet() ? 30 : 20,
    width: DeviceInfo.isTablet() ? 40 : 30,
    fontFamily: myFont.GEN,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 10 : 7,
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
    textAlign: 'center',
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: DeviceInfo.isTablet() ? 4 : 3,
    shadowOpacity: 0.2,
    elevation: DeviceInfo.isTablet() ? 4 : 2,
    padding: 0,
  },
  XLegendDisplay: {
    height: DeviceInfo.isTablet() ? 30 : 20,
    // width: DeviceInfo.isTablet() ? 40 : 30,
    fontFamily: myFont.GEN,
    // lineHeight: DeviceInfo.isTablet() ? 30 : 28,
    color: '#707070',
    fontSize: DeviceInfo.isTablet() ? 18 : 14,
    textAlign: 'center',
  },
  YLegendDummy: {
    // height: 28,
    width: DeviceInfo.isTablet() ? 80 : 50,
  },
});
