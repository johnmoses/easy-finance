import { io } from "socket.io-client";
import Config from 'react-native-config';
import { Platform } from "react-native";

const baseURLAPIX = Platform.select({
    android: Config.APIX_URL_ANDROID,
    ios: Config.APIX_URL_IOS,
  })
  
export const socket = io(
    baseURLAPIX as string,
    {
    transports: ["websocket"],
});
