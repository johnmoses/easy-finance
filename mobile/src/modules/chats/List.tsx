import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SearchBox } from '@app/components/SearchBox';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveId, setActiveName, setBot, setPrivate } from '@app/store/slices/chat';
import { ChatItem } from '@app/components/ChatItem';
import { apixURL } from '@app/clients/utils';
import { useQuery } from '@app/offline';
import { Chat } from '@app/offline/schema/Chat';
import moment from 'moment';
import { AppContext } from '@app/contexts/AppContext';
import { SyncContext } from '@app/contexts/SyncContext';
import { RootState } from '@app/store';
import { IChat } from '@app/types/chat';
import { apixClient } from '@app/clients/axios';
import { useCreateModal } from '@app/hooks/useModal';
import { FAB } from 'react-native-paper';
import { styles } from '@app/styles';
import { Create } from './Create';

export const List = () => {
  const navigation = useNavigation<any>();
  const state = useSelector((state: RootState) => state.app);
  const { track } = useContext(AppContext);
  const { createModalOpen, toggleCreateModal } = useCreateModal();
  const dispatch = useDispatch();
  const { pullUserChats, markReadMessages } = useContext(SyncContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatData, setChatData] = useState<IChat[]>([]);
  const toggleCreate = () => {
    toggleCreateModal();
    getOnlineData();
    pullUserChats(30);
  };

  const offlineChats = useQuery(
    Chat,
    chats => {
      return chats;
    },
  );

  const goTo = (id: any, name: any, is_private: any, is_bot: any) => {
    dispatch(setActiveId(id));
    dispatch(setActiveName(name));
    dispatch(setPrivate(is_private));
    dispatch(setBot(is_bot))
    markReadMessages(id);
    navigation.navigate('ChatScreen', { id });
  };

  const handleSearch = (search: string) => {
    setSearchQuery(search);
    if (search !== '') {
      const transformedData = chatData.filter((item: any) => {
        return Object.values(item)
          .join('')
          .toLowerCase()
          .includes(search.toLocaleLowerCase())
      })
      setChatData(transformedData);
    }
    else {
      if (state.isOffline === false) {
        getOnlineData();
      } else {
        getOfflineData();
      }
    }
  };

  const getOnlineData = async () => {
    let data: any[] = []
    try {
      const res = apixClient.post('/user/chats', {
        user_id: state.authUserIdPk,
        name: '',
        last: 50,
      });
      if (res !== undefined) {
        const onlineChats = (await res).data;
        onlineChats.forEach((obj: any) => {
          data.push({
            id: obj.id,
            name: obj.name,
            description: obj.description,
            pic: obj.pic,
            pic1: obj.pic1,
            pic2: obj.pic2,
            isBot: obj.is_bot,
            isPrivate: obj.is_private,
            lastContent: obj.last_content,
            unreadMessages: obj.unread_messages,
            starterId: obj.starter_id,
            createdAt: obj.created_at,
            modifiedAt: obj.modified_at,
          })
        })
        // const transformedData = data.filter((item: any) => {
        //   return Object.values(item)
        //     .join('')
        //     .toLowerCase()
        //   .includes(searchQuery.toLocaleLowerCase())
        // })
        setChatData(data)
      }
    } catch (e: any) {
      track('Get online chats: ', e)
    }
  }

  const getOfflineData = () => {
    let data: any[] = [];
    try {
      if (offlineChats !== undefined) {
        offlineChats.forEach(obj => {
          data.push({
            id: obj.id,
            name: obj.name,
            description: obj.description,
            pic: obj.pic,
            pic1: obj.pic1,
            pic2: obj.pic2,
            lastContent: obj.lastContent,
            starterId: obj.starterId,
            createdAt: obj.createdAt,
            modifiedAt: obj.modifiedAt,
            isPrivate: obj.isPrivate,
            isSynced: obj.isSynced
          })
        })
        // const transformedData = data.filter((item: any) => {
        //   return Object.values(item)
        //     .join('')
        //     .toLowerCase()
        //   .includes(searchQuery.toLocaleLowerCase())
        // })
        setChatData(data)
      }
    } catch (e: any) {
      track('Get offline chats: ', e)
    }
  }


  useEffect(() => {
    if (state.isOffline === false) {
      getOnlineData();
      pullUserChats(30);
    } else {
      getOfflineData();
    }
  }, []);

  const imageSelect = (
    isPrivate: any,
    pic: any,
    pic1: any,
    pic2: any,
    starterId: any,
  ) => {
    if (isPrivate === false && pic) {
      return `${apixURL}/static/uploads/chats/${pic}`;
    } else if (isPrivate === true && starterId === state.authUserIdPk && pic2) {
      return `${apixURL}/static/uploads/chats/${pic2}`;
    } else if (isPrivate === true && starterId !== state.authUserIdPk && pic1) {
      return `${apixURL}/static/uploads/chats/${pic1}`;
    } else
      return `${apixURL}/static/uploads/chats/user.jpg`;
  };

  return (
    <>
      <ScrollView>
        <SearchBox placeholder='Search...' doSearch={handleSearch} />
        {chatData.map(chat => {
          return (
            <ChatItem
              key={chat.id}
              chatName={chat.name}
              lastContent={chat.lastContent}
              unread={chat.unreadMessages}
              modifiedAt={moment(chat.modifiedAt || chat.createdAt).format('lll')}
              userImageSource={{
                uri: imageSelect(
                  chat.isPrivate,
                  chat.pic,
                  chat.pic1,
                  chat.pic2,
                  chat.starterId,
                ),
              }}
              onChatPress={() => goTo(chat.id, chat.name, chat.isPrivate, chat.isBot)}
            />
          );
        })}
      </ScrollView>
      <Create open={createModalOpen} close={toggleCreate} />
      <FAB icon="plus" style={styles.fab} onPress={toggleCreateModal} />
    </>

  );
};
