import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, Paragraph, Appbar, Avatar, Text } from 'react-native-paper';
import { chatAPI } from '../services/api';
import { ChatMessage } from '../types';
import { useNavigation } from '@react-navigation/native';

const ChatScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const { room } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // This state is not used in the provided code
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages(room.id);
  }, [room]);

  const loadMessages = async (roomId: number) => {
    try {
      const data = await chatAPI.getMessages(roomId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    setIsTyping(true);
    try {
      const response = await chatAPI.sendMessage(room.id, newMessage, 'user');
      setMessages(response.conversation);
      setNewMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[styles.messageContainer, item.role === 'user' ? styles.userMessageContainer : styles.botMessageContainer]}>
      {item.role !== 'user' && <Avatar.Icon size={40} icon="robot" />}
      <Card
        style={[styles.messageCard, item.role === 'user' ? styles.userMessage : styles.botMessage]}
      >
        <Card.Content>
          <Paragraph style={{ color: item.role === 'user' ? '#fff' : '#000' }}>{item.content}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={100}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={room.name} />
      </Appbar.Header>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {isTyping && <Text style={styles.typingIndicator}>Bot is typing...</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          style={styles.textInput}
          mode="outlined"
          multiline
        />
        <Button
          mode="contained"
          onPress={sendMessage}
          loading={loading}
          disabled={!newMessage.trim()}
          style={styles.sendButton}
          icon="send"
        >
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  messagesList: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageCard: {
    borderRadius: 20,
    marginHorizontal: 5,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    borderTopRightRadius: 0,
  },
  botMessage: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginRight: 8,
  },
  sendButton: {
    borderRadius: 20,
  },
  typingIndicator: {
    paddingHorizontal: 16,
    paddingBottom: 5,
    fontStyle: 'italic',
    color: '#666',
  },
});

export default ChatScreen;