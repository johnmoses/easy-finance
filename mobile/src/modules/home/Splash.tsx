import { Screen } from '@app/components/Screen';
import { RootState } from '@app/store';
import { flipLoading } from '@app/store/slices/app';
import { styles } from '@app/styles';
import React from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';

export const Splash = () => {
  const state = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const theme = useTheme();

  React.useEffect(() => {
    setTimeout(() => {
      dispatch(flipLoading(false));
    }, 3000); // 3 seconds delay
  }, []);

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.sectionContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ width: 90, height: 90, margin: 5, resizeMode: 'contain' }}
          />
        </View>
        <View style={styles.sectionContainer}>
          {state.isLoading === true ? <Text>Loading...</Text> : null}
        </View>
        <View style={styles.headerContainer}>
          <Text style={{ color: theme.colors.primary, fontSize: 35 }}>
            Easy Finance
          </Text>
        </View>
        <ActivityIndicator animating={false} color={Colors.red800} />
      </View>
    </Screen>
  );
};
