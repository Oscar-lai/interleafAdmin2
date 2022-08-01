import React, {useEffect, useRef} from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';

import {MYCOLOR, myFont} from '../../../theme/typography';
Icon.loadFont();
import DeviceInfo from 'react-native-device-info';
import {SketchCanvas} from '@terrylinla/react-native-sketch-canvas';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Fontisto';

interface IDrawLongQ {
  photo: string[];
  index: number;
  ReadOnly: boolean;
}

export const DrawLongQ: React.FC<IDrawLongQ> = ({photo, index, ReadOnly}) => {
  if (ReadOnly) {
    return <></>;
  }
  const canvasRef = useRef<SketchCanvas>(null);

  function SaveDrawing() {
    canvasRef.current?.getBase64(
      'jpg',
      false,
      true,
      false,
      false,
      (err, result) => {
        if (!err) {
          if (result) {
            photo[index] = result;
          }
        }
      },
    );
  }

  function undoDrawing() {
    canvasRef.current?.undo();
  }

  function clearDrawing() {
    canvasRef.current?.clear();
  }

  useEffect(() => {
    const unsc = setTimeout(() => {
      SaveDrawing();
    }, 500);

    return () => clearTimeout(unsc);
  }, []);

  return (
    <View style={styles.BigWrapper}>
      <>
        <Text style={styles.Title}>請寫下你的答案：</Text>
        <View style={styles.ButtonWrapper}>
          <TouchableOpacity style={styles.UndoButton} onPress={undoDrawing}>
            <Icon2 name="undo" color="#FFFFFF" size={25} />
            <Text style={styles.ButtonText}>復原</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={clearDrawing}>
            <Icon name="trash-bin-outline" color="#FFFFFF" size={30} />
            <Text style={styles.ButtonText}>清空</Text>
          </TouchableOpacity>
        </View>
        <SketchCanvas
          ref={canvasRef}
          localSourceImage={{
            filename: 'bg.jpg', // the official typing is wrong, instead of path, must use filename
            directory: Platform.OS === 'ios' ? SketchCanvas.MAIN_BUNDLE : '',
            mode: 'AspectFill',
          }}
          strokeColor={'#444444'}
          onStrokeEnd={SaveDrawing}
          strokeWidth={3}
          style={{
            height: widthPercentageToDP(120),
            width: '100%',
          }}
        />
        <View style={styles.ButtonWrapper}>
          <TouchableOpacity style={styles.UndoButton} onPress={undoDrawing}>
            <Icon2 name="undo" color="#FFFFFF" size={25} />
            <Text style={styles.ButtonText}>復原</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.Button} onPress={clearDrawing}>
            <Icon name="trash-bin-outline" color="#FFFFFF" size={30} />
            <Text style={styles.ButtonText}>清空</Text>
          </TouchableOpacity>
        </View>
      </>
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
    flex: 1,
  },
  Title: {
    fontSize: DeviceInfo.isTablet() ? 30 : 20,
    fontFamily: myFont.GEN,
    color: '#B2B2B2',
    width: '100%',
  },
  ButtonWrapper: {
    flexDirection: 'row',
    width: '60%',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  Button: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: MYCOLOR.lightRed,
    borderRadius: 10,
    alignItems: 'center',
  },
  UndoButton: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: MYCOLOR.lightOrange,
    borderRadius: 10,
    alignItems: 'center',
  },
  ButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: myFont.GEN,
    marginLeft: 5,
  },
});
