declare module 'react-native-config' {
    export interface NativeConfig {
        GRAPHQL_URL_ANDROID?: string;
        GRAPHQL_URL_IOS?: string;
        API_URL_ANDROID?: string;
        API_URL_IOS?: string;
        APIX_URL_ANDROID?: String;
        APIX_URL_IOS?: String;
    }
    
    export const Config: NativeConfig
    export default Config
  }