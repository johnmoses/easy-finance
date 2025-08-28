import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';

import HomeScreen from '../screens/HomeScreen';
import AuthScreen from '../screens/AuthScreen';
import FinanceScreen from '../screens/FinanceScreen';
import WealthScreen from '../screens/WealthScreen';
import BlockchainScreen from '../screens/BlockchainScreen';
import ChatScreen from '../screens/ChatScreen';
import ChatsScreen from '../screens/ChatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BillingScreen from '../screens/BillingScreen'; // Ensure this is a default export

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
    }}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="home" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Finance"
      component={FinanceScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="dollar" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Blockchain"
      component={BlockchainScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="bitcoin" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Chats"
      component={ChatsScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="comments" size={size} color={color} />,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        tabBarIcon: ({ color, size }) => <Icon name="user" size={size} color={color} />,
      }}
    />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="Wealth" component={WealthScreen} />
      <Stack.Screen name="Billing" component={BillingScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;