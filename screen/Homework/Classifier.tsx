import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Sandwich} from '../../hooks/useHWQ';
import {MYCOLOR, myFont} from '../../theme/typography';
import BarChartX from './HWElements/BarchartX';
import BarChartY from './HWElements/BarChartY';
import Conditioner from './HWElements/Conditioner';
import {Division} from './HWElements/Division';
import {DivisionFib} from './HWElements/DivsionFib';
import HMS from './HWElements/HMS';
import {ImageDisplay} from './HWElements/ImageDisplay';
import {InfiniteInput} from './HWElements/InfiniteInput';
import {MCAns} from './HWElements/McInput';
import {Mixed} from './HWElements/MixedInput';
import {NumberBond} from './HWElements/NumberBond';
import {NumberLine} from './HWElements/NumberLine';
import ShortDivision from './HWElements/ShortDivision';
import {Straight} from './HWElements/Straight';
import Table from './HWElements/Table';
import {TakePhotoDisplay} from './HWElements/TakePhotoDisplay';
import DeviceInfo from 'react-native-device-info';
import QuestionText from './HWElements/HWComponent/QuestionText';
import {DrawLongQ} from './HWElements/DrawLongQ';
import {ImageDrawable} from './HWElements/ImageDrawable';

interface IClassifier {
  sandwich: Sandwich;
  HWid: string;
  SID: string;
  photo?: string[];
  imageDrawArray?: {[id: string]: string};
  index?: number;
  condition?: (n: number) => void;
  ReadOnly: boolean;
  navigation: any;
  correction?: boolean;
}

const Classifier: React.FC<IClassifier> = ({
  sandwich,
  HWid,
  SID,
  index,
  photo,
  ReadOnly,
  condition,
  navigation,
  correction,
  imageDrawArray = {},
}) => {
  let formattedLine = <></>;

  switch (sandwich.type) {
    case 'string': {
      formattedLine = (
        <View style={styles.Container}>
          <Text style={styles.QuestionText}>{sandwich.bread['1']}</Text>
        </View>
      );
      break;
    }
    case 'substring': {
      formattedLine = (
        <View style={styles.Container}>
          <Mixed ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'substringPig': {
      formattedLine = (
        <View style={styles.Container}>
          <Mixed ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'stringPig': {
      formattedLine = (
        <View style={styles.Container}>
          <Mixed ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'oneLine': {
      formattedLine = (
        <View style={[styles.Container]}>
          <QuestionText
            style={styles.QuestionText}
            containerStyle={{justifyContent: 'center'}}
            WithinOneLine>
            {Object.values(sandwich.bread)[0]}
          </QuestionText>
        </View>
      );
      break;
    }
    case 'mixed': {
      formattedLine = (
        <View style={styles.Container}>
          <Mixed ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'fiB': {
      formattedLine = (
        <View style={styles.Container}>
          <Mixed ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'mc': {
      const ansObject = sandwich.fillings[sandwich.fillings.length - 1];

      formattedLine = (
        // if its mc slash, the bottom one will do nth
        // if its mc box / pig etc, the top one will display title if any
        <View style={styles.Container}>
          <Mixed
            // condition is a dummy setState function for refreshing the conditioner dom
            condition={condition}
            ReadOnly={ReadOnly}
            sandwich={sandwich}
            correction={correction}
          />
          <MCAns
            // condition is a dummy setState function for refreshing the conditioner dom
            condition={condition}
            ReadOnly={ReadOnly}
            filling={ansObject}
            correction={correction}
          />
        </View>
      );
      break;
    }
    case 'longQ': {
      formattedLine = (
        <View style={styles.Container}>
          {DeviceInfo.isTablet() ? (
            <DrawLongQ
              ReadOnly={ReadOnly}
              key={index}
              photo={photo ?? []}
              index={index ?? 0}
            />
          ) : (
            <TakePhotoDisplay
              ReadOnly={ReadOnly}
              key={index}
              photo={photo ?? []}
              index={index ?? 0}
              navigation={navigation}
            />
          )}
        </View>
      );
      break;
    }
    case 'straight': {
      formattedLine = (
        <View style={styles.Container}>
          <Straight ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'homo': {
      formattedLine = (
        <View style={styles.Container}>
          <Straight ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'straightJump': {
      let type = sandwich.operator ? sandwich.operator[0] : '';

      if (type === '//') {
        formattedLine = <Division ReadOnly={ReadOnly} sandwich={sandwich} />;
      }

      if (type === '/') {
        formattedLine = (
          <ShortDivision ReadOnly={ReadOnly} sandwich={sandwich} />
        );
      }
      break;
    }
    case 'straightNoJump': {
      formattedLine = (
        <View style={styles.Container}>
          <DivisionFib ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'img': {
      const imgURL = Object.values(sandwich.bread);
      formattedLine = (
        <View
          style={[
            styles.ImageContainer,
            {
              backgroundColor: '#FFF',
            },
          ]}>
          <ImageDisplay imgURL={imgURL} type="img" />
        </View>
      );
      break;
    }
    case 'imgDrawable': {
      formattedLine = (
        <View
          style={[
            styles.ImageContainer,
            {
              backgroundColor: '#FFF',
            },
          ]}>
          <ImageDrawable
            imageDrawArray={imageDrawArray}
            sandwich={sandwich}
            ReadOnly={ReadOnly}
            HWid={HWid}
            SID={SID}
          />
        </View>
      );
      break;
    }
    case 'ResImg': {
      const imgURL = Object.values(sandwich.bread);
      console.log('im in res img');
      formattedLine = (
        <View
          style={[
            styles.ImageContainer,
            {
              backgroundColor: '#FFF',
            },
          ]}>
          <ImageDisplay imgURL={imgURL} type="res" />
        </View>
      );
      break;
    }
    case 'img-x': {
      const imgURL = Object.values(sandwich.bread);
      formattedLine = (
        <View
          style={[
            styles.ImageContainer,
            {
              zIndex: 99,
              backgroundColor: '#FFF',
            },
          ]}>
          <ImageDisplay imgURL={imgURL} type="img" zoom="x" />
        </View>
      );
      break;
    }
    case 'img-y': {
      const imgURL = Object.values(sandwich.bread);
      formattedLine = (
        <View
          style={[
            styles.ImageContainer,
            {
              zIndex: 99,
              backgroundColor: '#FFF',
            },
          ]}>
          <ImageDisplay imgURL={imgURL} type="img" zoom="y" />
        </View>
      );
      break;
    }
    case 'fiBjump': {
      formattedLine = (
        <View style={styles.Container}>
          <InfiniteInput
            ReadOnly={ReadOnly}
            bread={sandwich.bread}
            filling={sandwich.fillings[0]}
          />
        </View>
      );
      break;
    }
    case 'numberBond': {
      formattedLine = (
        <View style={styles.Container}>
          <NumberBond ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'numberLine': {
      formattedLine = (
        <View style={styles.Container}>
          <NumberLine ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'fiB_hms': {
      formattedLine = (
        <View style={styles.Container}>
          <HMS ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'table': {
      formattedLine = (
        <View style={styles.Container}>
          <Table ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'barchart-x': {
      formattedLine = (
        <View style={styles.BarChartContainer}>
          <BarChartX ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'barchart-y': {
      formattedLine = (
        <View style={styles.BarChartContainer}>
          <BarChartY ReadOnly={ReadOnly} sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'conditioner': {
      formattedLine = <Conditioner sandwich={sandwich} ReadOnly={ReadOnly} />;
      break;
    }
    default: {
      formattedLine = <></>;
      break;
    }
  }

  return formattedLine;
};

export default Classifier;

const styles = StyleSheet.create({
  QuestionText: {
    fontSize: DeviceInfo.isTablet() ? 30 : 20,
    fontFamily: myFont.GEN,
    color: '#707070',
  },
  Container: {
    marginTop: DeviceInfo.isTablet() ? 40 : 20,
    width: '100%',
    paddingHorizontal: DeviceInfo.isTablet() ? 80 : 40,
    // for making this invisible when img-x / img-y is expanded
    zIndex: -1,
  },
  ImageContainer: {
    marginTop: DeviceInfo.isTablet() ? 40 : 20,
    width: '100%',
    // for making this invisible when img-x / img-y is expanded
    zIndex: -1,
  },
  BarChartContainer: {
    marginTop: DeviceInfo.isTablet() ? 60 : 35,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
