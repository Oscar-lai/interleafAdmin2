import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {specialCharacters} from '../../../../theme/typography';

//You can set the special chracter by yourself by inputting the index of the string
//if there is no specification, the special string will be the one in the file of typography
interface IQuestionText {
  style?: any;
  specialStyle?: any;
  containerStyle?: any;
  specialChracterIndex?: number[]; //optional to indicate the special string in a text
  WithinOneLine?: boolean; //if true it will adjust the font size into oneLine
}

const QuestionText: React.FC<IQuestionText> = ({
  children,
  style,
  specialStyle,
  containerStyle,
  specialChracterIndex,
  WithinOneLine,
}) => {
  let stringArray = children ? String(children).split('') : [];

  function special(character: string, index: number) {
    if (specialChracterIndex) {
      return specialChracterIndex.includes(index);
    } else {
      return specialCharacters.includes(character);
    }
  }

  //style can be array -> destructuring
  let textStyle: any[] = Array.isArray(style) ? style : [style];
  let containerStyle_array: any[] = Array.isArray(containerStyle)
    ? containerStyle
    : [containerStyle];

  //WithinOneLine - measure width
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [textWidth, setTextWidth] = useState<number>(0);
  const onLayout = (event: {nativeEvent: {layout: {width: any}}}) => {
    const {width} = event.nativeEvent.layout;
    setContainerWidth(width);
  };
  const onLayout_text = (event: {nativeEvent: {layout: {width: any}}}) => {
    const {width} = event.nativeEvent.layout;
    setTextWidth(width);
  };

  //WithinOneLine - font size
  let font = 12; //deafult
  for (let styleObj of textStyle) {
    if (styleObj.fontSize) {
      font = styleObj.fontSize;
    }
  }
  let specialCharFont =
    specialStyle && specialStyle.fontSize ? specialStyle.fontSize : font;
  const [textFont, setTextFont] = useState<number>(font);
  const [specialFont, setSpecialFont] = useState<number>(specialCharFont);

  useEffect(() => {
    if (WithinOneLine && textWidth > containerWidth && containerWidth !== 0) {
      let diminishingProp = containerWidth / textWidth;
      let textTemp = textFont * diminishingProp;
      let specialTemp = specialFont * diminishingProp;
      setTextFont(textTemp);
      setSpecialFont(specialTemp);
    }
  }, [textWidth, containerWidth]);

  return (
    <View
      style={[
        styles.container,
        ...containerStyle_array,
        WithinOneLine ? {width: '100%'} : {},
      ]}
      onLayout={onLayout}>
      <View style={{flexDirection: 'row'}} onLayout={onLayout_text}>
        {stringArray.map((string: string, index: number) =>
          string === ' ' ? (
            <Text
              style={[
                ...textStyle,
                special(string, index) ? specialStyle : {},
                WithinOneLine
                  ? {fontSize: special(string, index) ? specialFont : textFont}
                  : {},
              ]}
              key={index}>
              &nbsp;
            </Text>
          ) : (
            <Text
              style={[
                ...textStyle,
                special(string, index) ? specialStyle : {},
                WithinOneLine
                  ? {fontSize: special(string, index) ? specialFont : textFont}
                  : {},
              ]}
              key={index}>
              {string}
            </Text>
          ),
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default QuestionText;
