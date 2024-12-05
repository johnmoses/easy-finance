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

export const MobileSignup = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [message, setMessage] = useState<any>('');
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    const userData = {
      username: username,
      mobile: mobile,
      password: password,
    };
    apiClient
      .post('/mobile-signup/', JSON.stringify(userData))
      .then(response => {
        if (response.status === 200) {
          setDisabled(true);
          dispatch(setOtpCode(response.data.otp));
          log('Sign up successful: ' + response.data);
          goToSignupVerify('mobile');
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
  }, [username, mobile, password, passwordConfirm, isChecked]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(username)
    ) {
      setMessage(' Invalid username ');
      return true;
    } else if (
      !/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/.test(
        mobile,
      )
    ) {
      setMessage(' Invalid mobile number ');
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
        <Text style={styles.subHeaderText}>MOBILE SIGN UP</Text>
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
            value={mobile}
            label={'Mobile Number'}
            placeholder={'+2348023345443'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            onChangeText={mobile => setMobile(mobile)}
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
          <View accessibilityLabel='Checkbox' style={styles.switchContainer}>
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
          <TouchableOpacity onPress={() => goToEmailSignup()}>
            <Text style={styles.switchAction}>Sign up - email</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => goToSignupVerify('mobile')}>
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
