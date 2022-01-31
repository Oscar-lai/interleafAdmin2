import React, {useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {myFont} from '../../../theme/typography';

interface ICamera {
  navigation: any;
  route: any;
}
const Camera: React.FC<ICamera> = ({navigation, route}) => {
  const CameraRef = useRef<RNCamera>(null);

  const setPic = route.params?.setPic;

  const takePicture = async () => {
    if (CameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await CameraRef.current.takePictureAsync(options);
      console.log(data.uri);
      setPic(data.uri);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
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
          <Text style={styles.snapText}>拍照</Text>
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
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  snapText: {
    fontSize: 14,
    fontFamily: myFont.GEN,
    color: '#707070',
  },
});
