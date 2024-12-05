import React, { useContext } from 'react';
import { Alert } from 'react-native';
import { IconButton } from 'react-native-paper';
import { socket } from '@app/clients/socket';
import { AppContext } from '@app/contexts/AppContext';

interface IProps {
  chat_id: any;
  user_id: any;
  close: () => void;
}

export const RemoveParticipant: React.FC<IProps> = props => {
  const { track } = useContext(AppContext);

  const handleParticipantRemove = () => {
    socket.emit('leave chat', {
      chat_id: props.chat_id,
      user_id: props.user_id,
    });
    track('User left: ', props.user_id);
    props.close();
  };

  const onRemove = () => {
    Alert.alert(
      'Delete',
      'Do you really want to remove this user?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Remove',
          onPress: () => {
            handleParticipantRemove();
          },
        },
      ],
      { cancelable: true },
    );
  };

  // React.useEffect(() => {
  //   socket.on('announce chat', () => {
  //     try {
  //       pullUserChats(50);
  //     } catch (e: any) {
  //       track('no announcement: ', e)
  //     }
  //   });
  // }, [props.close]);

  return (
    <>
      <>
        <IconButton
          icon="delete-outline"
          size={20}
          onPress={() => onRemove()}
        />
      </>
    </>
  );
};
