import { RootState } from '@app/store';
// import analytics from '@react-native-firebase/analytics';
import { useSelector } from 'react-redux';

export async function useScreenView(currentScreen: any) {
  const state = useSelector((state: RootState) => state.app);
//   const [analyticCreate] = useAnalyticCreateMutation();
  // await analytics()
  //   .logScreenView({
  //     screen_class: currentScreen,
  //     screen_name: currentScreen,
  //   })
  //   .then(() => {
  //     track(
  //       '1',
  //       '',
  //     );
  //   });
}
