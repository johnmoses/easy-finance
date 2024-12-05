import React from 'react';
import { Appbar } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MeStackParamList } from '@app/types';
import { MeScreen } from '@app/screens/Users';
import { TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createNativeStackNavigator<MeStackParamList>();

export const MeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MeScreen"
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
        name="MeScreen"
        component={MeScreen}
        options={{ headerTitle: 'Me' }}
      />
    </Stack.Navigator>
  );
};
