import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { supportAPI } from '../services/api';
import { Article, Faq } from '../types';
import { useAuth } from '../context/AppContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username?: string;
  };
  timestamp: string;
}

const FaqItem: React.FC<{ faq: Faq }> = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.faqItem}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={24} color="#333" />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.faqContent}>
          <Text style={styles.faqAnswer}>{faq.answer}</Text>
        </View>
      )}
    </View>
  );
};

const SupportChat: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => { // Initialize chat with a welcome message from the AI
    setMessages([
      {
        id: 1,
        content: "Hello! I'm the support assistant. How can I help you with the articles or FAQs?",
        sender: { id: 0, username: 'support_assistant' },
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: newMessage,
      sender: { id: user?.id || 0, username: user?.username || 'You' },
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      const response = await supportAPI.chatWithSupportAI(newMessage);
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: String(response.response),
        sender: { id: 0, username: 'support_assistant' },
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: { id: 0, username: 'support_assistant' },
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.chatContainer}
    >
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>Support Chat</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.chatMessagesContainer}>
        {messages.map((message) => {
          const isAI = message.sender?.username === 'support_assistant';
          return (
            <View key={message.id} style={[styles.messageBubble, isAI ? styles.aiMessage : styles.userMessage]}>
              <Text>{message.content}</Text>
              <Text>{new Date(message.timestamp).toLocaleTimeString()}</Text>
            </View>
          );
        })}
        {loading && (
          <View style={[styles.messageBubble, styles.aiMessage]}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}
      </ScrollView>
      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatTextInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          editable={!loading}
        />
        <TouchableOpacity onPress={sendMessage} disabled={loading || !newMessage.trim()} style={styles.sendButton}>
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const SupportScreen: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const fetchSupportData = async () => {
      try {
        const articlesResponse = await supportAPI.getArticles();
        setArticles(articlesResponse);
        const faqsResponse = await supportAPI.getFaqs();
        setFaqs(faqsResponse);
      } catch (error) {
        console.error("Failed to fetch support data:", error);
      }
    };
    fetchSupportData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.header}>Support Center</Text>

        <Text style={styles.sectionTitle}>Help Articles</Text>
        <View style={styles.articlesContainer}>
          {articles.map(article => (
            <View key={article.id} style={styles.articleCard}>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleContent}>{article.content}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <View style={styles.faqsContainer}>
          {faqs.map(faq => (
            <FaqItem key={faq.id} faq={faq} />
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        onPress={() => setIsChatOpen(!isChatOpen)}
        style={styles.chatToggleButton}
      >
        <Icon name={isChatOpen ? 'close' : 'message-text'} size={30} color="#fff" />
      </TouchableOpacity>

      {isChatOpen && <SupportChat onClose={() => setIsChatOpen(false)} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555',
    marginTop: 20,
    marginBottom: 15,
  },
  articlesContainer: {
    marginBottom: 20,
  },
  articleCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  articleContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  faqsContainer: {
    marginBottom: 20,
  },
  faqItem: {
    backgroundColor: '#fff',
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  faqContent: {
    padding: 15,
    paddingTop: 0,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  chatToggleButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 15,
  },
  chatTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatMessagesContainer: {
    flexGrow: 1,
    padding: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  aiMessageText: {
    color: '#333',
    fontSize: 15,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 15,
  },
  messageTime: {
    fontSize: 10,
    color: '#888',
    marginTop: 5,
    textAlign: 'right',
  },
  chatInputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  chatTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SupportScreen;
