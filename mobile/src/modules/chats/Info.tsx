import { useObject } from '@app/offline';
import { Chat } from '@app/offline/schema/Chat';
import { RootState } from '@app/store';
import React, { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Update } from './Update';
import { Delete } from './Delete';
import {
  useAddParticipantModal,
  useDeleteModal,
  useRemoveParticipantModal,
  useUpdateModal,
  useUpdatePicModal,
} from '@app/hooks/useModal';
import { apixClient } from '@app/clients/axios';
import { log } from '@app/utils/logs';
import { RemoveParticipant } from './RemoveParticipant';
import { styles } from '@app/styles/chat';
import { AddParticipants } from './AddParticipants';
import { UpdatePic } from './UpdatePic';
import { AppContext } from '@app/contexts/AppContext';

export const Info = () => {
  const { track } = useContext(AppContext);
  const state = useSelector((state: RootState) => state.app);
  const theme = useTheme();
  const chatState = useSelector((state: RootState) => state.chat);
  const [chatData, setChatData] = useState<any>('');
  const [participantsData, setParticipantsData] = useState<any[]>([]);
  const { updateModalOpen, toggleUpdateModal } = useUpdateModal();
  const { updatePicModalOpen, toggleUpdatePicModal } = useUpdatePicModal();
  const { deleteModalOpen, toggleDeleteModal } = useDeleteModal();
  const { addParticipantModalOpen, toggleAddParticipantModal } =
    useAddParticipantModal();
  const { removeParticipantModalOpen, toggleRemoveParticipantModal } =
    useRemoveParticipantModal();
  const toggleUpdate = () => toggleUpdateModal();
  const toggleUpdatePic = () => toggleUpdatePicModal();
  const toggleDelete = () => toggleDeleteModal();
  const toggleAddParticipant = () => {
    toggleAddParticipantModal();
    getOnlineData();
  };
  const toggleRemoveParticipant = () => {
    toggleRemoveParticipantModal();
    getOnlineData();
  };

  const offlineChat = useObject(Chat, chatState.activeId.toString());
  
  const getOnlineData = async () => {
    apixClient
      .get(`/chat/${chatState.activeId}`)
      .then(response => {
        setChatData(response.data);
        setParticipantsData(response.data.participants);
      })
      .catch(e => {
        log('no data'+ e);
      track('Online chat info: ', e)
      });
  };

  const getOfflineData = () => {
    let participants: any[] = [];
    try {
      if (offlineChat !== undefined) {
        offlineChat?.participants?.forEach(obj => {
          participants.push({
            id: obj.id,
            username: obj.username
          })
        })
        setChatData({name: offlineChat?.name, description: offlineChat?.description})
        setParticipantsData(participants);
      }
    } catch (e: any) {
      track('Offline Chat Info: ', e)
    }
  }

  React.useEffect(() => {
    if (state.isOffline === false) {
      getOnlineData();
    } else {
      getOfflineData();
    }
  }, []);

  return (
    <>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <Card>
          <Card.Title title={chatData?.name} />
          <Card.Content>
            <Text>Description: {chatData?.description}</Text>
            <Text>Messages: {chatData?.messages?.length}</Text>
          </Card.Content>
        </Card>
        <Button
          onPress={() => toggleUpdate()}
          disabled={state.isOffline == true}>
          Update Chat
        </Button>
        <Button
          onPress={() => toggleUpdatePic()}
          disabled={state.isOffline == true}>
          Update Chat Picture
        </Button>
        <Text>Participants</Text>
        <View style={styles.dataContainer}>
          {participantsData.map((participant: any) => (
            <View key={participant.id}>
              <View style={styles.menu}>
                <Text>{participant.username}</Text>
                <RemoveParticipant
                  user_id={participant.id}
                  chat_id={chatData.activeId}
                  close={toggleRemoveParticipant}
                />
              </View>
            </View>
          ))}
        </View>
        <Button
          onPress={() => toggleAddParticipant()}
          disabled={state.isOffline == true}>
          Add Participant
        </Button>
        <Button
          onPress={() => toggleDelete()}
          disabled={state.isOffline == true}>
          Exit Chat
        </Button>
      </ScrollView>
      {state.isOffline === false && (
        <>
          <AddParticipants
            id={offlineChat?.id}
            open={addParticipantModalOpen}
            close={toggleAddParticipant}
          />
          <Update
            id={offlineChat?.id}
            open={updateModalOpen}
            close={toggleUpdate}
          />
          <UpdatePic
            id={offlineChat?.id}
            open={updatePicModalOpen}
            close={toggleUpdatePic}
          />
          <Delete
            id={offlineChat?.id}
            open={deleteModalOpen}
            close={toggleDelete}
          />
        </>
      )}
    </>
  );
};
