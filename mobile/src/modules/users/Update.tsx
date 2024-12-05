import { PageLoading } from '@app/components/PageLoading';
import {
  UserSelectDocument,
  useUserSelectQuery,
  useUserUpdateMutation,
} from '@app/gql/schemas';
import { styles } from '@app/styles';
import React, { useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Paragraph,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

interface UpdateProps {
  id: any;
  last?: number;
  open: boolean;
  close: () => void;
}

export const Update: React.FC<UpdateProps> = props => {
  const theme = useTheme();
  const { loading, data, error } = useUserSelectQuery({
    variables: {
      id: props.id,
    },
  });
  const [firstName, setFirstName] = useState<any>(data?.user?.firstName);
  const [lastName, setLastName] = useState<any>(data?.user?.lastName);
  const [gender, setGender] = useState<any>(data?.user?.gender);
  const [bio, setBio] = useState<any>(data?.user?.bio);
  const [address, setAddress] = useState<any>(data?.user?.address);
  const [message, setMessage] = useState('');
  const [userUpdate] = useUserUpdateMutation();

  const init = () => {
    setFirstName(data?.user?.firstName);
    setLastName(data?.user?.lastName);
    setGender(data?.user?.gender);
    setBio(data?.user?.bio);
    setAddress(data?.user?.address);
  };

  React.useEffect(() => {
    init();
  }, [props.open]);

  const handleUpdate = () => {
    userUpdate({
      variables: {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        bio: bio,
        address: address,
      },
      refetchQueries: [
        {
          query: UserSelectDocument,
          variables: {
            id: props.id,
          },
        },
      ],
    })
      .then(() => {
        setFirstName('');
        setLastName('');
        setGender("");
        setBio("");
        setAddress("");
        setMessage('');
        props.close();
      })
      .catch(() => {
        setMessage('Cannot add content this time!');
      });
  };

  if (loading) {
    return (
      <PageLoading>
        <ActivityIndicator animating={true} />
      </PageLoading>
    );
  }

  if (error) {
    return (
      <PageLoading>
        <Paragraph>No items</Paragraph>
      </PageLoading>
    );
  }

  return (
    <Modal visible={props.open} animationType="slide">
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Button onPress={props.close}>Cancel</Button>
            <Button onPress={handleUpdate}>Ok</Button>
          </View>
          <Text>{message}</Text>
          <TextInput
            value={firstName}
            label="First Name"
            autoCapitalize="none"
            multiline={true}
            mode='outlined'
            style={styles.wideInput}
            onChangeText={firstName => {
              setFirstName(firstName);
            }}
          />
          <TextInput
            value={lastName}
            label="Last Name"
            autoCapitalize="none"
            multiline={true}
            mode='outlined'
            style={styles.wideInput}
            onChangeText={lastName => {
              setLastName(lastName);
            }}
          />
          <TextInput
            value={gender}
            label="Gender"
            autoCapitalize="none"
            multiline={true}
            mode='outlined'
            style={styles.wideInput}
            onChangeText={gender => {
              setGender(gender);
            }}
          />
          <TextInput
            value={bio}
            label="Bio Data"
            autoCapitalize="none"
            multiline={true}
            mode='outlined'
            style={styles.wideInput}
            onChangeText={bio => {
              setBio(bio);
            }}
          />
          <TextInput
            value={address}
            label="Address"
            autoCapitalize="none"
            multiline={true}
            mode='outlined'
            style={styles.wideInput}
            onChangeText={address => {
              setAddress(address);
            }}
          />
        </View>
      </ScrollView>
    </Modal>
  );
};
