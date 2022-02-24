import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {MYCOLOR, myFont} from '../../theme/typography';
import Conditioner from './AnsElements/Conditioner';
import {LongQModelAns} from './AnsElements/LongQModelAns';
import BarChartX from './HWElements/BarchartX';
import BarChartY from './HWElements/BarChartY';
import {Division} from './HWElements/Division';
import {DivisionFib} from './HWElements/DivsionFib';
import Fraction from './HWElements/Fraction';
import HMS from './HWElements/HMS';
import {InfiniteInput} from './HWElements/InfiniteInput';
import {MCImageDisplay} from './HWElements/McImageDisplay';
import {Mixed} from './HWElements/MixedInput';
import {NumberBond} from './HWElements/NumberBond';
import {NumberLine} from './HWElements/NumberLine';
import ShortDivision from './HWElements/ShortDivision';
import {Straight} from './HWElements/Straight';
import Table from './HWElements/Table';
import DeviceInfo from 'react-native-device-info';
import QuestionText from './HWElements/HWComponent/QuestionText';
import {specialStyle} from './HWElements/McInput';

export const ModelAnsClassifier: React.FC<any> = props => {
  let formattedLine = <></>;
  const sandwich = props.sandwich;

  switch (sandwich.type) {
    case 'string': {
      formattedLine = <></>;
      break;
    }
    case 'substring': {
      formattedLine = <></>;
      break;
    }
    case 'substringPig': {
      formattedLine = <></>;
      break;
    }
    case 'img': {
      formattedLine = <></>;
      break;
    }
    case 'mc': {
      let type = '';
      let modelAns: any = null;

      sandwich.fillings.map((filling: any, index: number) => {
        const temp = filling.type;
        const temp2 = temp.substring(0, 2);
        if (temp2.includes('mc')) {
          type = temp;
          modelAns = filling.modelAns;
        }
      });

      switch (type) {
        case 'mcPig': {
          formattedLine = (
            <View style={styles.container}>
              <MCImageDisplay url={modelAns} />
            </View>
          );
          break;
        }
        case 'mcBox': {
          formattedLine = (
            <View style={styles.container}>
              <QuestionText
                style={styles.ansText_QuestionText}
                containerStyle={styles.ansTextContainer_QuestionText}
                specialChracterIndex={
                  typeof modelAns === 'object' ? modelAns.indexes : undefined
                }
                specialStyle={
                  typeof modelAns === 'object'
                    ? specialStyle(modelAns.type)
                    : {}
                }>
                {typeof modelAns === 'object' ? modelAns.food : modelAns}
              </QuestionText>
              {/* <Text style={styles.ansText}>{modelAns}</Text> */}
            </View>
          );
          break;
        }
        case 'mcSlash': {
          formattedLine = (
            <View style={styles.container}>
              <Mixed modelAns ReadOnly sandwich={sandwich} />
            </View>
          );
          break;
        }
        case 'mcFrac': {
          formattedLine = (
            <View style={styles.container}>
              {typeof modelAns === 'string' ? (
                <Text style={styles.ansText}>{modelAns}</Text>
              ) : modelAns.denominator ? (
                <Fraction
                  color={MYCOLOR.lightRed}
                  modelAns
                  ReadOnly
                  fillings={{food: [modelAns]}}
                />
              ) : (
                <QuestionText
                  style={styles.ansText_QuestionText}
                  containerStyle={styles.ansTextContainer_QuestionText}
                  specialChracterIndex={modelAns.indexes}
                  specialStyle={specialStyle(modelAns.type)}>
                  {modelAns.food}
                </QuestionText>
              )}
            </View>
          );
          break;
        }
        case 'mcStringFrac': {
          formattedLine = (
            <View style={styles.containerMcStringFrac}>
              {Object.keys(modelAns).map((key: any, index: number) => (
                <React.Fragment key={JSON.stringify(modelAns) + index}>
                  {typeof modelAns[key] === 'string' ? (
                    <Text style={styles.ansTextMC}>{modelAns[key]}</Text>
                  ) : (
                    <Fraction
                      color={MYCOLOR.lightRed}
                      modelAns
                      ReadOnly
                      fillings={{food: [modelAns[key]]}}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
          );
          break;
        }
        case 'mcStringPig': {
          formattedLine = (
            <View style={styles.container}>
              <MCImageDisplay url={modelAns.img} />
              <Text style={styles.ansTextMC}>{modelAns.string}</Text>
            </View>
          );
          break;
        }
        default: {
          formattedLine = <></>;
        }
      }
      break;
    }
    case 'mixed': {
      formattedLine = (
        <View style={styles.container}>
          <Mixed modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'fiB': {
      formattedLine = (
        <View style={styles.container}>
          <Mixed modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'fiBjump': {
      formattedLine = (
        <View style={styles.container}>
          <InfiniteInput
            modelAns
            ReadOnly
            bread={sandwich.bread}
            filling={sandwich.fillings[0]}
          />
        </View>
      );
      break;
    }
    case 'fiB_hms': {
      formattedLine = (
        <View style={styles.container}>
          <HMS modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'straight': {
      formattedLine = (
        <View style={styles.container}>
          <Straight modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'homo': {
      formattedLine = (
        <View style={styles.container}>
          <Straight modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'longQ': {
      formattedLine = (
        <View style={styles.container}>
          <LongQModelAns filling={sandwich.fillings[0]} />
        </View>
      );
      break;
    }
    case 'straightJump': {
      let type = sandwich.operator ? sandwich.operator[0] : '';

      if (type === '//') {
        formattedLine = <Division modelAns ReadOnly sandwich={sandwich} />;
      }

      if (type === '/') {
        formattedLine = <ShortDivision modelAns ReadOnly sandwich={sandwich} />;
      }
      break;
    }
    case 'straightNoJump': {
      formattedLine = (
        <View style={styles.container}>
          <DivisionFib modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'numberBond': {
      formattedLine = (
        <View style={styles.container}>
          <NumberBond modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'numberLine': {
      formattedLine = (
        <View style={styles.container}>
          <NumberLine modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'table': {
      formattedLine = (
        <View style={styles.container}>
          <Table modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'barchart-x': {
      formattedLine = (
        <View style={styles.containerFullScreen}>
          <BarChartX modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'barchart-y': {
      formattedLine = (
        <View style={styles.containerFullScreen}>
          <BarChartY modelAns ReadOnly sandwich={sandwich} />
        </View>
      );
      break;
    }
    case 'conditioner': {
      formattedLine = <Conditioner sandwich={sandwich} />;
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
    marginTop: 20,
    width: widthPercentageToDP('100%'),
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 40,
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
});
