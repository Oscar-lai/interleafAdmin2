import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import DeviceInfo from 'react-native-device-info';
import {myFont, MYCOLOR} from '../../../theme/typography';
import {LongQAnsStraight} from './LongQAnsStraight';
import {LongQAnsDivisionFib} from './LongQAnsDivisionFib';
interface IModalAnsClassifier {
  sandwich: any;
}

export const LongQStraightClassifier: React.FC<IModalAnsClassifier> = props => {
  let formattedLine = <></>;
  const sandwich = props.sandwich;

  switch (sandwich.type) {
    case 'straight': {
      formattedLine = (
        <View style={styles.container}>
          <LongQAnsStraight sandwich={sandwich} />
        </View>
      );
      break;
    }
    // case 'homo': {
    //   formattedLine = (
    //     <View style={styles.container}>
    //       <Straight modelAns ReadOnly sandwich={sandwich} />
    //     </View>
    //   );
    //   break;
    // }
    // case 'straightJump': {
    //   let type = sandwich.operator ? sandwich.operator[0] : '';

    //   if (type === '//') {
    //     formattedLine = <Division modelAns ReadOnly sandwich={sandwich} />;
    //   }

    //   if (type === '/') {
    //     formattedLine = <ShortDivision modelAns ReadOnly sandwich={sandwich} />;
    //   }
    //   break;
    // }
    case 'straightNoJump': {
      formattedLine = (
        <View style={styles.container}>
          <LongQAnsDivisionFib sandwich={sandwich} />
        </View>
      );
      break;
    }
    default: {
      formattedLine = <></>;
      break;
    }
  }

  return formattedLine;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    width: widthPercentageToDP(70),
    flexDirection: 'column',
    alignItems: 'center',
  },
  // specifically for String Frac when elements align in row but not column
  containerMcStringFrac: {
    marginTop: 20,
    width: widthPercentageToDP('100%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 40,
  },
  containerFullScreen: {
    marginTop: 20,
    width: widthPercentageToDP('100%'),
    flexDirection: 'column',
    alignItems: 'center',
  },
  ansText: {
    marginVertical: '5%',
    width: '100%',
    fontFamily: myFont.GEN,
    color: MYCOLOR.lightRed,
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
  },
  // for MC ans text that doesnt start on side and thus not width 100%
  ansTextMC: {
    marginVertical: '5%',
    fontFamily: myFont.GEN,
    color: MYCOLOR.lightRed,
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
  },
  ansText_QuestionText: {
    fontFamily: myFont.GEN,
    color: MYCOLOR.lightRed,
    fontSize: DeviceInfo.isTablet() ? 26 : 18,
  },
  ansTextContainer_QuestionText: {
    marginVertical: '5%',
    width: '100%',
  },
  ImageContainer: {
    marginTop: DeviceInfo.isTablet() ? 40 : 20,
    width: '100%',
    // for making this invisible when img-x / img-y is expanded
    zIndex: -1,
  },
});
