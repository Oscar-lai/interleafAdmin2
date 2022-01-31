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

const BarChartX: React.FC<IBarChart> = ({sandwich, ReadOnly, modelAns}) => {
  const fillings = sandwich.fillings;

  const bread = sandwich.bread;
  const layer = sandwich.layer;

  const xLabel = bread['x-label'];
  const yLabel = bread['y-label'];
  const xLegend = bread['x-legend'];
  const yLegend = bread['y-legend'];

  let counter = 0;

  const [myWidth, setMyWidth] = useState<number>(0);

  const onLayout = useCallback(event => {
    const {width} = event.nativeEvent.layout;
    setMyWidth(width);
  }, []);

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
        <View onLayout={onLayout} style={styles.XLegendContainer}>
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
                  percentNormal={(myWidth * 2) / xLegend.length - 50}
                  percentFirst={(myWidth * 1.5) / xLegend.length - 25}
                />
              ) : (
                <Text
                  style={[
                    styles.XLegendDisplay,
                    index === 1
                      ? {
                          marginLeft: (myWidth * 1.5) / xLegend.length - 25,
                        }
                      : {
                          marginLeft: (myWidth * 2) / xLegend.length - 50,
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
          type="x"
          ReadOnly={ReadOnly}
          modelAns={modelAns ?? false}
        />
      </View>
      <View style={[styles.Ycontainer, {height: yLegend.length * 28 + 14}]}>
        <View style={styles.YLegendContainer}>
          {yLegend.map((legend: string, index: number) => (
            <React.Fragment key={index}>
              {legend === '' ? (
                <YLegendInput
                  modelAns={modelAns ?? false}
                  ReadOnly={ReadOnly}
                  key={index}
                  fill={fillings[++counter]}
                />
              ) : (
                <Text style={styles.YLegendText}>{legend}</Text>
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

  return (
    <TextInput
      editable={!ReadOnly}
      style={[
        styles.XLegendInputBox,
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
    transform: [{translateY: 10}],
    marginHorizontal: 3,
  },
  XLegendContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: '5%',
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
    width: 120,
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
    height: 20,
    margin: '4px 0',
    width: 30,
    color: '#707070',
    fontFamily: myFont.GEN,
    backgroundColor: '#FFF',
    borderRadius: 10,
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
    textAlign: 'center',
    height: 20,
    marginVertical: 4,
    width: 30,
    lineHeight: 28,
    color: '#707070',
    fontFamily: myFont.GEN,
    backgroundColor: 'transparent',
    fontSize: 14,
  },
  XLegendInputBox: {
    height: 28,
    width: 50,
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
});
