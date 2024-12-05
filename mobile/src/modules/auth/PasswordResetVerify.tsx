import { apiClient } from '@app/clients/axios';
import { log } from '@app/utils/logs';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Image, View, TouchableOpacity, Linking } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { styles } from '@app/styles/auth';
import { Screen } from '@app/components/Screen';

export const PasswordResetVerify = () => {
  const navigation = useNavigation<any>();
  const firstRender = useRef(true);
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    const userData = {
      code: code,
      password: password,
    };
    apiClient
      .post('/password-reset-verify/', JSON.stringify(userData))
      .then(response => {
        if (response.status === 200) {
          setDisabled(true);
          log('Password reset successful: ' + response.data);
          goToSignin();
        }
      })
      .catch(error => {
        setMessage('Password reset not successful this time');
        setDisabled(false);
        log('Password reset not successful: ' + error);
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [code, password]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(code)
    ) {
      setMessage(' Enter valid code ');
      return true;
    } else if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(password)
    ) {
      setMessage(' Enter valid password ');
      return true;
    } else if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(
        passwordConfirm,
      )
    ) {
      setMessage(' Enter valid confirmation ');
      return true;
    } else if (password !== passwordConfirm) {
      setMessage('Passwords do not match');
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
        <Text style={styles.subHeaderText}>PASSWORD RESET VERIFICATION</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
        <View style={styles.sectionContainer}>
          <TextInput
            value={code}
            label={'One time password(OTP)'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            style={styles.input}
            onChangeText={code => setCode(code)}
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
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={disabled}
          onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        <View style={styles.switchContainer}>
          <TouchableOpacity onPress={() => goHome()}>
            <Text style={styles.switchAction}>Cancel</Text>
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
