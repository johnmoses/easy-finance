import React from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { Text } from 'react-native-paper';
import { ChatUserImage } from './ChatUserImage';
import { styles } from '@app/styles/chat';

interface IProps {
  userImageSource: ImageSourcePropType;
  title?: string;
}
export const ChatHeader = ({ userImageSource, title }: IProps) => {
  return (
    <>
      <View style={styles.container}>
        <ChatUserImage
          source={userImageSource}
          containerStyle={styles.userImageContainer}
          imageStyle={{ width: 40, height: 40, borderRadius: 50 }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.textStyle}>{title}</Text>
        </View>
      </View>
    </>
  );
};
