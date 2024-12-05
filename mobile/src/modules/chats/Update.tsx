import { AppContext } from '@app/contexts/AppContext';
import { styles } from '@app/styles';
import React, { useContext, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { socket } from '@app/clients/socket';
import { apixClient } from '@app/clients/axios';

interface UpdateProps {
  id: any;
  open: boolean;
  close: () => void;
}

export const Update: React.FC<UpdateProps> = props => {
  const theme = useTheme();
  const { track } = useContext(AppContext);
  const [chat, setChat] = useState<any>('');
  const [name, setName] = useState<string>(chat.name);
  const [description, setDescription] = useState<string>(chat.description);
  const [message, setMessage] = useState('');

  const getChat = async () => {
    apixClient
      .get(`/chat/${props.id}`)
      .then(response => {
        setChat(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
      })
      .catch(e => {
        track('no data', e);
      });
  };

  React.useEffect(() => {
    getChat();
  }, []);

  const validateEntries = () => {
    if (name === undefined) {
      return true;
    }
    return false;
  };

  const handleUpdate = () => {
    socket.emit('update chat', {
      id: props.id,
      name: name,
      description: description,
    });
    track('Updated chat', name);
    props.close();
  };

  return (
    <Modal visible={props.open} animationType="slide">
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Button style={{ height: 48 }} onPress={props.close}>Cancel</Button>
            <Button style={{ height: 48 }} onPress={handleUpdate} disabled={validateEntries()}>
              Ok
            </Button>
          </View>
          <Text>{message}</Text>
          <View style={styles.titleContainer}>
            <Text>Update Chat</Text>
          </View>
          <TextInput
            value={name}
            label={'Name'}
            mode='outlined'
            autoCapitalize="none"
            autoFocus={true}
            multiline={true}
            style={styles.wideInput}
            onChangeText={name => {
              setName(name);
            }}
          />
          <TextInput
            value={description}
            label={'Description'}
            mode='outlined'
            autoCapitalize="none"
            multiline={true}
            style={styles.wideInput}
            onChangeText={description => {
              setDescription(description);
            }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};
