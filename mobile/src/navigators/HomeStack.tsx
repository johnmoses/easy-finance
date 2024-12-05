import React from 'react';
import { Appbar } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeStackParamList } from '@app/types';
import { HomeScreen } from '@app/screens/Home';
import { AboutScreen } from '@app/screens/About';
import { TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  HelpCategoriesScreen,
  HelpCategoryScreen,
} from '@app/screens/HelpCategories';
import { HelpScreen, HelpsScreen } from '@app/screens/Helps';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        header: scene => {
          const { options } = scene;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name;

          return (
            <Appbar.Header>
              {scene.back ? (
                <Appbar.BackAction
                  onPress={scene.navigation.goBack}
                  // color={theme.colors.primary}
                  color="white"
                />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    (
                      scene.navigation as any as DrawerNavigationProp<{}>
                    ).openDrawer();
                  }}>
                  <Icon name="menu" size={20} color={'white'} />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={title.toString()}
                titleStyle={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  // color: theme.colors.primary,
                  color: 'white',
                }}
              />
            </Appbar.Header>
          );
        },
      }}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: 'Home' }}
      />
      <Stack.Screen
        name="HelpCategoriesScreen"
        component={HelpCategoriesScreen}
        options={{ headerTitle: 'Help Categories' }}
      />
      <Stack.Screen
        name="HelpCategoryScreen"
        component={HelpCategoryScreen}
        options={{ headerTitle: 'Help Category' }}
      />
      <Stack.Screen
        name="HelpsScreen"
        component={HelpsScreen}
        options={{ headerTitle: 'Help Topics' }}
      />
      <Stack.Screen
        name="HelpScreen"
        component={HelpScreen}
        options={{ headerTitle: 'Help Topic' }}
      />
      <Stack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{ headerTitle: 'About' }}
      />
    </Stack.Navigator>
  );
};
