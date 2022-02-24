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

const BarChartX: React.FC<IBarChart> = ({sandwich, ReadOnly, modelAns}) => {
  let legendXWidth = DeviceInfo.isTablet() ? 80 : 50;
  let legendYHeight = DeviceInfo.isTablet() ? 30 : 20;
  let xAxisThick = DeviceInfo.isTablet() ? 3 : 2;

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
    //No matter the number of the grid, the distance between lengends is 2 grid
    let label_label_sparation = gridWidth * 2;
    return label_label_sparation - legendXWidth;
  }

  function xLengendSeparation_primary(width: number) {
    let gridWidth = width / layer[1];
    let label_axis_sparation = gridWidth * 1.5;
    return label_axis_sparation - legendXWidth / 2;
  }

  function yLengendSeparation(height: number) {
    let gridHeight = height / layer[0];
    let label_label_sparation = gridHeight;
    return label_label_sparation - legendYHeight;
  }

  return (
    <View style={styles.BarChartContainer}>
      <View
        // onLayout={onLayout}
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
        <View style={styles.XLegendContainer}>
          {xLegend.map((value: string, index: number) => (
            <React.Fragment key={index}>
              {value === '-' ? (
                <></>
              ) : // need work on the spacing here

              value === '' ? (
                <XLegendInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  key={index}
                  fill={fillings[++counter]}
                  isFirst={index === 1}
                  // percentNormal={(myWidth * 2) / xLegend.length - legendXWidth}
                  // percentFirst={
                  //   (myWidth * 1.5) / xLegend.length - legendXWidth / 2
                  // }
                  percentNormal={xLengendSeparation(myWidth)}
                  percentFirst={xLengendSeparation_primary(myWidth)}
                />
              ) : (
                <Text
                  style={[
                    styles.XLegendDisplay,
                    {width: legendXWidth},
                    index === 1
                      ? {
                          marginLeft: xLengendSeparation_primary(myWidth),
                        }
                      : {
                          marginLeft: xLengendSeparation(myWidth),
                        },
                  ]}
                  key={index}
                  numberOfLines={1}
                  adjustsFontSizeToFit>
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
          type="x"
          ReadOnly={ReadOnly}
          modelAns={modelAns ?? false}
          onLayout={onLayout}
        />
      </View>
      <View
        style={[
          styles.Ycontainer,
          {height: myHeight + legendYHeight / 2 + xAxisThick},
        ]}>
        <View style={styles.YLegendContainer}>
          {yLegend.map((legend: string, index: number) => (
            <React.Fragment key={index}>
              {legend === '' ? (
                <YLegendInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  key={index}
                  fill={fillings[++counter]}
                  separation={yLengendSeparation(myHeight)}
                />
              ) : (
                <Text
                  style={[
                    styles.YLegendText,
                    {marginTop: yLengendSeparation(myHeight)},
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

export default BarChartX;

interface IInput {
  fill: any;
  ReadOnly: boolean;
  modelAns: boolean;
  separation?: number;
}

const XLabelInput: React.FC<IInput> = ({fill, ReadOnly, modelAns}) => {
  const [myAns, setmyAns] = useState<string>(
    modelAns ? fill.modelAns ?? '' : fill.ans ?? '',
  );

  return (
    <TextInput
      value={myAns}
      editable={!ReadOnly}
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
  isFirst: boolean;
  percentNormal: number;
  percentFirst: number;
  ReadOnly: boolean;
  modelAns: boolean;
}

const XLegendInput: React.FC<IXLegendInput> = ({
  fill,
  isFirst,
  percentFirst,
  percentNormal,
  ReadOnly,
  modelAns,
}) => {
  const [myAns, setmyAns] = useState<string>(
    modelAns ? fill.modelAns ?? '' : fill.ans ?? '',
  );

  let legendXWidth = DeviceInfo.isTablet() ? 80 : 50;

  return (
    <TextInput
      editable={!ReadOnly}
      style={[
        styles.XLegendInputBox,
        {width: legendXWidth},
        modelAns ? {color: MYCOLOR.lightRed} : {},
        isFirst
          ? {
              marginLeft: percentFirst,
            }
          : {
              marginLeft: percentNormal,
            },
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

const YLegendInput: React.FC<IInput> = ({
  fill,
  ReadOnly,
  modelAns,
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
        {marginTop: separation},
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
    // transform: [{translateY: 10}],
    marginHorizontal: DeviceInfo.isTablet() ? 6 : 3,
    // backgroundColor: 'black',
  },
  XLegendContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: DeviceInfo.isTablet() ? '3%' : '5%',
  },
  YLabelInputBox: {
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 40 : 28,
    width: DeviceInfo.isTablet() ? 120 : 85,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 10 : 8,
    fontSize: DeviceInfo.isTablet() ? 26 : 16,
    marginRight: DeviceInfo.isTablet() ? 20 : -8,
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
    height: DeviceInfo.isTablet() ? 40 : 28,
    width: DeviceInfo.isTablet() ? 150 : 120,
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
    height: DeviceInfo.isTablet() ? 40 : 28,
    width: DeviceInfo.isTablet() ? 150 : 100,
    lineHeight: DeviceInfo.isTablet() ? 40 : 28,
    color: '#707070',
    backgroundColor: 'transparent',
    fontSize: DeviceInfo.isTablet() ? 26 : 16,
    fontFamily: myFont.GEN,
    marginTop: DeviceInfo.isTablet() ? 15 : 10,
  },
  YLegendInputBox: {
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 30 : 20,
    // margin: DeviceInfo.isTablet() ? 6 : 4,
    width: DeviceInfo.isTablet() ? 40 : 30,
    color: '#707070',
    fontFamily: myFont.GEN,
    backgroundColor: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 10 : 7,
    fontSize: DeviceInfo.isTablet() ? 22 : 14,
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
    textAlign: 'center',
    height: DeviceInfo.isTablet() ? 30 : 20,
    // marginVertical: DeviceInfo.isTablet() ? 5.5 : 4,
    width: 30,
    lineHeight: DeviceInfo.isTablet() ? 30 : 28,
    color: '#707070',
    fontFamily: myFont.GEN,
    backgroundColor: 'transparent',
    fontSize: DeviceInfo.isTablet() ? 22 : 14,
  },
  XLegendInputBox: {
    height: DeviceInfo.isTablet() ? 40 : 28,
    // width: DeviceInfo.isTablet() ? 80 : 50,
    fontFamily: myFont.GEN,
    color: '#707070',
    backgroundColor: '#FFF',
    borderRadius: DeviceInfo.isTablet() ? 15 : 10,
    fontSize: DeviceInfo.isTablet() ? 24 : 16,
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
    height: DeviceInfo.isTablet() ? 40 : 28,
    // width: DeviceInfo.isTablet() ? 80 : 50,
    fontFamily: myFont.GEN,
    lineHeight: DeviceInfo.isTablet() ? 40 : 28,
    color: '#707070',
    backgroundColor: 'transparent',
    fontSize: DeviceInfo.isTablet() ? 24 : 16,
    textAlign: 'center',
  },
});
