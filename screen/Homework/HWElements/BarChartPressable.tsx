import React, {useEffect, useState} from 'react';

import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

interface BarChartPressableProps {
  height: number;
  width: number;
  fill: any;
  type: 'x' | 'y';
  ReadOnly: boolean;
  modelAns: boolean;
  onLayout?: (event: any) => void;
}

const BarChartPressable: React.FC<BarChartPressableProps> = ({
  height,
  width,
  fill,
  ReadOnly,
  modelAns,
  type,
  onLayout,
}) => {
  let tempGrid: {[id: string]: boolean[]} = {};

  if (type === 'x') {
    [...Array(width)].map((x, index) => {
      let temp = [...Array(height)].fill(false, 0, height);
      tempGrid[(index + 1).toString()] = temp;
    });
  } else {
    [...Array(height)].map((x, index) => {
      let temp = [...Array(width)].fill(false, 0, width);
      tempGrid[(index + 1).toString()] = temp;
    });
  }

  const keys = Object.keys(tempGrid);

  const [BarMap, setBarMap] = useState<{[id: string]: boolean[]}>(
    modelAns ? fill.modelAns ?? tempGrid : fill.ans ?? tempGrid,
  );

  useEffect(() => {
    fill.ans = BarMap;
  }, [BarMap]);

  if (type === 'x') {
    return (
      <View style={styles.ChartContainer} onLayout={onLayout}>
        <View style={styles.Line} />
        <View style={styles.BottomLine} />
        {keys.map((key, index) => (
          <View style={styles.BarColumnContainer} key={key}>
            {BarMap[key].map((value, index2) => (
              <BarItem
                key={key + index2}
                value={value}
                row={key}
                height={index2}
                Ans={BarMap}
                setAns={setBarMap}
                disabled={ReadOnly}
              />
            ))}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.ChartContainerY} onLayout={onLayout}>
      <View style={styles.Line} />
      <View style={styles.BottomLine} />
      {keys.map((key, index) => (
        <View style={styles.BarColumnContainerY} key={key}>
          {BarMap[key].map((value, index2) => (
            <BarItem
              key={key + index2}
              value={value}
              y
              row={key}
              height={index2}
              Ans={BarMap}
              setAns={setBarMap}
              disabled={ReadOnly}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default BarChartPressable;

interface IBarItem {
  value: boolean;
  row: string;
  height: number;
  Ans: {[id: string]: boolean[]};
  setAns: (a: {[id: string]: boolean[]}) => void;
  disabled: boolean;
  y?: boolean;
}

const BarItem: React.FC<IBarItem> = ({
  value,
  row,
  height,
  Ans,
  setAns,
  disabled,
  y,
}) => {
  const [BarValue, setBarValue] = useState<boolean>(value);
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.BarItemBox,
        y ? {width: 1, flex: 1} : {},
        BarValue
          ? {borderColor: 'orange', backgroundColor: 'orange'}
          : {borderColor: '#D2D2D2', backgroundColor: 'transparent'},
      ]}
      onPress={() => {
        setBarValue(!BarValue);
        const clone = JSON.parse(JSON.stringify(Ans));
        clone[row.toString()][height] = !BarValue;
        setAns(clone);
      }}
    />
  );
};

const styles = StyleSheet.create({
  ChartContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    position: 'relative',
    backgroundColor: '#FFF',
  },
  BarColumnContainer: {
    flexDirection: 'column-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  BarItemBox: {
    height: DeviceInfo.isTablet() ? 50 : 28,
    width: '100%',
    borderWidth: DeviceInfo.isTablet() ? 2 : 1,
  },
  Line: {
    height: '100%',
    width: DeviceInfo.isTablet() ? 3 : 2,
    backgroundColor: 'black',
    flexShrink: 0,
    position: 'absolute',
    top: 2,
    left: -2,
  },
  BottomLine: {
    height: DeviceInfo.isTablet() ? 3 : 2,
    width: '100%',
    backgroundColor: 'black',
    flexShrink: 0,
    position: 'absolute',
    bottom: -2,
    left: -2,
  },
  ChartContainerY: {
    flexDirection: 'column-reverse',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    position: 'relative',
    backgroundColor: '#FFF',
  },
  BarColumnContainerY: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
});
