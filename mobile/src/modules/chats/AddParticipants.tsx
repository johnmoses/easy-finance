import { apixClient } from '@app/clients/axios';
import React, { useContext, useState } from 'react';
import { Button, Text, useTheme } from 'react-native-paper';
import { Modal, ScrollView, View } from 'react-native';
import { styles } from '@app/styles/chat';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { AppContext } from '@app/contexts/AppContext';
import { socket } from '@app/clients/socket';

interface IProps {
  id: any;
  open: boolean;
  close: () => void;
}

export const AddParticipants = ({ id, open, close }: IProps) => {
  const theme = useTheme();
  const { track } = useContext(AppContext);
  const [userData, setUserData] = React.useState([]);
  const [userids, setUserids] = useState('');
  const [selected, setSelected] = useState<[]>([]);

  const getUserData = async () => {
    apixClient
      .get(`/user`)
      .then(response => {
        let users = response.data.map((item: any) => {
          return { key: item.id, value: item.username };
        });
        setUserData(users);
      })
      .catch(e => {
        track('no data', e);
      });
  };

  React.useEffect(() => {
    getUserData();
    handleUserIds();
  }, [selected, open]);

  const handleUserIds = () => {
    setUserids(selected.toString());
  };

  const handleAddParticipant = async () => {
    socket.emit('join chat', {
      chat_id: id,
      user_ids: userids,
    });
    track('Create chat participant', `Ids: ${userids} `);
    close();
  };

  const handleCancel = () => {
    setSelected([]);
    close();
  };

  return (
    <Modal visible={open} animationType="slide">
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container1}>
          <View style={styles.topContainer}>
            <Button style={{ height: 48}} onPress={handleCancel}>Cancel</Button>
            <Button style={{ height: 48}} onPress={handleAddParticipant}>Ok</Button>
          </View>
          <View style={styles.titleContainer}>
            <Text>Add Participants</Text>
          </View>
          <MultipleSelectList
            setSelected={(val: any) => setSelected(val)}
            data={userData}
            save="key"
            inputStyles={{ color: theme.colors.primary }}
            dropdownTextStyles={{ color: theme.colors.primary }}
            defaultOption={{
              key: 'Q291bnRpbmdUeXBlOjE=',
              value: 'Select User',
            }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};
