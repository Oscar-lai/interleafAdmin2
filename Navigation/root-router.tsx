import React, {useContext, useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';

import {UserContext} from '../provider/userContext';
import Login from '../screen/login';
import MainRouter from './Navigator';

const RootStack = createSharedElementStackNavigator();

interface IRootRouter {
  token: string | null;
}
const RootRouter: React.FC<IRootRouter> = () => {
  const {myUser} = useContext(UserContext);
  return (
    <RootStack.Navigator>
      {myUser.isLogin ? (
        <RootStack.Screen
          name="main"
          component={MainRouter}
          options={{
            headerShown: false,
            cardStyleInterpolator: ({current: {progress}}) => {
              return {
                cardStyle: {
                  opacity: progress,
                },
              };
            },
          }}
        />
      ) : (
        <RootStack.Screen
          name="login"
          component={Login}
          options={{
            headerShown: false,
            cardStyleInterpolator: ({current: {progress}}) => {
              return {
                cardStyle: {
                  opacity: progress,
                },
              };
            },
          }}
        />
      )}
    </RootStack.Navigator>
  );
};

export default RootRouter;
