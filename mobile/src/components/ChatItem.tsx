import React from 'react';
import {
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChatUserImage } from './ChatUserImage';
import { Badge, Text } from 'react-native-paper';
import { styles } from '@app/styles/chat';

interface IProps {
  chatName?: string;
  userImageSource: ImageSourcePropType;
  lastContent?: any;
  unread?: number;
  modifiedAt?: string;
  onChatPress?: (id: any) => void;
}
export const ChatItem: React.FC<IProps> = ({
  chatName,
  userImageSource,
  lastContent,
  unread,
  modifiedAt,
  onChatPress,
}: IProps) => {
  return (
    <View style={styles.container}>
      <ChatUserImage
        source={userImageSource}
        containerStyle={styles.userImageContainer}
        imageStyle={{ width: 50, height: 50, borderRadius: 50 }}
      />
      <View style={styles.contentContainer}>
        <TouchableOpacity onPress={onChatPress}>
          <View style={styles.topContentContainer}>
            <Text style={[styles.userNameStyle]}>{chatName}</Text>
            <Text>{modifiedAt}</Text>
          </View>
          <View
            style={[styles.topContentContainer, { alignItems: 'flex-end' }]}>
            <View style={styles.lastMessageContainer}>
              <Text>{lastContent}</Text>
              <Badge size={15}>{unread}</Badge>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

