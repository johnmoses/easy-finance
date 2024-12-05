import { AppContext } from '@app/contexts/AppContext';
import { styles } from '@app/styles';
import React, { useContext, useState } from 'react';
import { Modal, ScrollView, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { apixClient } from '@app/clients/axios';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';

interface UpdatePicProps {
  id: any;
  open: boolean;
  close: () => void;
}

export const UpdatePic: React.FC<UpdatePicProps> = props => {
  const state = useSelector((state: RootState) => state.app);
  const theme = useTheme();
  const { track } = useContext(AppContext);
  const [chat, setChat] = useState<any>('');
  const [pic, setPic] = useState<string>(chat.pic);
  const [file, setFile] = useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >();
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');

  const getChat = async () => {
    apixClient
      .get(`/chat/${props.id}`)
      .then(response => {
        setChat(response.data);
        setPic(response.data.pic);
      })
      .catch(e => {
        track('no data', e);
      });
  };

  React.useEffect(() => {
    getChat();
  }, []);


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

  const handleUpdatePic = async () => {
    if (file && state.isOffline === false) {
      apixClient
        .put("/chatpic", {
          user_id: state.authUserIdPk,
          id: props.id,
          pic: pic,
        })
        .then((response) => {
          if (response.status === 200) {
            track("Changed chat pic", `Ids: ${pic} `);
          } else {
            track("Change not successful", response.statusText);
          }
        })
        .catch((e: any) => {
          track("Change not successful", e);
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
        setPic(fileName);
        track('Uploaded file: ', fileName);
      } catch (e: any) {
        track('Could not upload file: ', e);
      }
    }
  };

  return (
    <Modal visible={props.open} animationType="slide">
      <ScrollView style={{ backgroundColor: theme.colors.background }}>
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Button style={{ height: 48}} onPress={props.close}>Cancel</Button>
            <Button style={{ height: 48}} onPress={handleUpdatePic} disabled={!file}>
              Ok
            </Button>
          </View>
          <View style={styles.titleContainer}>
            <Text>Update Chat Picture</Text>
          </View>
          <Text>{message}</Text>
          <Button onPress={() => handleFileChange()}>Select Picture</Button>
        </View>
      </ScrollView>
    </Modal>
  );
};
