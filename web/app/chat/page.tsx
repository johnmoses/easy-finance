'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../xlib/auth';
import { chatService } from '../../xlib/services';
import { Send, Bot, User, Sparkles, TrendingUp, DollarSign, PieChart, MessageSquare, ArrowLeft } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
  };
  timestamp: string;
}

interface Room {
  id: number;
  name: string;
}

const ChatWindow = ({ room, onBack }: { room: Room, onBack: () => void }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await chatService.getMessages(room.id);
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        setMessages([
          {
            id: 1,
            content: "Hello! I'm your AI financial assistant. How can I assist you today?",
            sender: { id: 0, username: 'finance_assistant' },
            timestamp: new Date().toISOString()
          }
        ]);
      }
    };
    fetchMessages();
  }, [room.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: newMessage,
      sender: { id: user?.id || 0, username: user?.username || 'User' },
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      if (room.name === 'AI Financial Assistant') {
        const response = await chatService.chatWithAI({ message: newMessage, sender_id: user?.id });
        const aiMessage: Message = {
          id: Date.now() + 1,
          content: response.data.response,
          sender: { id: 0, username: 'finance_assistant' },
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        await chatService.sendMessage(room.id, { message: newMessage, sender_id: user?.id });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: { id: 0, username: 'finance_assistant' },
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-[700px] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-4 hover:text-blue-200">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <Bot className="h-8 w-8 mr-3" />
            <div>
              <h2 className="text-xl font-semibold">{room.name}</h2>
              <p className="text-blue-100 text-sm">Powered by advanced AI • Always available</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-100">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => {
          const isAI = message.sender?.username === 'finance_assistant';
          
          return (
            <div
              key={message.id}
              className={`flex ${!isAI ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md lg:max-w-lg px-5 py-3 rounded-xl ${
                  isAI
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <div className="flex items-center mb-1">
                  {isAI ? (
                    <Bot className="h-5 w-5 mr-2" />
                  ) : (
                    <User className="h-5 w-5 mr-2" />
                  )}
                  <span className="text-sm font-semibold">
                    {isAI ? 'AI Assistant' : message.sender?.username || 'You'}
                  </span>
                </div>
                <p className="text-lg leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-60 mt-2 text-right">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-blue-100 text-blue-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <Bot className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">AI Assistant</span>
              </div>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-gray-50 p-6">
        <form onSubmit={sendMessage} className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask me anything about your finances..."
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base text-gray-900 placeholder-gray-400 shadow-sm"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

const ChatRoomSelection = ({ onSelectRoom }: { onSelectRoom: (room: Room) => void }) => {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await chatService.getRooms();
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Chat Room</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <button 
            key={room.id} 
            onClick={() => onSelectRoom(room)}
            className="p-6 rounded-lg border-2 border-dashed border-gray-300 hover:border-solid hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left"
          >
            <div className="flex items-center mb-2">
              <MessageSquare className="h-6 w-6 mr-3 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">{room.name}</h3>
            </div>
            <p className="text-gray-600 text-sm">Click to join the conversation</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl mr-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            AI Financial Assistant
          </h1>
          <p className="text-gray-600">Get personalized financial advice, insights, and answers to your money questions</p>
        </div>

        {!selectedRoom ? (
          <ChatRoomSelection onSelectRoom={setSelectedRoom} />
        ) : (
          <ChatWindow room={selectedRoom} onBack={() => setSelectedRoom(null)} />
        )}
      </div>
    </div>
  );
}