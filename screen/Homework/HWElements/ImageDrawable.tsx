import React, {useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {GetImageURL} from '../../../firebase/Config';
import Icon from 'react-native-vector-icons/Feather';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
Icon.loadFont();
import {uuidv4} from 'react-native-compressor';

import DeviceInfo from 'react-native-device-info';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import {Sandwich} from '../../../hooks/useHWQ';

interface IImageDrawable {
  sandwich: Sandwich;
  HWid: string;
  SID: string;
  imageDrawArray: {[id: string]: string};
  ReadOnly: boolean;
}

export const ImageDrawable: React.FC<IImageDrawable> = ({
  sandwich,
  SID,
  HWid,
  imageDrawArray,
  ReadOnly,
}) => {
  const imgURL = sandwich.fillings[0].food;
  const urlTemp = imgURL[0];

  const [URL, setURL] = useState<string>('');
  const [CoverURL, setCoverURL] = useState<string>('');
  const canvasRef = useRef<SketchCanvas>(null);

  const WidthD = widthPercentageToDP(80);
  const heightD = DeviceInfo.isTablet() ? 400 : 250;
  const ARD = WidthD / heightD;

  const [ImageWidth, setImageWidth] = useState<number>(0);
  const [ImageHeight, setImageHeight] = useState<number>(0);

  const [ImageWidthOffset, setImageWidthOffset] = useState<number>(0);
  const [ImageHeightOffset, setImageHeightOffset] = useState<number>(0);

  const [ID] = useState<string>(uuidv4());

  useEffect(() => {
    let mounted = true;

    // first get bg img no matter what
    GetImageURL(urlTemp, 'img').then(url => {
      if (mounted) {
        Image.getSize(
          url,
          (width, height) => {
            const AR = width / height;
            if (AR > ARD) {
              setImageWidth(WidthD);
              setImageHeight(WidthD / AR);

              setImageHeightOffset((heightD - WidthD / AR) / 2);
            } else {
              setImageWidth(heightD * AR);
              setImageHeight(heightD);

              setImageWidthOffset((WidthD - heightD * AR) / 2);
            }
          },
          error => console.error(error),
        );
        setURL(url);
      }
    });

    // if it is now doing hw, set the ans to the link
    if (!ReadOnly) {
      const photoPath = 'res/' + SID + '/' + HWid + '/' + ID + '.png';
      sandwich.fillings[0].ans = photoPath;

      console.log('save jor ans: ' + photoPath);
    }

    // if it is readonly, need download the ans link
    if (ReadOnly) {
      const ansURL = sandwich.fillings[0].ans;
      GetImageURL(ansURL, 'res').then(url => {
        if (mounted) {
          setCoverURL(url);
        }
      });
    }

    console.log(ID);
    return () => {
      mounted = false;
    };
  }, []);

  function SaveDrawing() {
    canvasRef.current?.getBase64(
      'png',
      true,
      false,
      false,
      false,
      (err, result) => {
        if (!err) {
          if (result) {
            imageDrawArray[ID] = result;
          }
        }
      },
    );
  }

  useEffect(() => {
    if (ImageWidth !== 0) {
      const unsc = setTimeout(() => {
        SaveDrawing();
      }, 500);

      return () => clearTimeout(unsc);
    }
  }, [ImageWidth]);

  return (
    <View style={styles.ImageContainer}>
      {URL !== '' && (
        <View
          style={{
            position: 'relative',
            height: DeviceInfo.isTablet() ? 400 : 250,
            width: widthPercentageToDP(80),
          }}>
          <Image
            onLayout={event => {
              const {width, height} = event.nativeEvent.layout;
              console.log(`Image size: ${width}x${height}`);
            }}
            resizeMode="contain"
            source={{uri: URL}}
            style={styles.Image}
          />
          {!ReadOnly ? (
            <SketchCanvas
              ref={canvasRef}
              strokeColor={'#444444'}
              onStrokeEnd={SaveDrawing}
              strokeWidth={3}
              style={{
                width: ImageWidth,
                height: ImageHeight,
                position: 'absolute',
                top: ImageHeightOffset,
                left: ImageWidthOffset,
              }}
            />
          ) : (
            URL !== '' && (
              <Image
                resizeMode="contain"
                source={{uri: CoverURL}}
                style={styles.ImageCover}
              />
            )
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  ImageContainer: {
    height: DeviceInfo.isTablet() ? 400 : 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  Image: {
    height: DeviceInfo.isTablet() ? 400 : 250,
    width: widthPercentageToDP(80),
  },
  ImageCover: {
    height: DeviceInfo.isTablet() ? 400 : 250,
    width: widthPercentageToDP(80),
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
