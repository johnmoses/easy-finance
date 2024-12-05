import { apixClient } from '@app/clients/axios';
import { socket } from '@app/clients/socket';
import { AppContext } from '@app/contexts/AppContext';
import { SyncContext } from '@app/contexts/SyncContext';
import { RootState } from '@app/store';
import { styles } from '@app/styles';
import React, { useContext, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

interface CreateProps {
  last?: number;
  open: boolean;
  close: () => void;
}

export const Create: React.FC<CreateProps> = props => {
  const theme = useTheme();
  const { track } = useContext(AppContext);
  const state = useSelector((state: RootState) => state.app);
  const [userData, setUserData] = React.useState([]);
  const [name, setName] = useState('');
  const [userids, setUserids] = useState('');
  const [selected, setSelected] = useState('');
  const { pullUserChats, countUnreadMessages } = useContext(SyncContext);

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
    socket.on('announce chat', () => {
      try {
        pullUserChats(50);
        countUnreadMessages();
      } catch (e: any) {
        track('no announcement: ', e)
      }
    });
  }, [selected]);

  const handleUserIds = () => {
    setUserids(selected.toString());
  };

  const handleCancel = () => {
    setName('');
    setSelected('');
    props.close();
  };

  const handleCreateChat = () => {
    socket.emit('start chat', {
      name: name,
      starter_id: state.authUserIdPk,
      user_ids: userids,
    });
    track('Create chat online: ', name);
    handleCancel();
  };

  const validateEntries = () => {
    if (name === '' || userids === '') {
      return true;
    }
    return false;
  };

  return (
    <Modal visible={props.open}>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Button style={{ height: 48}} onPress={handleCancel}>Cancel</Button>
            <Button style={{ height: 48}} onPress={handleCreateChat} disabled={validateEntries()}>
              Ok
            </Button>
          </View>
          <View style={styles.titleContainer}>
            <Text>Start new chat</Text>
          </View>
          <TextInput
            value={name} 
            label={'Name'}
            mode='outlined'
            autoCapitalize="none"
            multiline={true}
            autoFocus={true}
            style={styles.wideInput}
            onChangeText={name => {
              setName(name);
            }}
          />
          <MultipleSelectList
            setSelected={(val: any) => setSelected(val)}
            onSelect={() => handleUserIds}
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
