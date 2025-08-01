import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import FinanceScreen from '../screens/FinanceScreen';
import WealthScreen from '../screens/WealthScreen';
import PlanningScreen from '../screens/PlanningScreen';
import BlockchainScreen from '../screens/BlockchainScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#666',
      headerShown: false,
      tabBarStyle: {
        height: 60,
        paddingBottom: 8,
        paddingTop: 8,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
      },
    }}>
    <Tab.Screen 
      name="Home" 
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Text style={{ color, fontSize: 24 }}>🏠</Text>
        ),
      }}
    />
    <Tab.Screen 
      name="Finance" 
      component={FinanceScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Text style={{ color, fontSize: 24 }}>💰</Text>
        ),
      }}
    />
    <Tab.Screen 
      name="Chat" 
      component={ChatScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Text style={{ color, fontSize: 24 }}>🤖</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Wealth" component={WealthScreen} />
      <Stack.Screen name="Planning" component={PlanningScreen} />
      <Stack.Screen name="Blockchain" component={BlockchainScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;