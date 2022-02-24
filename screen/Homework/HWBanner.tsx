import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
  useSafeAreaInsets,
  useSafeAreaFrame,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {smallDeviceHeight} from '../../DeviceConfig';
Icon2.loadFont();

import {MYCOLOR, myFont} from '../../theme/typography';

interface IHWBanner {
  focus: any;
  QNum: number;
  goBack: () => void;
  daysOfDistribution: string;
  backgroundColor?: string; //use background color to indicate it is not a HW banner
  Title?: string;
  HWType?: string;
}

const HWBanner: React.FC<IHWBanner> = ({
  focus,
  QNum,
  daysOfDistribution,
  goBack,
  backgroundColor,
  Title,
  HWType,
}) => {
  const inset = useSafeAreaInsets();
  let {height} = useSafeAreaFrame();

  return (
    <View
      style={[
        styles.topBar,
        backgroundColor
          ? {
              backgroundColor: backgroundColor,
              paddingTop: DeviceInfo.isTablet() ? '5%' : inset.top,
              paddingVertical: '5%',
            }
          : {},
      ]}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity
          style={[
            styles.BackButton,
            backgroundColor ? {borderColor: '#FFFFFFB2'} : {},
          ]}
          onPress={goBack}>
          <Icon
            name="chevron-left"
            size={DeviceInfo.isTablet() ? 35 : 24}
            color={backgroundColor ? '#FFFFFFB2' : MYCOLOR.whiteSmoke}
          />
          <Text
            style={[
              styles.BackButtonText,
              backgroundColor ? {color: '#FFFFFFB2'} : {},
            ]}>
            {HWType ? `退出${HWType}` : '退出練習'}
          </Text>
        </TouchableOpacity>
      </View>
      {Title && <Text style={styles.CorrectText}>{Title}</Text>}
      <View
        style={[
          styles.InfoWrapper,
          // DeviceInfo.isTablet() ? {width: '40%'} : {flex: 1},
        ]}>
        {focus.map((topic: any, index: number) => (
          <Text
            numberOfLines={1}
            style={[
              styles.TopicText,
              backgroundColor ? {color: '#FFFFFFB2'} : {},
              height < smallDeviceHeight ? {fontSize: 17} : {},
            ]}
            key={index}>
            {topic.chineseName}
          </Text>
        ))}
        <View style={styles.InfoDetailWrapper}>
          <Text
            style={[
              styles.DetailText,
              backgroundColor ? {color: '#FFFFFFB2'} : {},
              height < smallDeviceHeight ? {fontSize: 10} : {},
            ]}>
            {QNum + '題'}
          </Text>
          <View style={styles.DateWrapper}>
            <Icon2
              name="calendar-month-outline"
              size={
                DeviceInfo.isTablet()
                  ? 30
                  : height < smallDeviceHeight
                  ? 13
                  : 20
              }
              color={backgroundColor ? '#FFFFFFB2' : '#B2B2B2'}
            />
            <Text
              style={[
                styles.DetailText,
                backgroundColor ? {color: '#FFFFFFB2'} : {},
                height < smallDeviceHeight ? {fontSize: 10} : {},
              ]}>
              {daysOfDistribution}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HWBanner;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '5%',
    flexGrow: 0,
    paddingVertical: '3%',
  },
  backButtonContainer: {
    width: '40%',
    alignItems: 'flex-start',
    marginBottom: '3%',
  },
  BackButton: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 1000,
    borderWidth: DeviceInfo.isTablet() ? 4 : 2,
    borderColor: MYCOLOR.whiteSmoke,
    paddingHorizontal: '2%',
    paddingVertical: DeviceInfo.isTablet() ? '1%' : 0,
    width: DeviceInfo.isTablet() ? 150 : 90,
    // marginRight: DeviceInfo.isTablet() ? '18%' : 0,
  },
  BackButtonText: {
    color: MYCOLOR.whiteSmoke,
    fontFamily: myFont.GEN,
    fontSize: DeviceInfo.isTablet() ? 25 : 15,
    textAlign: 'center',
    lineHeight: 34,
    marginRight: '8%',
  },
  InfoWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: '40%',
    // backgroundColor: 'black',
  },
  InfoDetailWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  TopicText: {
    fontSize: DeviceInfo.isTablet() ? 35 : 20,
    fontFamily: myFont.GEN,
    color: MYCOLOR.lightGreen,
  },
  DetailText: {
    fontSize: DeviceInfo.isTablet() ? 25 : 12,
    fontFamily: myFont.GEN,
    color: '#B2B2B2',
  },
  DateWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: DeviceInfo.isTablet() ? '2%' : '5%',
  },
  CorrectText: {
    color: '#FFF',
    fontFamily: myFont.GEN,
    fontSize: DeviceInfo.isTablet() ? 25 : 20,
    // backgroundColor: 'gray',
    flex: 1,
    textAlign: 'center',
  },
});
