import React, {useEffect, useState} from 'react';

import RootRouter from './Navigation/root-router';
import {IUser, UserContext} from './provider/userContext';
import Loading from './components/Loading';
import auth from '@react-native-firebase/auth';

interface SetupProps {}

const Setup: React.FC<SetupProps> = () => {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [myUser, setUser] = useState<IUser>({
    token: '',
    uid: '',
    type: '',
    isLogin: false,
  });

  useEffect(() => {
    let flag = true;

    auth().onAuthStateChanged(async user => {
      console.log('setting user');
      if (user) {
        const uid = user.uid;
        console.log('have user ' + uid);
        if (flag) {
          setUser(myUser => {
            return {...myUser, uid: uid};
          });
        }
        const tokenID = await auth().currentUser?.getIdTokenResult(true);
        if (tokenID) {
          if (flag) {
            setUser(myUser => {
              return {...myUser, token: tokenID.token};
            });
          }
          console.log('set jor token');
        }

        const type: any = tokenID?.claims?.type ?? '';
        if (flag) {
          setUser(myUser => {
            return {...myUser, type: type};
          });
        }
        if (flag) {
          setUser(myUser => {
            return {...myUser, isLogin: true};
          });
        }

        setIsloading(false);
      } else {
        console.log('no user');
        if (flag) {
          setUser({
            token: '',
            uid: '',
            type: '',
            isLogin: false,
          });
        }
        if (flag) {
          setIsloading(false);
        }
      }
    });

    return () => {
      flag = false;
    };
  }, []);

  useEffect(() => {
    console.log(myUser);
  }, [myUser]);

  return (
    <UserContext.Provider value={{myUser, setUser}}>
      {isLoading === true ? <Loading /> : <RootRouter token={myUser.token} />}
    </UserContext.Provider>
  );
};

export default Setup;
