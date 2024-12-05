import { ChatInput } from '@app/components/ChatInput';
import { ChatMessage } from '@app/components/ChatMessage';
import { socket } from '@app/clients/socket';
import { RootState } from '@app/store';
import React, { useContext, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useQuery, useRealm } from '@app/offline';
import { Message } from '@app/offline/schema/Chat';
import { SyncContext } from '@app/contexts/SyncContext';
import { generateId } from '@app/offline';
import { AppContext } from '@app/contexts/AppContext';
import moment from 'moment';
import { IMessage } from '@app/types/message';
import { apixClient } from '@app/clients/axios';

export const Show = () => {
  const { track } = useContext(AppContext);
  const theme = useTheme();
  const realm = useRealm();
  const state = useSelector((state: RootState) => state.app);
  const chatState = useSelector((state: RootState) => state.chat);
  const scrollViewRef = useRef<any>(null);
  const [messageData, setMessageData] = useState<IMessage[]>([]);

  const offlineMessages = useQuery(Message, messages => {
    return messages.filtered('chatId==$0',chatState.activeId.toString()) || [];
  });
  const { pullUserChats, pullChatMessages, countUnreadMessages } = useContext(SyncContext);

  const getOnlineData = async () => {
    let data: any[] = []
    try {
      const res = apixClient.post('/chat/messages', {
        chat_id: chatState.activeId,
        content: '',
        last: 50,
      });
      if (res !== undefined) {
        const onlineMessages = (await res).data;
        onlineMessages.forEach((obj: any) => {
          data.push({
            id: obj.id,
            content: obj.content,
            attachment: obj.attachment,
            chatId: obj.chat_id,
            senderId: obj.sender_id,
            senderUsername: obj.sender_username,
            createdAt: obj.created_at,
            isDeleted: obj.is_deleted,
            deletedAt: obj.deleted_at,
          })
        })
        setMessageData(data)
      }
    } catch (e: any) { 
      track('Online chats: ', e)
    }
  }

  const getOfflineData = () => {
    let data: any[] = [];
    try {
      if (offlineMessages !== undefined) {
        offlineMessages.forEach(obj => {
          data.push({
            id: obj.id,
            content: obj.content,
            attachment: obj.attachment,
            chatId: obj.chatId,
            senderId: obj.senderId,
            senderUsername: obj.senderUsername,
            createdAt: obj.createdAt,
            isDeleted: obj.isDeleted,
            deletedAt: obj.deletedAt,
          })
        })
        setMessageData(data)
      }
    } catch (e: any) {
      track('Listed offline chats: ', e)
    }
  }

  const handleCreateMessage = (content: string, attachment: string) => {
    if (state.isOffline === false) {
      socket.emit('send message', {
        content: content,
        attachment: attachment,
        chat_id: chatState.activeId,
        sender_id: state.authUserIdPk,
        is_private: chatState.isPrivate,
        is_bot: chatState.isBot,
      });
      track('Created message online!: ', content);
    } else {
      try {
        realm.write(() => {
          realm.create('Message', {
            id: generateId(state.authUserIdPk).toString(),
            content: content,
            attachment: attachment,
            chatId: chatState.activeId,
            senderId: state.authUserIdPk,
          });
          track('Created message offline: ', chatState.activeId as string);
        });
      } catch (e: any) {
        track('Creating message not successfull', e);
      }
    }
  };

  const handleDeleteMessage = (id: any) => {
    if (state.isOffline === false) {
      socket.emit('delete message', {
        id: id,
      });
      track('Deleted message online: ', id);
    } 
  };

  React.useEffect(() => {
    if (state.isOffline === false) {
      pullChatMessages(chatState.activeId, 25);
      getOnlineData();
    } else {
      getOfflineData();
    }
    socket.on('announce message', () => {
        pullChatMessages(chatState.activeId, 25);
        getOnlineData();
    });
    return () => {
      if (state.isOffline === false) {
        pullUserChats(30);
        countUnreadMessages();
      }
    };
  }, []);

  // const imageSelect = (
  //   isPrivate: any,
  //   pic: any,
  //   pic1: any,
  //   pic2: any,
  //   starterId: any,
  // ) => {
  //   if (isPrivate === false && pic) {
  //     return `${apixURL}/static/uploads/chats/${pic}`;
  //   } else if (isPrivate === true && starterId === state.authUserIdPk && pic2) {
  //     return `${apixURL}/static/uploads/chats/${pic2}`;
  //   } else if (isPrivate === true && starterId !== state.authUserIdPk && pic1) {
  //     return `${apixURL}/static/uploads/chats/${pic1}`;
  //   } else return `${apixURL}/static/uploads/chats/user.jpg`;
  // };

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      >
        {messageData.map((message, index) => {
          return (
            <View key={message.id}>
              <ChatMessage
                sender={message.senderUsername}
                message={message.content}
                attachment={message.attachment}
                timestamp={moment(message.createdAt).format('lll')}
                isRightAlign={message.senderId !== state.authUserIdPk}
                isDeleted={message.isDeleted}
                deletedAt={message.deletedAt}
                deleteMessage={() => handleDeleteMessage(message.id)}
              />
            </View>
          );
        })}
      </ScrollView>
      <ChatInput
        onSendPress={handleCreateMessage}
        color={theme.colors.primary}
      />
    </>
  );
};
