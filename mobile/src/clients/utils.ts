import { Platform } from "react-native";
import Config from 'react-native-config';

export const apixURL = Platform.select({
    android: Config.APIX_URL_ANDROID,
    ios: Config.APIX_URL_IOS,
});