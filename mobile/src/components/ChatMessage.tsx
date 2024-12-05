import { apixURL } from '@app/clients/utils';
import { styles } from '@app/styles/chat';
import React, { useRef, useState } from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { Appbar, Menu, Paragraph, Text } from 'react-native-paper';
import Video, { VideoRef } from 'react-native-video';

interface IProps {
  sender?: string;
  message?: string;
  attachment?: string;
  timestamp?: string;
  isRightAlign?: boolean;
  isDeleted?: boolean;
  deletedAt?: string;
  deleteMessage: () => void;
}

export const ChatMessage = ({
  sender,
  message,
  attachment,
  timestamp,
  isRightAlign,
  isDeleted,
  deletedAt,
  deleteMessage,
}: IProps) => {

  const videoRef = useRef<VideoRef>(null);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisible = () => setIsVisible(!isVisible);
  const openDelete = () => {
    deleteMessage();
    toggleVisible();
  };

  const docSelect = (attachment: any) => {
    const ext = attachment.split('.').pop();
    if (ext === '') {
      return (<View></View>)
    }
    else if (ext === 'png' || 'jpg' || 'jpeg') {
      return (
        <View>
          <Image
            source={{
              uri: `${apixURL}/static/uploads/chats/${attachment}`
            }}
            style={styles.imageStyle}
          />
        </View>
      )
    }
    else if (ext === 'mp4') {
      return (
        <View style={{
          flex: 1,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%'
        }}>
          <Video
            source={{
              uri: `${apixURL}/static/uploads/chats/${attachment}`
            }}
            style={styles.videoStyle}
            ref={videoRef}
            // onBuffer={onBuffer}
            // Callback when video cannot be loaded              
            // onError={onError} 
          />
        </View>
      )
    }
    else return (<View><Text>Attachment</Text></View>)
  }

  const rowStyle: ViewStyle = {
    flexDirection: isRightAlign ? 'row' : 'row-reverse',
  };

  return (
    <View style={[styles.container, rowStyle]}>
      <View
        style={
          isRightAlign
            ? styles.topContentContainer
            : styles.flipContentContainer
        }></View>
      <View
        style={
          isRightAlign
            ? [styles.topContentData, { backgroundColor: 'gray' }]
            : [styles.flipContentData, { backgroundColor: 'gray' }]
        }>
        {isDeleted ? (
          <View style={styles.dataContainer}>
            <Text>Message deleted...</Text>
            <Text>{deletedAt}</Text>
          </View>
        ) : (
          <View style={styles.dataContainer}>
            <View style={{ width: '99%' }}>
              <Text>{sender}</Text>
              <Paragraph style={[styles.messageTextStyle]}>{message}</Paragraph>
              {docSelect(attachment)}
              <Text>{timestamp}</Text>
            </View>
            <View style={{ width: '1%', alignItems: 'flex-end' }}>
              <Menu
                visible={isVisible}
                anchor={
                  <Appbar.Action
                    icon={'dots-vertical'}
                    onPress={toggleVisible}
                    color="white"
                  />
                }
                onDismiss={() => setIsVisible(false)}>
                <Menu.Item title="Delete" onPress={openDelete} />
              </Menu>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

