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

export const EmailSignupVerifyResend = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const firstRender = useRef(true);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<any>('');
  const [disabled, setDisabled] = useState(true);

  const handleSubmit = () => {
    const userData = {
      email: email,
    };
    apiClient
      .post('/email-signup-verify-resend/', JSON.stringify(userData))
      .then(response => {
        if (response.status === 200) {
          setDisabled(true);
          log('Sign up verification resent: ' + response.data);
          if (response.data.otp) {
            dispatch(setOtpCode(response.data.otp));
            goToSignupVerify();
          }
        }
      })
      .catch(error => {
        if (error.response) {
          setMessage(Object.values(error.response.data.message));
        } else {
          setMessage('Resending not successful this time!');
          log('Resending not successful: ' + error);
        }
      });
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setDisabled(validateForm);
  }, [email]);

  const validateForm = () => {
    if (
      !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        email,
      )
    ) {
      setMessage(' Invalid email ');
      return true;
    } else {
      setMessage('');
      return false;
    }
  };

  const goHome = () => {
    navigation.navigate('Home');
  };

  const goToSignupVerify = () => {
    navigation.navigate('SignupVerifyScreen');
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
        <Text style={styles.subHeaderText}>
          EMAIL SIGNUP VERIFICATION RESEND
        </Text>
        <View style={styles.switchContainer}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
        <View style={styles.sectionContainer}>
          <TextInput
            value={email}
            label={'Email address'}
            mode='outlined'
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            style={styles.input}
            onChangeText={email => setEmail(email)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={disabled}
          onPress={() => handleSubmit()}>
          <Text style={styles.buttonText}>Resend verification Code</Text>
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
