import React, { useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { AppContext } from '@app/contexts/AppContext';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { apixURL } from '@app/clients/utils';

export function DrawerContent(props: any) {
  const theme = useTheme();
  const state = useSelector((state: RootState) => state.app);
  const { signout } = useContext(AppContext);

  const handleSignout = () => {
    signout();
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={styles.userInfo} aria-label='Photo'>
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            props.navigation.toggleDrawer();
          }}>
          <Avatar.Image
            source={{
              uri: state.authUserAvatar
                ? `${apixURL}/static/uploads/users/${state.authUserAvatar}`
                : `${apixURL}/static/uploads/users/user.jpg`,
            }}
            size={60}
            accessibilityLabel='Avatar'
          />
        </TouchableOpacity>
        {/* {state.appUserName && <Caption>{state.appUserName}</Caption>} */}
      </View>
      <DrawerItem
          label={({}) => (
            <Text style={{ color: theme.colors.primary }}>Help Center</Text>
          )}
        icon={({}) => (
          <Icon
            name="help-circle-outline"
            size={24}
            color={theme.colors.primary}
          />
        )}
        onPress={() => {
          props.navigation.navigate('Home', {
            screen: 'HelpCategoriesScreen',
          });
        }}
      />
      <DrawerItem
          label={({}) => (
            <Text style={{ color: theme.colors.primary }}>About</Text>
          )}
        icon={({}) => (
          <Icon
            name="information-outline"
            size={24}
            color={theme.colors.primary}
          />
        )}
        onPress={() => {
          props.navigation.navigate('Home', {
            screen: 'AboutScreen',
          });
        }}
      />
      {state.isAuth === false ? (
        <DrawerItem
          label={({}) => (
            <Text style={{ color: theme.colors.primary }}>Sign in</Text>
          )}
          icon={({}) => (
            <Icon
              name="login"
              size={24}
              color={theme.colors.primary}
            />
          )}
          onPress={() => {
            props.navigation.navigate('Auth', {
              screen: 'SigninScreen',
            });
          }}
        />
      ) : null}
      {state.isAuth === false ? (
        <DrawerItem
          label={({}) => (
            <Text style={{ color: theme.colors.primary }}>Sign up</Text>
          )}
          icon={({}) => (
            <Icon
              name="account-plus"
              size={24}
              color={theme.colors.primary}
            />
          )}
          onPress={() => {
            props.navigation.navigate('Auth', {
              screen: 'EmailSignupScreen',
            });
          }}
        />
      ) : null}
      {state.isAuth === true ? (
        <DrawerItem
          label={({}) => (
            <Text style={{ color: theme.colors.primary }}>Sign out</Text>
          )}
          icon={({}) => (
            <Icon name="logout" size={24} color={theme.colors.primary} />
          )}
          onPress={() => {
            props.navigation.toggleDrawer();
            Alert.alert(
              'Sign out',
              'Are you sure you want to sign out?',
              [
                {
                  text: 'Cancel',
                  onPress: () => {
                    return null;
                  },
                },
                {
                  text: 'Confirm',
                  onPress: () => {
                    handleSignout();
                  },
                },
              ],
              { cancelable: false },
            );
          }}
        />
      ) : null}
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfo: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 14,
    lineHeight: 14,
  },
});
