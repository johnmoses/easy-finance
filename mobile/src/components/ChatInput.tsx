import { styles } from '@app/styles/chat';
import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { AppContext } from '@app/contexts/AppContext';
import { apixClient } from '@app/clients/axios';

interface IProps {
  color?: any;
  onSendPress: (content: string, attachment: string) => void;
}
let keyboardAvoidingViewProps: KeyboardAvoidingViewProps = {};

export const ChatInput = ({ color, onSendPress }: IProps) => {
  const state = useSelector((state: RootState) => state.app);
  const chatState = useSelector((state: RootState) => state.chat);
  const { track } = useContext(AppContext);
  const [file, setFile] = useState<
    Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null
  >();
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [attachment, setAttachment] = useState('');

  const getAttachment = async () => {
    try {
      const selectedFile = DocumentPicker.pickSingle({
        type: [types.images, types.video],
      });
      if (selectedFile) {
        setFile(await selectedFile);
        const fname = (await selectedFile).name;
        const fsize = (await selectedFile).size;
        const userid = state.authUserIdPk as string;
        const utime = Math.floor(Date.now() / 1000).toString();
        if (fname && fsize && fsize <= 2100000) {
          const fext = fname.split('.').pop();
          const filename = userid + utime + '.' + fext;
          setFileName(filename);
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', fileName);
            formData.append('destination', 'chats');
    
            const response = await apixClient.post('/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              responseType: 'blob',
            });
            setAttachment(fileName);
            setContent(filename)
            track('Uploaded file: ', fileName);
          } catch (e: any) {
            track('Could not upload file: ', e);
          }
          // console.log('uploaded file: ', filename + ' size: ' + fsize);
        }
      }
    } catch (err: any) {
      track('File not uploaded: ', err);
      // console.log('Error selecting file', err);
    }
  };

  return (
    <KeyboardAvoidingView {...keyboardAvoidingViewProps} enabled>
      <View style={styles.inputContainer}>
        <View>
          <Icon onPress={getAttachment} name="plus" size={30} color={color} />
        </View>
        <View style={styles.textContainer1}>
          <TextInput
            value={content}
            label={'Type here...'}
            mode='outlined'
            multiline={true}
            numberOfLines={2}
            returnKeyType="next"
            onChangeText={content => setContent(content)}
          />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              onSendPress(content, attachment);
              setContent('');
              setAttachment('');
            }}>
            <Icon name="send" size={30} color={color} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};


