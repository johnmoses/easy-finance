import React, { useContext, useRef } from 'react';
import {
  Provider as PaperProvider,
  DefaultTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { RootNavigator } from '@app/navigators';
import { AppContext } from '@app/contexts/AppContext';
import { setCurrentRoute } from '@app/store/slices/app';

export const Main = () => {
  const state = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const { track } = useContext(AppContext);
  const navigationRef = useRef<any>();
  const routeNameRef = useRef<any>();

  return (
    <PaperProvider
      theme={
        state.appTheme === 'dark'
          ? {
            ...MD3DarkTheme,
            colors: {
              ...MD3DarkTheme.colors,
              primary: '#1ba1f2',
            },
          }
          : {
            ...DefaultTheme,
            colors: {
              ...DefaultTheme.colors,
              primary: '#1ba1f2',
            },
          }
      }>
      <NavigationContainer
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;
          if (previousRouteName !== currentRouteName) {
            dispatch(setCurrentRoute(currentRouteName))
            track('Navigation', currentRouteName)
          }
          routeNameRef.current = currentRouteName;
        }}>
        <RootNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
};
