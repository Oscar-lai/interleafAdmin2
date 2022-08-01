import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Animated} from 'react-native';
import {MYCOLOR, myFont} from '../theme/typography';
import DeviceInfo from 'react-native-device-info';

interface ToggleButtonProps {
  value: boolean | undefined;
  setValue: (f: boolean) => void;
  onChange: (f: boolean) => void;
  closeText: string;
  openText: string;
  closeColor?: string;
  openColor?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  value,
  setValue,
  onChange,
  closeText,
  openText,
  closeColor,
  openColor,
}) => {
  const myRef = useRef<View>(null);

  const [BoxWidth, setBoxWidth] = useState<number>(0);

  const animatedValue = useRef(new Animated.Value(0)).current;

  const Xoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BoxWidth / 2],
  });

  useEffect(() => {
    if (value === true) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [value]);

  return (
    <View
      ref={myRef}
      onLayout={e => setBoxWidth(e.nativeEvent.layout.width)}
      style={styles.ButtonContainer}>
      <Animated.View
        style={[
          styles.ButtonBox,
          {transform: [{translateX: Xoffset}]},
          openColor && value ? {backgroundColor: openColor} : {},
          closeColor && value === false ? {backgroundColor: closeColor} : {},
        ]}
      />
      <TouchableOpacity
        style={styles.ButtonTextWrapper}
        onPress={() => {
          setValue(false);
        }}>
        <Text
          style={[
            styles.ButtonText,
            {
              color:
                value !== false
                  ? closeColor
                    ? closeColor
                    : MYCOLOR.lightYellow
                  : '#FFF',
            },
          ]}>
          {closeText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.ButtonTextWrapper}
        onPress={() => {
          setValue(true);
        }}>
        <Text
          style={[
            styles.ButtonText,
            {
              color:
                value !== true
                  ? openColor
                    ? openColor
                    : MYCOLOR.lightYellow
                  : '#FFF',
            },
          ]}>
          {openText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ToggleButton;

const styles = StyleSheet.create({
  ButtonContainer: {
    width: '100%',
    height: DeviceInfo.isTablet() ? 55 : 44,
    borderRadius: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '3%',
    position: 'relative',
    borderColor: MYCOLOR.whiteSmoke,
    borderWidth: DeviceInfo.isTablet() ? 2.5 : 1,
    alignSelf: 'center',
  },
  ButtonTextWrapper: {
    height: 50,
    width: '50%',
  },
  ButtonText: {
    fontFamily: myFont.GEN,
    fontSize: DeviceInfo.isTablet() ? 24 : 18,
    lineHeight: 50,
    height: '100%',
    width: '100%',
    textAlign: 'center',
  },
  ButtonBox: {
    height: DeviceInfo.isTablet() ? 44 : 34,
    position: 'absolute',
    width: '47%',
    backgroundColor: MYCOLOR.lightYellow,
    borderRadius: 22,
    top: DeviceInfo.isTablet() ? 3 : 4,
    left: DeviceInfo.isTablet() ? '1.25%' : '1.5%',
  },
});
