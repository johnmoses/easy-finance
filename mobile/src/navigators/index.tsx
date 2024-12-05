import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeStack } from './HomeStack';
import { MeStack } from './MeStack';
import { Badge, useTheme } from 'react-native-paper';
import { DrawerContent } from './DrawerContent';
import { createStackNavigator } from '@react-navigation/stack';
import {
  PasswordChangeScreen,
  MobilePasswordResetScreen,
  PasswordResetVerifyScreen,
  SigninScreen,
  MobileSignupScreen,
  MobileSignupVerifyResendScreen,
  SignupVerifyScreen,
  EmailSignupScreen,
  EmailSignupVerifyResendScreen,
  EmailPasswordResetScreen,
} from '@app/screens/Auth';
import { ChatsStack } from './ChatsStack';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { SplashScreen } from '@app/screens/App';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="SigninScreen">
      <Stack.Screen
        name="EmailSignupScreen"
        component={EmailSignupScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MobileSignupScreen"
        component={MobileSignupScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignupVerifyScreen"
        component={SignupVerifyScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EmailSignupVerifyResendScreen"
        component={EmailSignupVerifyResendScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MobileSignupVerifyResendScreen"
        component={MobileSignupVerifyResendScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SigninScreen"
        component={SigninScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PasswordChangeScreen"
        component={PasswordChangeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EmailPasswordResetScreen"
        component={EmailPasswordResetScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MobilePasswordResetScreen"
        component={MobilePasswordResetScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PasswordResetVerifyScreen"
        component={PasswordResetVerifyScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

const BottomStack = () => {
  const theme = useTheme();
  const state = useSelector((state: RootState) => state.app);
  const chatState = useSelector((state: RootState) => state.chat);
  const { colors } = theme;
  return (
    <Tab.Navigator
      initialRouteName="MainTab"
      screenOptions={{ headerShown: false }}
      backBehavior="initialRoute">
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name="home"
              color={focused ? colors.primary : colors.secondary}
              style={styles.iconStyle}
              size={24}
            />
          ),
        }}
      />
      {state.isAuth === true ? (
        <Tab.Screen
          name="Chats"
          component={ChatsStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <View>
                {chatState.unreadMessages > 0 && <Badge size={15}>{chatState.unreadMessages}</Badge>}
                <Icon
                  name="chat-outline"
                  color={focused ? colors.primary : colors.secondary}
                  style={styles.iconStyle}
                  size={24}
                />
              </View>
            ),
          }}
        />
      ) : null}
      {state.isAuth === true ? (
        <Tab.Screen
          name="Me"
          component={MeStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <Icon
                name="account-circle-outline"
                color={focused ? colors.primary : colors.secondary}
                style={styles.iconStyle}
                size={24}
              />
            ),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
};

const RootStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomStack" component={BottomStack} />
    </Stack.Navigator>
  );
};

const DrawerRoutes = () => {
  return (
    <Drawer.Navigator
      initialRouteName="EasyFinance"
      screenOptions={{ headerShown: false }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="EasyFinance" component={RootStack} />
    </Drawer.Navigator>
  );
};

export const RootNavigator = () => {
  const state = useSelector((state: RootState) => state.app);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animationEnabled: false }}>
      {state.isLoading === true ? (
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="DrawerRoutes"
          component={DrawerRoutes}
          options={{ headerShown: false }}
        />
      )}
      <Stack.Screen
        name="Auth"
        component={AuthStack}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    padding: 0,
    margin: 0,
  },
});
