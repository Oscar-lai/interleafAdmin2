import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';

import {SafeWrapper} from '../theme/sharedComponents';
import {MYCOLOR, myFont} from '../theme/typography';

interface IIdentity {
  navigation: any;
}

const Theme: React.FC<IIdentity> = ({navigation}) => {
  function RegParent() {
    navigation.navigate('term', {
      title: '自家題目',
    });
  }

  function goToTut() {
    navigation.navigate('教育機構', {
      title: '補習社',
    });
  }

  const [Identity, setIdentity] = useState<string | null>(null);

  return (
    <SafeWrapper customStyle={{backgroundColor: '#25AC7D'}}>
      <View style={styles.wrapper}>
        <TouchableOpacity
          onPress={RegParent}
          style={[
            styles.box,
            Identity === 'teacher' ? {backgroundColor: '#4FBD97'} : {},
          ]}>
          <Image
            style={styles.teacherButtonImg}
            source={require('../img/INTERLEAF_IDENTITY_LOGO.png')}
          />
          <Text
            style={[
              styles.text,
              Identity === 'teacher' ? {color: '#FFF'} : {},
            ]}>
            自家題目
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToTut}
          style={[
            styles.box,
            Identity === 'student' ? {backgroundColor: '#4FBD97'} : {},
          ]}>
          <Image
            style={styles.studentButtonImg}
            source={require('../img/university.png')}
          />
          <Text
            style={[
              styles.text,
              Identity === 'student' ? {color: '#FFF'} : {},
            ]}>
            補習社
          </Text>
        </TouchableOpacity>
        <View style={styles.confirmButtonWrap}>
          {/* {Identity && (
            <TouchableOpacity
              style={styles.GreenButton}
              onPress={confirmIdentity}>
              <Text style={styles.GreenButtonText}>確定</Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    </SafeWrapper>
  );
};

export default Theme;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoImg: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  teacherButtonImg: {
    width: DeviceInfo.isTablet() ? 130 : 100,
    height: DeviceInfo.isTablet() ? 130 : 100,
    resizeMode: 'contain',
  },
  studentButtonImg: {
    width: DeviceInfo.isTablet() ? 130 : 90,
    height: DeviceInfo.isTablet() ? 130 : 90,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontFamily: myFont.GEN,
    color: '#FFF',
    fontSize: DeviceInfo.isTablet() ? 30 : 24,
    width: '100%',
    textAlign: 'center',
    marginBottom: DeviceInfo.isTablet() ? '3%' : '6%',
  },
  box: {
    width: heightPercentageToDP('21%'),
    borderRadius: 1000,
    height: heightPercentageToDP('21%'),
    maxWidth: 300,
    maxHeight: 300,
    minWidth: 200,
    minHeight: 200,
    marginVertical: '4%',
    borderColor: '#92D6BE',
    borderWidth: DeviceInfo.isTablet() ? 8 : 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: myFont.GEN,
    fontSize: 25,
    color: '#92D6BE',
  },
  confirmButtonWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: widthPercentageToDP('40%') / 3.7,
    marginTop: '8%',
  },
  GreenButton: {
    backgroundColor: MYCOLOR.superLightYellow,
    borderRadius: 200,
    width: widthPercentageToDP('35%'),
    height: widthPercentageToDP('40%') / 3.7,

    maxHeight: 200 / 3.7,
    maxWidth: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GreenButtonText: {
    fontSize: DeviceInfo.isTablet() ? 26 : 20,
    color: MYCOLOR.mainGreen,
    fontFamily: myFont.GEN,
  },
});
