import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

import Icon from 'react-native-vector-icons/Feather';
import {myFont} from '../../../theme/typography';
Icon.loadFont();
import DeviceInfo from 'react-native-device-info';


interface ITakePhotoDisplay {
  photo: string[];
  index: number;
  ReadOnly: boolean;
  navigation: any;
}

export const TakePhotoDisplay: React.FC<ITakePhotoDisplay> = ({
  photo,
  index,
  ReadOnly,
  navigation,
}) => {
  if (ReadOnly) {
    return <></>;
  }

  const platform = Platform.OS;

  function ProcessPhoto(img: string) {
    if (img) {
      // set the hw photo array
      photo[index] = img;
      //set the preview for this component as well
      setPhoto(img);
    }
  }

  const [Photo, setPhoto] = useState<string>('');

  async function takePhotoHandler() {
    if (platform === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(async result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)',
              );
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable',
              );
              navigation.push('Camera', {
                setPic: ProcessPhoto,
              });
              break;
            case RESULTS.LIMITED:
              console.log(
                'The permission is limited: some actions are possible',
              );
              navigation.push('Camera', {
                setPic: ProcessPhoto,
              });
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              navigation.push('Camera', {
                setPic: ProcessPhoto,
              });
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore',
              );
              Alert.alert(
                '相機使用權限',
                '請到 設定 > 應用程式 ＞ Interleaf ＞ 權限 中開啟相機權限，以正常使用拍照功能',
                [
                  {
                    text: '確定',
                    onPress: () => {},
                    style: 'default',
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () => {},
                },
              );
              break;
          }
        })
        .catch(error => {
          // …
        });
    }

    if (platform === 'ios') {
      check(PERMISSIONS.IOS.CAMERA)
        .then(async result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              console.log(
                'This feature is not available (on this device / in this context)',
              );
              break;
            case RESULTS.DENIED:
              console.log(
                'The permission has not been requested / is denied but requestable',
              );
              navigation.push('Camera', {
                setPic: ProcessPhoto,
              });
              break;
            case RESULTS.LIMITED:
              console.log(
                'The permission is limited: some actions are possible',
              );
              navigation.push('Camera', {
                setPic: ProcessPhoto,
              });
              break;
            case RESULTS.GRANTED:
              console.log('The permission is granted');
              navigation.push('Camera', {
                setPic: ProcessPhoto,
              });
              break;
            case RESULTS.BLOCKED:
              console.log(
                'The permission is denied and not requestable anymore',
              );
              Alert.alert(
                '相機使用權限',
                '請到 設定 > Interleaf 中開啟相機權限，以正常使用拍照功能',
                [
                  {
                    text: '確定',
                    onPress: () => {},
                    style: 'default',
                  },
                ],
                {
                  cancelable: true,
                  onDismiss: () => {},
                },
              );
              break;
          }
        })
        .catch(error => {
          // …
        });
    }
  }

  return (
    <View style={styles.BigWrapper}>
      {Photo !== '' && (
        <TouchableOpacity style={styles.previewPic} onPress={takePhotoHandler}>
          <Image
            resizeMode="contain"
            style={styles.previewPic}
            source={{
              uri: Photo,
            }}
          />
        </TouchableOpacity>
      )}
      {Photo === '' && (
        <>
          <Text style={styles.Title}>請先用紙筆寫下答案，</Text>
          <Text style={styles.Title}>然後拍下答案</Text>
          <TouchableOpacity
            onPress={takePhotoHandler}
            style={styles.BoxWrapper}>
            <Icon name="camera" size={DeviceInfo.isTablet() ? 85 : 60} color="#B2B2B2" />
            <Text style={styles.ButtonText}>按此拍照</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  BigWrapper: {
    width: '100%',
    marginVertical: DeviceInfo.isTablet() ? 30 : 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // backgroundColor:'gray'
  },
  Title: {
    fontSize: DeviceInfo.isTablet() ? 30 : 20,
    fontFamily: myFont.GEN,
    color: '#B2B2B2',
  },
  ButtonText: {
    fontSize: DeviceInfo.isTablet() ? 22 : 14,
    fontFamily: myFont.GEN,
    color: '#B2B2B2',
    marginTop: 5,
  },
  BottomWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  BoxWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceInfo.isTablet() ? 180 : 130,
    height: DeviceInfo.isTablet() ? 180 : 130,
    borderRadius: 100,
    borderWidth: DeviceInfo.isTablet() ? 8 : 5,
    borderColor: '#B2B2B2',
    marginTop: DeviceInfo.isTablet() ? 28 : 20,
  },
  camera: {
    width: 0,
    height: 0,
  },
  previewPic: {
    width: DeviceInfo.isTablet() ? '95%' : '100%',
    height: DeviceInfo.isTablet() ? 700 : 500,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
