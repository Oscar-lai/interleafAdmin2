import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {GetImageURL} from '../../../firebase/Config';
import DeviceInfo from 'react-native-device-info';

interface IMCImageDisplay {
  url: string;
}

export const SmallImageDisplay: React.FC<IMCImageDisplay> = ({url}) => {
  const [URL, setURL] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    GetImageURL(url, 'img').then(url => {
      if (mounted) {
        setURL(url);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View
      style={[styles.container, URL ? {backgroundColor: 'transparent'} : {}]}>
      {URL !== '' && (
        <Image resizeMode="contain" source={{uri: URL}} style={styles.image} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e1e4e8',
    height: DeviceInfo.isTablet() ? 70 : 30,
    minWidth: DeviceInfo.isTablet() ? 70 : 40,
  },
  image: {
    height: DeviceInfo.isTablet() ? 70 : 30,
  },
});
