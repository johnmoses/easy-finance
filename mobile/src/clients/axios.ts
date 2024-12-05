import axios from 'axios';
import {Platform} from 'react-native';
import Config from 'react-native-config';

export const apiClient = axios.create({
  baseURL: Platform.select({
    android: Config.API_URL_ANDROID,
    ios: Config.API_URL_IOS,
  }),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const baseURLAPIX = Platform.select({
  android: Config.APIX_URL_ANDROID,
  ios: Config.APIX_URL_IOS,
})

export const apixClient = axios.create({
  baseURL: baseURLAPIX as string,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});
