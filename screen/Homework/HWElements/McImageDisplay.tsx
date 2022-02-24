import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {GetImageURL} from '../../../firebase/Config';

import DeviceInfo from 'react-native-device-info';

interface IMCImageDisplay {
  url: string;
}

export const MCImageDisplay: React.FC<IMCImageDisplay> = ({url}) => {
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
    height: '100%',
    minHeight: DeviceInfo.isTablet() ? 120 : 80,
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: DeviceInfo.isTablet() ? '80%' : '90%',
    width: '80%',
  },
});
