import { apiClient } from '@app/clients/axios';
import { log } from '@app/utils/logs';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Image, View, TouchableOpacity, Linking } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { styles } from '@app/styles/auth';
import { Screen } from '@app/components/Screen';

export const PasswordChange = () => {
  const navigation = useNavigation<any>();
  const firstRender = useRef(true);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    apiClient
      .get(`/password-change/${password}`)
      .then(response => {
        if (response.status === 200) {
          setDisabled(true);
          setMessage('Password changed');
          log('Password changed: ' + response.data);
          goHome();
        }
      })
      .catch(error => {
        setMessage('Could not chnange password this time');
        setDisabled(false);
        log('Failed to change password: ' + error);
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [password]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(password)
    ) {
      setMessage(' Invalid password ');
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
        <Text style={styles.subHeaderText}>PASSWORD CHANGE</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
        <View style={styles.sectionContainer}>
          <TextInput
            value={password}
            label={'Password'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            secureTextEntry
            style={styles.input}
            onChangeText={password => setPassword(password)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={disabled}
          onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Change Password</Text>
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
