import { styles } from '@app/styles';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface DeleteProps {
  id: any;
  open: boolean;
  close: () => void;
}

export const Delete: React.FC<DeleteProps> = props => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  // const [chatDelete] = useChatDeleteMutation();
  const handleDelete = () => {
    // chatDelete({
    //   variables: { id: props.id},
    //   refetchQueries: [{
    //     query: ChatListDocument,
    //     variables: {
    //       last: props.last,
    //       isDeleted: false
    //     }
    //   }]
    // })
    // .then(() => {
    //   setMessage('Deleted an item');
    // })
    // .catch(() => {
    //   setMessage('');
    // })
  };

  const onDelete = () => {
    Alert.alert(
      'Delete',
      'Do you really want to delete this?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            return null;
          },
        },
        {
          text: 'Delete',
          onPress: () => {
            handleDelete();
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <>
      <Modal visible={props.open} animationType="slide">
        <ScrollView style={{ backgroundColor: theme.colors.background }}>
          <View style={styles.container}>
            <View style={styles.topContainer}>
              <Button style={{ height: 48}} onPress={props.close}>Cancel</Button>
              <Button style={{ height: 48}} onPress={onDelete}>Ok</Button>
            </View>
            <View style={styles.dataContainer}>
              <Text>Deleting all chats...</Text>
            </View>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
};
