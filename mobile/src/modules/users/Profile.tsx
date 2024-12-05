import { setTheme, setUserAvatar } from '@app/store/slices/app';
import React, { useContext, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Switch,
  Text,
  TouchableRipple,
  useTheme,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { useAvatarUpdateMutation, useMeQueryQuery } from '@app/gql/schemas';
import { apixURL } from '@app/clients/utils';
import { RootState } from '@app/store';
import { Update } from './Update';
import { useDeleteModal, useUpdateModal } from '@app/hooks/useModal';
import { Delete } from './Delete';
import { AppContext } from '@app/contexts/AppContext';
import { apixClient } from '@app/clients/axios';

export const Profile = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.app);
  const theme = useTheme();
  const { track } = useContext(AppContext);
  const { dark } = theme;
  const { data } = useMeQueryQuery();
  const [file, setFile] = useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >();
  const [fileName, setFileName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [avatarUpdate] = useAvatarUpdateMutation();
  const { updateModalOpen, toggleUpdateModal } = useUpdateModal();
  const { deleteModalOpen, toggleDeleteModal } = useDeleteModal();

  const toggleUpdate = () => toggleUpdateModal();
  const toggleDelete = () => toggleDeleteModal();

  const toggleTheme = (isDark: boolean) => {
    let themeType = 'dark';
    if (isDark) {
      themeType = 'light';
    }
    dispatch(setTheme(themeType));
  };

  React.useEffect(() => {
    setDisabled(state.isOffline);
  }, [state.isOffline]);

  const handleFileChange = async () => {
    try {
      const selectedFile = DocumentPicker.pickSingle({
        type: [types.images, types.video],
      });
      if (selectedFile) {
        setFile(await selectedFile);
        const fname = (await selectedFile).name;
        const userid = state.authUserIdPk as string;
        const utime = Math.floor(Date.now() / 1000).toString();
        if (fname) {
          const fext = fname.split('.').pop();
          const filename = userid + utime + '.' + fext;
          setFileName(filename);
          // console.log('selected file: ', filename);
        }
      }
    } catch (err) {
      track('File selection canceled: ', `${err}`);
      // console.log('Error selecting file', err);
    }
  };

  const handleUpdateAatar = async () => {
    if (file) {
      avatarUpdate({
        variables: {
          avatar: avatar,
        },
      }).then(() => {
        dispatch(setUserAvatar(avatar));
        setAvatar('');
        track('Updated user avatar', `Avatar: ${avatar}`);
      });
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', fileName);
        formData.append('destination', 'testimonies');
        // formData.append('userid', state.authUserIdPk);

        const response = await apixClient.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
        });
        setAvatar(fileName);
        track('Uploaded avatar: ', fileName);
      } catch (e: any) {
        track('Could not upload avatar: ', e);
      }
    }
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <Avatar.Image
          source={{
            uri: state.authUserAvatar
              ? `${apixURL}/static/uploads/users/${state.authUserAvatar}`
              : `${apixURL}/static/uploads/users/user.jpg`,
          }}
          size={100}
        />
        <Card>
          <Card.Title title={data?.me?.username} />
          <Card.Content>
            <Text>Email: {data?.me?.email}</Text>
            <Text>First Name: {data?.me?.firstName}</Text>
            <Text>Mobile Number: {data?.me?.mobile}</Text>
            <Text>First Name: {data?.me?.firstName}</Text>
            <Text>Last Name: {data?.me?.lastName}</Text>
            <Text>Gender: {data?.me?.gender}</Text>
            <Text>Bio data: {data?.me?.bio}</Text>
            <Text>Address: {data?.me?.address}</Text>
          </Card.Content>
        </Card>
        <Text>Theme</Text>
        <TouchableRipple onPress={() => toggleTheme(dark)}>
          <View>
            <Text>Dark Theme</Text>
            <View pointerEvents="none">
              <Switch value={dark} />
            </View>
          </View>
        </TouchableRipple>
        <Button onPress={() => handleFileChange()}>Select Photo</Button>
        <Button onPress={() => handleUpdateAatar()} disabled={!file}>
          Update Photo
        </Button>
        <Button onPress={() => toggleUpdate()} disabled={disabled}>
          Update User Profile
        </Button>
        <Button onPress={() => toggleDelete()} disabled={disabled}>
          Close Account
        </Button>
      </ScrollView>

      {state.isOffline === false && (
        <>
          <Update
            id={data?.me?.id}
            open={updateModalOpen}
            close={toggleUpdate}
          />
          <Delete
            id={data?.me?.id}
            open={deleteModalOpen}
            close={toggleDelete}
          />
        </>
      )}
    </>
  );
};
