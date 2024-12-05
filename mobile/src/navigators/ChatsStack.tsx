import React from 'react';
import { Appbar } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ChatsStackParamList } from '@app/types';
import { TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ChatInfoScreen, ChatScreen, ChatsScreen } from '@app/screens/Chats';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { ChatHeader } from '@app/components/ChatHeader';
import { apixURL } from '@app/clients/utils';

const Stack = createNativeStackNavigator<ChatsStackParamList>();

export const ChatsStack = () => {
  const chatState = useSelector((state: RootState) => state.chat);
  return (
    <Stack.Navigator
      initialRouteName="ChatsScreen"
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
                title={
                  title === 'Chat' ? (
                    <TouchableOpacity
                      onPress={() => {
                        scene.navigation.navigate('ChatInfoScreen');
                      }}>
                      <ChatHeader
                        title={chatState.activeName}
                        userImageSource={{
                          uri: 'user.png'
                          ? `${apixURL}/static/uploads/chats/${'user.jpg'}`
                          : `${apixURL}/static/uploads/chats/user.svg`
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    title.toString()
                  )
                }
              />
            </Appbar.Header>
          );
        },
      }}>
      <Stack.Screen
        name="ChatsScreen"
        component={ChatsScreen}
        options={{ headerTitle: 'Chats' }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerTitle: 'Chat',
        }}
      />
      <Stack.Screen
        name="ChatInfoScreen"
        component={ChatInfoScreen}
        options={{ headerTitle: 'Chat Info' }}
      />
    </Stack.Navigator>
  );
};
