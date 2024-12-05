import { AppContext } from '@app/contexts/AppContext';
import { useUserDeleteMutation } from '@app/gql/schemas';
import { styles } from '@app/styles';
import React, { useContext } from 'react';
import { Alert, Modal, ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface DeleteProps {
  id: any;
  open: boolean;
  close: () => void;
}

export const Delete: React.FC<DeleteProps> = props => {
  const theme = useTheme();
  const { track } = useContext(AppContext);
  const [userDelete] = useUserDeleteMutation();

  const handleDelete = () => {
    userDelete({
      variables: { id: props.id, isDeleted: true },
    })
      .then(() => {
        track('Delete user online: ', `${props?.id}`);
        props.close();
      })
      .catch(e => {
        console.log(e);
      });
  };

  const onDelete = () => {
    Alert.alert(
      'Delete',
      'Do you really want to close this account?',
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
    <Modal visible={props.open} animationType="slide">
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Button onPress={props.close}>Cancel</Button>
            <Button onPress={onDelete}>Ok</Button>
          </View>
          <View style={styles.dataContainer}>
            <Text>Closing this account...</Text>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};
