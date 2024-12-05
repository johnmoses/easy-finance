import React from 'react';
import { Linking, View } from 'react-native';
import { Card, Paragraph } from 'react-native-paper';
import { Screen } from '../components/Screen';

export const AboutScreen = () => {
  return (
    <Screen>
      <Card>
        <Card.Title title={'About'} />
        <Card.Content>
          <Paragraph>
            {'Easy finance is a stock and investment management app'}
          </Paragraph>
        </Card.Content>
      </Card>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Paragraph
          onPress={() => {
            Linking.openURL('https://easyfinance.org');
          }}>
          Visit https://easyfinance.org
        </Paragraph>
      </View>
    </Screen>
  );
};
