import { apiClient } from '@app/clients/axios';
import { log } from '@app/utils/logs';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Image, View, TouchableOpacity, Linking } from 'react-native';
import { Text, Checkbox, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setOtpCode } from '@app/store/slices/app';
import { styles } from '@app/styles/auth';
import { Screen } from '@app/components/Screen';

export const EmailSignup = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState<any>('');
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    const userData = {
      username: username,
      email: email,
      password: password,
    };
    apiClient
      .post('/email-signup/', JSON.stringify(userData))
      .then(response => {
        if (response.status === 200) {
          setDisabled(true);
          dispatch(setOtpCode(response.data.otp));
          log('Sign up successful: ' + response.data);
          goToSignupVerify('email');
        }
      })
      .catch(error => {
        if (error.response) {
          setMessage(Object.values(error.response.data.message));
        } else {
          setMessage('Signup is not successful this time');
          setDisabled(false);
          log('Signup not successful: ' + error);
        }
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [username, email, password, passwordConfirm, isChecked]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(username)
    ) {
      setMessage(' Invalid username ');
      return true;
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setMessage(' Invalid password ');
      return true;
    } else if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(password)
    ) {
      setMessage(' Invalid password ');
      return true;
    } else if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(
        passwordConfirm,
      )
    ) {
      setMessage(' Invalid confirmation ');
      return true;
    } else if (password !== passwordConfirm) {
      setMessage('Passwords do not match');
      return true;
    } else if (isChecked !== true) {
      setMessage('Must agree with terms');
      return true;
    } else {
      setMessage('');
      return false;
    }
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goToSignin = () => {
    navigation.navigate('SigninScreen');
  };

  const goToSignupVerify = (mode: any) => {
    navigation.navigate('SignupVerifyScreen', { mode });
  };

  const goToMobileSignup = () => {
    navigation.navigate('MobileSignupScreen');
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
        <Text style={styles.subHeaderText}>EMAIL SIGN UP</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
        <View style={styles.sectionContainer}>
          <TextInput
            value={username}
            label={'User Name'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            style={styles.input}
            onChangeText={username => setUsername(username)}
          />
          <TextInput
            value={email}
            label={'Email'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={email => setEmail(email)}
          />
          <TextInput
            value={password}
            label={'Password'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={styles.input}
            onChangeText={password => setPassword(password)}
          />
          <TextInput
            value={passwordConfirm}
            label={'Password Confirmation'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            style={styles.input}
            onChangeText={passwordConfirm =>
              setPasswordConfirm(passwordConfirm)
            }
          />
          <View style={styles.switchContainer}>
            <Checkbox
              status={isChecked ? 'checked' : 'unchecked'}
              onPress={() => setIsChecked(!isChecked)}
              uncheckedColor="blue"
              color="red"
            />
            <Text>I agree with the terms and conditions</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={disabled}
          onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => goHome()}>
            <Text style={styles.switchAction}>Cancel</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => goToSignin()}>
            <Text style={styles.switchAction}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => goToMobileSignup()}>
            <Text style={styles.switchAction}>Sign up - Mobile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => goToSignupVerify('email')}>
            <Text style={styles.switchAction}>Verify</Text>
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
