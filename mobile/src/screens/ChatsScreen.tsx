import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Appbar, Button, FAB, Modal, Portal, Text, TextInput, Title, Badge } from 'react-native-paper';
import { chatAPI } from '../services/api';
import { ChatRoom } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type ChatsScreenNavigationProp = StackNavigationProp<any, 'Chat'>;

const ChatsScreen = () => {
  const navigation = useNavigation<ChatsScreenNavigationProp>();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');
  const [newChatDescription, setNewChatDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await chatAPI.getRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      Alert.alert('Error', 'Failed to load rooms');
    }
  };

  const joinRoom = (room: ChatRoom) => {
    navigation.navigate('Chat', { room });
  };

  const createRoom = async () => {
    if (!newChatTitle.trim()) {
      Alert.alert('Validation Error', 'Title is required.');
      return;
    }
    try {
      setIsCreating(true);
      const newRoom = await chatAPI.createRoom(newChatTitle, newChatDescription);
      setRooms(prevRooms => [...prevRooms, newRoom]);
      setModalVisible(false);
      setNewChatTitle('');
      setNewChatDescription('');
    } catch (error) {
      console.error('Failed to create room:', error);
      Alert.alert('Error', 'Failed to create the new room.');
    } finally {
      setIsCreating(false);
    }
  };

  const renderRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity onPress={() => joinRoom(item)}>
      <View style={styles.roomItem}>
        <View style={styles.roomInfo}>
          <Text style={styles.roomName}>{item.name}</Text>
          {item.last_message && (
            <Text style={styles.lastMessage}>{item.last_message.content}</Text>
          )}
        </View>
        <View style={styles.roomRight}>
          {item.last_message && (
            <Text style={styles.lastMessageDate}>{
              new Date(item.last_message.timestamp).toLocaleTimeString()
            }</Text>
          )}
          <Badge style={styles.badge}>3</Badge>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Chat Rooms" />
      </Appbar.Header>
      <FlatList
        data={rooms}
        renderItem={renderRoom}
        keyExtractor={item => item.id.toString()}
        style={styles.roomsList}
      />
      <FAB icon="plus" style={styles.fab} onPress={() => setModalVisible(true)} />

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Title>Create New Chat</Title>
          <TextInput
            label="Title"
            value={newChatTitle}
            onChangeText={setNewChatTitle}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Description (Optional)"
            value={newChatDescription}
            onChangeText={setNewChatDescription}
            mode="outlined"
            style={styles.input}
            multiline
            numberOfLines={3}
          />
          <Button
            mode="contained"
            onPress={createRoom}
            loading={isCreating}
            disabled={isCreating}
            style={styles.button}
          >
            Create
          </Button>
          <Button
            onPress={() => setModalVisible(false)}
            disabled={isCreating}
            style={styles.button}
          >
            Cancel
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  roomsList: {
    padding: 16,
  },
  roomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  roomRight: {
    alignItems: 'flex-end',
  },
  lastMessageDate: {
    fontSize: 12,
    color: '#999',
  },
  badge: {
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});

export default ChatsScreen;