import React, {useState} from 'react';
import {Image, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {
  GreenButton,
  RegisterInput,
  SafeWrapper,
} from '../theme/sharedComponents';
import {login} from '../firebase/Config';
import Toast from 'react-native-toast-message';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface Ilogin {
//   navigation: any;
  // route: RouteProp<{params: {type: string}}, 'params'>;
}

const LoginPage: React.FC<Ilogin> = ({}) => {
  const [email, setEmail] = useState('');
  // const [username, setUsername] = useState('');
  const [pw, setPW] = useState('');

  async function Login() {
    if (email !== 'admin@mathod.com') {
      Toast.show({
        type: 'error',
        text1: '不是管理員',
        text2: '請使用管理員帳號登入',
        visibilityTime: 1000,
      });
      return;
    }

    const res = await login(email, pw);
    if (!res) {
      Toast.show({
        type: 'error',
        text1: '密碼錯誤',
        text2: '請輸入正確密碼',
        visibilityTime: 1000,
      });
    }
  }

  return (
    <SafeWrapper>
      <KeyboardAwareScrollView
        style={styles.ScrollViewWrapper}
        contentContainerStyle={{
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        <Image
          style={styles.LogoImg}
          source={require('../img/interleaf_logo_stacked.png')}
        />
        <RegisterInput title="電郵地址" setText={setEmail} />
        <RegisterInput password title="密碼" setText={setPW} />
        <GreenButton
          onPress={Login}
          title="登入"
          customStyle={{marginTop: '12%'}}
        />
      </KeyboardAwareScrollView>
    </SafeWrapper>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  LogoImg: {
    width: '60%',
    height: wp('60%'),
    resizeMode: 'contain',
    marginTop: '4%',
    marginBottom: '10%',
  },
  ScrollViewWrapper: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    backgroundColor: '#FAFAFA',
    paddingTop: '20%',
  },
});
