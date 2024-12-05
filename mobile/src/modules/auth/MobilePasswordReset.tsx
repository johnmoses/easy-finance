import { apiClient } from '@app/clients/axios';
import { log } from '@app/utils/logs';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import { Image, View, TouchableOpacity, Linking } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { setOtpCode } from '@app/store/slices/app';
import { styles } from '@app/styles/auth';
import { Screen } from '@app/components/Screen';

export const MobilePasswordReset = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState<any>('');
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    const userData = {
      mobile: mobile,
    };
    apiClient
      .post('/mobile-password-reset/', JSON.stringify(userData))
      .then(response => {
        if (response.status === 200) {
          setDisabled(true);
          log('Password reset initiated: ' + response.data);
          if (response.data.otp) {
            dispatch(setOtpCode(response.data.otp));
            goToPasswordResetVerify();
          }
        }
      })
      .catch(error => {
        if (error.response) {
          setMessage(Object.values(error.response.data.message));
        } else {
          setMessage('Reset not successful this time!');
          log('Reset not successful: ' + error);
        }
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [mobile]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(mobile)
    ) {
      setMessage(' Invalid mobile number ');
      return true;
    } else {
      setMessage('');
      return false;
    }
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goToPasswordResetVerify = () => {
    navigation.navigate('PasswordResetVerifyScreen');
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
        <Text style={styles.subHeaderText}>MOBILE PASSWORD RESET</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
        <View style={styles.sectionContainer}>
          <TextInput
            value={mobile}
            label={'Mobile Number'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            style={styles.input}
            onChangeText={mobile => setMobile(mobile)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={disabled}
          onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Send</Text>
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
