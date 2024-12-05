import { Screen } from '@app/components/Screen';
import { AppContext } from '@app/contexts/AppContext';
import { useTokenAuthMutation } from '@app/gql/schemas';
import { setToken } from '@app/store/slices/app';
import { styles } from '@app/styles/auth';
import { log } from '@app/utils/logs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Image, Linking, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';

export const Signin = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const firstRender = useRef(true);
  const { setup } = useContext(AppContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [tokenAuth] = useTokenAuthMutation({
    variables: {
      username: username,
      password: password,
    },
  });

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [username, password]);

  const validateForm = () => {
    if (!/^(?!\s*$).+/.test(username)) {
      setMessage(' Invalid username ');
      return true;
    } else if (!/^(?!\s*$).+/.test(password)) {
      setMessage(' Invalid password ');
      return true;
    } else {
      setMessage('');
      return false;
    }
  };

  const handleSignIn = async (tokenAuth: any) => {
    try {
      const res = await tokenAuth();
      if (res) {
        // console.log('Token: ', res.data.tokenAuth.token);
        AsyncStorage.setItem('authToken', res.data.tokenAuth.token);
        AsyncStorage.setItem('isOffline', JSON.stringify('false'));
        dispatch(setToken(res.data?.tokenAuth?.token));
        setup();
        goHome();
      }
    } catch (e: any) {
      setMessage(' Sign in not successful!');
      log('Sign in not successful! ' + e);
    }
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goToEmailPasswordReset = () => {
    navigation.navigate('EmailPasswordResetScreen');
  };

  const goToMobilePasswordReset = () => {
    navigation.navigate('MobilePasswordResetScreen');
  };

  const goToMobileSignup = () => {
    navigation.navigate('MobileSignupScreen');
  };

  const goToEmailSignup = () => {
    navigation.navigate('EmailSignupScreen');
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.imageStyle}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>EasyFinance</Text>
        </View>
        <Text style={styles.subHeaderText}>SIGN IN</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
        <View style={styles.sectionContainer}>
          <TextInput
            value={username}
            label={"User Name"}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            style={styles.input}
            left={<TextInput.Icon icon="account-box" />}
            onChangeText={username => setUsername(username)}
          />
          <TextInput
            value={password}
            label={'Password'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={styles.input}
            left={<TextInput.Icon icon="onepassword" />}
            onChangeText={password => setPassword(password)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={disabled}
          onPress={() => handleSignIn(tokenAuth)}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => goHome()}>
            <Text style={styles.switchAction}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text>Sign up?</Text>
          <TouchableOpacity onPress={() => goToMobileSignup()}>
            <Text style={styles.switchAction}>Mobile |</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goToEmailSignup()}>
            <Text style={styles.switchAction}>Email</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <Text>Forgot password?</Text>
          <TouchableOpacity onPress={() => goToMobilePasswordReset()}>
            <Text style={styles.switchAction}>Mobile |</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => goToEmailPasswordReset()}>
            <Text style={styles.switchAction}>Email</Text>
          </TouchableOpacity>
        </View>
        <Text
          onPress={() => {
            Linking.openURL('http://easyfinance.org');
          }}>
          Visit http://easyfinance.org
        </Text>
      </View>
    </Screen>
  );
};
