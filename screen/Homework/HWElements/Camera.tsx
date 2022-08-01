import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  DeviceEventEmitter,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {myFont} from '../../../theme/typography';
import Icon from 'react-native-vector-icons/Feather';

Icon.loadFont();

import DeviceInfo from 'react-native-device-info';

interface ICamera {
  navigation: any;
  route: any;
}
const Camera: React.FC<ICamera> = ({navigation, route}) => {
  const CameraRef = useRef<RNCamera>(null);

  const setPic = route.params?.setPic;

  //For detecting the orientation of the camera
  const [orientation, setOrientation] = useState('PORTRAIT');
  function handleOrientationDidChange(data: { isLandscape: any; }) {
    if (data.isLandscape && orientation === 'PORTRAIT') {
      setOrientation('LANDSCAPE');
    }
    if (!data.isLandscape && orientation === 'LANDSCAPE') {
      setOrientation('PORTRAIT');
    }
  }
  DeviceEventEmitter.addListener(
    'namedOrientationDidChange',
    handleOrientationDidChange,
  );

  const takePicture = async () => {
    if (CameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await CameraRef.current.takePictureAsync(options);
      console.log(data.base64);
      setPic(data.base64);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.back,
          orientation === 'PORTRAIT'
            ? {
                left: DeviceInfo.isTablet() ? '8%' : '5%',
                top: DeviceInfo.isTablet() ? '5%' : '3%',
              }
            : {
                top: DeviceInfo.isTablet() ? '8%' : '5%',
                right: DeviceInfo.isTablet() ? '5%' : '3%',
              },
        ]}
        onPress={() => navigation.goBack()}>
        <Icon
          name="x"
          style={styles.cross}
          size={DeviceInfo.isTablet() ? 70 : 40}
        />
      </TouchableOpacity>
      <RNCamera
        ref={CameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          {/* <Text style={styles.snapText}>拍照</Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Camera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: 'transparent',
    height: DeviceInfo.isTablet() ? 100 : 55,
    width: DeviceInfo.isTablet() ? 100 : 55,
    borderRadius: DeviceInfo.isTablet() ? 50 : 50,
    borderWidth: DeviceInfo.isTablet() ? 10 : 5,
    borderColor: '#fff',
    // padding: 15,
    // paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 25,
    zIndex: 5000,
  },
  snapText: {
    fontSize: 14,
    fontFamily: myFont.GEN,
    color: '#707070',
  },
  back: {
    position: 'absolute',
    // left: DeviceInfo.isTablet() ? '8%' : '5%',
    // top: DeviceInfo.isTablet() ? '5%' : '3%',
    zIndex: 5000,
    justifyContent: 'center',
    alignContent: 'center',
  },
  cross: {
    color: '#fff',
  },
});
