import React, { createContext } from 'react';
import { useApolloClient } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery, useRealm } from '@app/offline';
import {
  UserSelectDocument,
  UserSelectQuery,
} from '@app/gql/schemas';
import { log } from '@app/utils/logs';
import { apiClient, apixClient } from '@app/clients/axios';
import { Analytic } from '@app/offline/schema/Analytic';
import { RootState } from '@app/store';
import moment from 'moment';
import base64 from 'react-native-base64';
import { Message } from '@app/offline/schema/Chat';
import { User } from '@app/offline/schema/User';
import { setUnreadMessages } from '@app/store/slices/chat';

interface ISyncContext {
  pullUser: (id: any) => void;
  pullUserChats: (last: number) => void;
  pullChatMessages: (chatId: any, last: number) => void;
  pushAnalytics: () => void;
  pushMessages: () => void;
  countUnreadMessages: () => void;
  markReadMessages: (chat_id: any) => void;
}

interface Props {
  children: JSX.Element;
}

const SyncContext = createContext<ISyncContext>({
  pullUser: () => { },
  pullUserChats: () => { },
  pullChatMessages: () => { },
  pushAnalytics: () => { },
  pushMessages: () => { },
  countUnreadMessages: () => { },
  markReadMessages: () => { },
});

const SyncContextProvider = ({ children }: Props) => {
  const client = useApolloClient();
  const state = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const realm = useRealm();

  const unsyncedUsers = useQuery<any>(User, users => {
    return users.filtered('isSynced==false && id==$0', state.authUserId);
  });

  const unsyncedAnalytics = useQuery<any>(Analytic, analytics => {
    return analytics.filtered('isSynced==false');
  });

  const unsyncedMessages = useQuery<any>(Message, messages => {
    return messages.filtered('isSynced==false');
  });

  // const currentDate = new Date();

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      if (state.authUserId) {
        pullUser(state.authUserId);
        pullUserChats(25);
        countUnreadMessages();
      }
    };
    bootstrapAsync();
  }, [state.authUserId, state.isOffline]);

  async function check() {
    if (state.authUserId && state.isOffline === false) {
      pushAnalytics();
      pushMessages();
      log('Pushed items!');
    }
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      check();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const pullUser = async (id: any) => {
    try {
      const res = await client.query<UserSelectQuery>({
        query: UserSelectDocument,
        variables: { id: id },
      });
      if (res) {
        const user = res.data.user;
        try {
          realm.write(() => {
            const codedId: any = user?.id;
            const decodedId = base64.decode(codedId);
            const [idType, id] = decodedId.split(':');
            realm.create(
              'User',
              {
                id: user?.id,
                pk: id,
                username: user?.username,
                firstName: user?.firstName,
                lastName: user?.lastName,
                mobile: user?.mobile,
                email: user?.email,
                avatar: user?.avatar,
                gender: user?.gender,
                bio: user?.bio,
                address: user?.address,
                birthDate: user?.birthDate,
                isBot: user?.isBot,
                isVerified: user?.isVerified,
                isUsed: user?.isUsed,
                isAdmin: user?.isAdmin,
                isStaff: user?.isStaff,
                isActive: user?.isActive,
                dateJoined: user?.dateJoined,
                isModified: user?.isModified,
                modifiedAt: user?.modifiedAt,
                isDeleted: user?.isDeleted,
                deletedAt: user?.deletedAt,
                isSynced: true,
              },
              true,
            );
          });
          log('Pulled user write: ' + user?.id);
        } catch (e) {
          log('Pull user write: ' + e);
        }
      }
    } catch (err) {
      log('Pull user: ' + err);
    }
  };

  const pullUserChats = async (last: number) => {
    try {
      const res = apixClient.post('/user/chats', {
        user_id: state.authUserIdPk,
        name: '',
        last: last,
      });
      if (res) {
        const chats = (await res).data;
        try {
          realm.write(() => {
            chats?.forEach((obj: any) => {
              realm.create(
                'Chat',
                {
                  id: obj.id.toString(),
                  name: obj.name,
                  description: obj.description,
                  pic: obj.pic,
                  pic1: obj.pic1,
                  pic2: obj.pic2,
                  isBot: obj.is_bot || false,
                  isPrivate: obj.is_private || true,
                  lastContent: obj.last_content,
                  unreadMessages: obj.unread_messages,
                  starterId: obj.starter.id.toString(),
                  createdAt: obj.created_at,
                  isModified: obj.is_modified || false,
                  modifiedAt: obj.modified_at,
                  isDeleted: obj.is_deleted || false,
                  deletedAt: obj.deleted_at,
                  restoredAt: obj.restored_at,
                  isSynced: true,
                },
                true,
              );
            });
          });
          log('Pulled Chats write: ' + chats?.length);
        } catch (e) {
          log('Pulled Chats write: ' + e);
        }
      }
    } catch (err) {
      log('Pulled Chats: ' + err);
    }
  };

  const pullChatMessages = async (chatId: any, last: number) => {
    try {
      const res = apixClient.post('/chat/messages', {
        chat_id: chatId,
        content: '',
        last: last,
      });
      if (res) {
        const messages = (await res).data;
        try {
          realm.write(() => {
            messages?.map((obj: any) => {
              realm.create(
                'Message',
                {
                  id: obj.idx || obj.id.toString(),
                  pk: obj.id.toString(),
                  content: obj.content,
                  attachment: obj.attachment,
                  chatId: obj.chat_id.toString(),
                  senderId: obj.sender_id.toString(),
                  senderUsername: obj.sender.username,
                  createdAt: obj.created_at,
                  isRead: obj.is_read || false,
                  readAt: obj.read_at,
                  isDeleted: obj.is_deleted || false,
                  deletedAt: obj.deleted_at,
                  restoredAt: obj.restored_at,
                  isSynced: true,
                },
                true,
              );
            });
          });
          log('Pulled messages write: ' + messages?.length);
        } catch (e) {
          log('Pulled messages write: ' + e);
        }
      }
    } catch (err) {
      log('Pulled messages: ' + err);
    }
  };

  const pushAnalytics = () => {
    let data: any[] = [];
    if (unsyncedAnalytics.length > 0) {
      unsyncedAnalytics.forEach(
        (obj: {
          anonymousId: string;
          userId: string;
          userTraits: string;
          path: string;
          url: string;
          channel: string;
          event: string;
          eventItems: string;
          createdAt: string;
        }) => {
          data.push({
            anonymous_id: obj.anonymousId,
            user_id: obj.userId,
            user_traits: obj.userTraits,
            path: obj.path,
            url: obj.url,
            channel: 'mobile',
            event: obj.event,
            event_items: obj.eventItems,
            created_at: obj.createdAt,
          });
        },
      );
      apiClient.post('/analytics/json/', data);
      log('Pushed analytics: ' + unsyncedAnalytics.length);
      try {
        realm.write(() => {
          for (const syncedData of unsyncedAnalytics) {
            syncedData.isSynced = true;
          }
        });
      } catch (e: any) {
        log('Push analytics: ' + e);
      }
    }
  };

  const pushMessages = async () => {
    let data: any[] = [];
    if (unsyncedMessages.length > 0) {
      unsyncedMessages.forEach(
        (obj: {
          id: any;
          pk: string;
          content: string;
          attachment: string;
          isRead: boolean;
          readAt: string;
          isDeleted: boolean;
          deletedAt: string;
          senderId: any;
          chatId: any;
        }) => {
          data.push({
            id: obj.pk,
            idx: obj.id,
            content: obj.content,
            attachment: obj.attachment,
            is_read: obj.isRead,
            read_at: obj.readAt,
            is_deleted: obj.isDeleted,
            deleted_at: obj.deletedAt,
            sender_id: obj.senderId,
            chat_id: obj.chatId,
          });
        },
      );
      apixClient.post('/message/upsert/', {
        data: data,
      });
      log('Pushed messages: ' + data.length);
      try {
        realm.write(() => {
          for (const syncedData of unsyncedMessages) {
            syncedData.isSynced = true;
          }
        });
      } catch (e) {
        log(e);
      }
    }
  };

  const countUnreadMessages = async () => {
    try {
      const res = apixClient.put('/unread/count', {
        sender_id: state.authUserIdPk
      });
      if (res) {
        const count = (await res).data
        dispatch(setUnreadMessages(count))
        log('Count Unread: ' + count);
      }
    } catch (e) {
      log('Count unread error:' + e);
    }
  };

  const markReadMessages = async (chat_id: any) => {
    try {
      const res = apixClient.put('/messages/read', {
        chat_id: chat_id,
      });
      if (res) {
        const reads = (await res).data
        log('Mark read message: ' + reads);
      }
    } catch (e) {
      log('Mark read message error:' + e);
    }
  };

  return (
    <SyncContext.Provider
      value={{
        pullUser,
        pullUserChats,
        pullChatMessages,
        pushAnalytics,
        pushMessages,
        countUnreadMessages,
        markReadMessages,
      }}>
      {children}
    </SyncContext.Provider>
  );
};

export { SyncContext, SyncContextProvider };
