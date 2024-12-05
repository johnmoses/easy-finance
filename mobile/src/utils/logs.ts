// import analytics from '@react-native-firebase/analytics';

export const log = (message: any) => {
    if (__DEV__) {
      // console.log(message);
    }
  };
  
  // export const track = (event: string, message: any) => {
  //   if (__DEV__) {
  //     // console.log(event, message);
  //   } else {
  //     // analytics().logEvent(event, {
  //     //   event: event,
  //     //   message: message,
  //     // });
  //     // console.log('Analytics...');
  //   }
  // };
  