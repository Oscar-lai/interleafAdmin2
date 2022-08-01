import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import {GetImageURL} from '../../../firebase/Config';
import {MYCOLOR} from '../../../theme/typography';
import Icon from 'react-native-vector-icons/Feather';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
Icon.loadFont();

import DeviceInfo from 'react-native-device-info';

interface IImageDisplay {
  imgURL: string[];
  type: 'img' | 'res';
  zoom?: 'x' | 'y';
}

export const ImageDisplay: React.FC<IImageDisplay> = ({imgURL, type, zoom}) => {
  const urlTemp = imgURL[0];
  console.log(urlTemp);

  const [URL, setURL] = useState<string>('');
  const [AspectRatio, setAspectRatio] = useState(0);

  useEffect(() => {
    let mounted = true;

    GetImageURL(urlTemp, type).then(url => {
      if (mounted) {
        Image.getSize(
          url,
          (width, height) => {
            setAspectRatio(width / height);
          },
          error => console.error(error),
        );
        setURL(url);
        console.log('real url is: ' + url);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const [Ximg, setXimg] = useState<boolean>(false);
  const [Yimg, setYimg] = useState<boolean>(false);

  function ToggleBigImg() {
    if (zoom === 'x') {
      setXimg(!Ximg);
    }

    if (zoom === 'y') {
      setYimg(!Yimg);
    }
  }

  return type === 'img' ? (
    <TouchableOpacity
      onPress={ToggleBigImg}
      activeOpacity={zoom ? 0.2 : 1}
      style={[styles.container, URL ? {backgroundColor: 'transparent'} : {}]}>
      {zoom && (
        <Icon
          name="zoom-in"
          style={styles.crossIcon}
          size={DeviceInfo.isTablet() ? 40 : 25}
        />
      )}
      {URL !== '' && (
        <Image resizeMode="contain" source={{uri: URL}} style={styles.image} />
      )}
      {Ximg && (
        <View style={styles.BigImageWrapper}>
          <View style={styles.BigImageContainer}>
            <Image
              resizeMode="contain"
              source={{uri: URL}}
              style={styles.BigImageX}
            />
          </View>
        </View>
      )}
      {Yimg && (
        <View style={styles.BigImageWrapper}>
          <View style={styles.BigImageContainer}>
            <Image
              resizeMode="contain"
              source={{uri: URL}}
              style={styles.BigImageY}
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        styles.ResContainer,
        URL ? {backgroundColor: 'transparent'} : {},
        {
          height:
            AspectRatio === 0
              ? 450
              : (widthPercentageToDP(100) - 80) / AspectRatio,
        },
      ]}>
      {URL !== '' && (
        <Image
          resizeMode="contain"
          style={[
            styles.resImg,
            {
              height:
                AspectRatio === 0
                  ? 450
                  : (widthPercentageToDP(100) - 80) / AspectRatio,
            },
          ]}
          source={{
            uri: URL,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
    width: '100%',
    height: DeviceInfo.isTablet() ? 470 : 300,
    // marginTop: DeviceInfo.isTablet() ? 30 : 15,
    zIndex: 100,
  },
  image: {
    height: DeviceInfo.isTablet() ? 400 : 250,
    marginHorizontal: DeviceInfo.isTablet() ? 40 : 20,
    marginVertical: DeviceInfo.isTablet() ? 35 : 25,
  },
  ResContainer: {
    backgroundColor: '#e1e4e8',
    width: '100%',
    height: 450,
    // marginTop: 15,
    zIndex: 100,
  },
  resImg: {
    width: '100%',
  },
  BigImageWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: heightPercentageToDP('70%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  BigImageContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  BigImageX: {
    width: '90%',
    height: heightPercentageToDP('70%'),
  },
  BigImageY: {
    width: heightPercentageToDP('70%'),
    height: widthPercentageToDP('70%'),
    transform: [{rotate: '90deg'}],
  },
  crossIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    color: MYCOLOR.whiteSmoke,
    zIndex: 5000,
  },
});
