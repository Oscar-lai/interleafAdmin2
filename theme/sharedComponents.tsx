import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SharedElement} from 'react-navigation-shared-element';

import Icon from 'react-native-vector-icons/Feather';
Icon.loadFont();

import {COLOR, MYCOLOR, myFont} from './typography';

interface IWrapper {
  customStyle?: object;
}

export const SafeWrapper: React.FC<IWrapper> = ({children, customStyle}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.PageWrapper,
        customStyle,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      {children}
    </View>
  );
};

export const RawWrapper: React.FC<IWrapper> = ({children, customStyle}) => {
  return <View style={[styles.PageWrapper, customStyle]}>{children}</View>;
};

interface IBackButton {
  customStyle?: object;
  customColor?: string;
  sharedElementID: string;
  goBack: () => void;
}

export const BackButton: React.FC<IBackButton> = ({
  customStyle,
  sharedElementID,
  customColor,
  goBack,
}) => {
  return (
    <View
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'flex-start',
      }}>
      <TouchableOpacity
        onPress={goBack}
        style={[styles.BackButton, customStyle ? customStyle : {}]}>
        <SharedElement id={sharedElementID}>
          <Icon
            style={{transform: [{translateX: -15}]}}
            name="chevron-left"
            size={60}
            color={customColor ? customColor : MYCOLOR.whiteSmoke}
          />
        </SharedElement>
      </TouchableOpacity>
    </View>
  );
};

interface IBackButton2 {
  customStyle?: object;
  customColor?: string;
  goBack: () => void;
}

export const BackButton2: React.FC<IBackButton2> = ({
  customStyle,
  goBack,
  customColor,
}) => {
  return (
    <View style={{width: '100%'}}>
      <TouchableOpacity
        onPress={goBack}
        style={[styles.BackButton, customStyle ? customStyle : {}]}>
        <Icon
          name="chevron-left"
          size={60}
          color={customColor ? customColor : MYCOLOR.whiteSmoke}
        />
      </TouchableOpacity>
    </View>
  );
};

interface IRegisternput {
  title: string;
  customStyle?: object;
  icon?: string;
  setText: (s: string) => void;
  password?: boolean;
}

export const RegisterInput: React.FC<IRegisternput> = ({
  title,
  icon,
  customStyle,
  setText,
  password,
}) => {
  const [text, onChangeText] = useState('');

  return (
    <TextInput
      style={[styles.RegisterInput, customStyle ? customStyle : {}]}
      onChangeText={t => {
        onChangeText(t);
        setText(t);
      }}
      ref={ref => ref && ref.setNativeProps({style: {fontFamily: myFont.GEN}})}
      placeholder={title}
      placeholderTextColor={MYCOLOR.lightGray}
      value={text}
      secureTextEntry={password ? true : false}
    />
  );
};

export const RegisterPWInput: React.FC<IRegisternput> = ({
  title,
  icon,
  customStyle,
  setText,
  password,
}) => {
  const [text, onChangeText] = useState('');

  return (
    <TextInput
      style={[styles.RegisterInput, customStyle ? customStyle : {}]}
      onChangeText={t => {
        onChangeText(t);
        setText(t);
      }}
      ref={ref => ref && ref.setNativeProps({style: {fontFamily: myFont.GEN}})}
      placeholder={title}
      placeholderTextColor={MYCOLOR.lightGray}
      value={text}
      secureTextEntry={password}
    />
  );
};

interface ITopTitle {
  title: string;
  customStyle?: object;
}

export const TopTitle: React.FC<ITopTitle> = ({title, customStyle}) => {
  return <Text style={[styles.Toptitle, customStyle]}>{title}</Text>;
};

interface IGreenButton {
  title: string;
  customStyle?: object;
  onPress: () => void;
}

export const GreenButton: React.FC<IGreenButton> = ({
  title,
  customStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.GreenButton, customStyle ? customStyle : {}]}
      onPress={onPress}>
      <Text style={styles.GreenButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const OutlineButton: React.FC<IGreenButton> = ({
  title,
  customStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.OutlineButton, customStyle ? customStyle : {}]}
      onPress={onPress}>
      <Text style={styles.OutlineButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

interface IShadowBox {
  customStyle?: object;
  onPress?: () => void;
}

export const ShadowBox: React.FC<IShadowBox> = ({
  customStyle,
  onPress,
  children,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress ? onPress : () => {}}
      style={[styles.ShadowBox, customStyle ? customStyle : {}]}>
      {children}
    </TouchableOpacity>
  );
};

interface ISearchBarProps {
  customStyle?: object;
  onChange: (s: string) => void;
}

export const SearchBar: React.FC<ISearchBarProps> = ({
  customStyle,
  onChange,
}) => {
  const [Text, setText] = useState<string>('');

  useEffect(() => {
    onChange(Text);
  }, [Text]);

  function clearText() {
    setText('');
  }

  return (
    <View style={[styles.SearchBar, customStyle ? customStyle : {}]}>
      <Icon name="search" size={30} color={COLOR.IconGray} />
      <TextInput
        onChangeText={setText}
        value={Text}
        style={styles.SearchBarInput}
      />
      {Text !== '' && (
        <Icon
          onPress={clearText}
          name="x-circle"
          size={20}
          color={COLOR.IconGray}
        />
      )}
    </View>
  );
};

interface IMyModal {
  visible: boolean;
  setVisible: (v: boolean) => void;
}

export const MyModal: React.FC<IMyModal> = ({
  visible,
  setVisible,
  children,
}) => {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.ModalWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.ModalBg}
          onPress={() => setVisible(false)}
        />
        <View style={styles.Modal}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  PageWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
  },
  BackButton: {
    marginVertical: '8%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 80,
  },
  RegisterInput: {
    height: 45,
    width: '70%',
    color: COLOR.gray,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: MYCOLOR.whiteSmoke,
    marginBottom: '3%',
    marginTop: '1%',
    fontSize: 16,
    paddingHorizontal: '5%',
  },
  GreenButton: {
    backgroundColor: MYCOLOR.mainGreen,
    borderRadius: 20,
    width: wp('40%'),
    height: wp('40%') / 3.7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  GreenButtonText: {
    fontSize: 20,
    color: 'white',
    fontFamily: myFont.GEN,
  },
  OutlineButton: {
    borderRadius: 20,
    width: wp('35%'),
    height: wp('40%') / 3.7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLOR.gray,
  },
  OutlineButtonText: {
    fontSize: 22,
    color: COLOR.gray,
    fontFamily: 'SetoFont',
  },
  ShadowBox: {
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 3,
    shadowOpacity: 0.4,
    elevation: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    position: 'relative',
  },
  Toptitle: {
    color: MYCOLOR.lightGray,
    fontFamily: myFont.GEN,
    fontSize: 27,
    width: '70%',
    marginBottom: '10%',
  },
  SearchBar: {
    height: 40,
    width: '88%',
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: '5%',
  },
  SearchBarInput: {
    flex: 1,
    height: 40,
    color: COLOR.gray,
    marginHorizontal: '3%',
    fontSize: 18,
  },
  ModalBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  ModalWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Modal: {
    backgroundColor: '#FFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: hp('55%'),
    width: wp('90%'),
    borderRadius: 30,
  },
});
