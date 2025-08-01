'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../xlib/auth';
import { chatService } from '../../xlib/services';
import { Send, Bot, User, Sparkles, TrendingUp, DollarSign, PieChart } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [suggestions] = useState([
    { icon: TrendingUp, text: "What's my current financial status?", color: 'blue' },
    { icon: DollarSign, text: "How can I improve my savings?", color: 'green' },
    { icon: PieChart, text: "Should I diversify my portfolio?", color: 'purple' },
    { icon: Bot, text: "Give me investment advice", color: 'orange' }
  ]);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        content: "Hello! I'm your AI financial assistant. I can help you with budgeting, investment advice, financial planning, and answer questions about your portfolio. How can I assist you today?",
        sender: 'ai',
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e?: React.FormEvent, messageText?: string) => {
    e?.preventDefault();
    const message = messageText || newMessage;
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    try {
      const response = await chatService.chatWithAI({ message });
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: response.data.response || getSmartResponse(message),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const fallbackMessage: Message = {
        id: Date.now() + 1,
        content: getSmartResponse(message),
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const getSmartResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('financial status')) {
      return "Based on your current data, you have a diversified portfolio with good savings habits. Your monthly expenses are well-managed, and you're on track with most of your financial goals.";
    }
    
    if (lowerQuestion.includes('savings')) {
      return "Here are ways to improve savings: 1) Set up automatic transfers, 2) Review subscriptions, 3) Use the 50/30/20 rule, 4) Consider high-yield savings accounts.";
    }
    
    if (lowerQuestion.includes('invest')) {
      return "For investments: 1) Diversify across asset classes, 2) Consider low-cost index funds, 3) Don't time the market, 4) Rebalance quarterly.";
    }
    
    return "I'm here to help with your financial questions! Ask me about budgeting, investing, saving, or financial planning.";
  };

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

        <div className="bg-white rounded-xl shadow-lg h-[700px] flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-8 w-8 mr-3" />
                <div>
                  <h2 className="text-xl font-semibold">Financial AI Chat</h2>
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
            {messages.length <= 1 && (
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Ask me anything about finance!</h3>
                  <p className="text-gray-600">Try one of these popular questions to get started:</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {suggestions.map((suggestion, index) => {
                    const Icon = suggestion.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => sendMessage(undefined, suggestion.text)}
                        className={`p-4 rounded-xl border-2 border-dashed transition-all duration-300 hover:border-solid hover:shadow-lg ${
                          suggestion.color === 'blue' ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50' :
                          suggestion.color === 'green' ? 'border-green-300 hover:border-green-500 hover:bg-green-50' :
                          suggestion.color === 'purple' ? 'border-purple-300 hover:border-purple-500 hover:bg-purple-50' :
                          'border-orange-300 hover:border-orange-500 hover:bg-orange-50'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${
                          suggestion.color === 'blue' ? 'text-blue-600' :
                          suggestion.color === 'green' ? 'text-green-600' :
                          suggestion.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                        <p className="text-sm font-medium text-slate-700">{suggestion.text}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          {messages.map((message) => {
            const isAI = message.sender?.username === 'finance_assistant';
            const isCurrentUser = message.sender_id === user?.id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser && !isAI ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isAI
                      ? 'bg-blue-100 text-blue-900'
                      : isCurrentUser
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center mb-1">
                    {isAI ? (
                      <Bot className="h-4 w-4 mr-1" />
                    ) : (
                      <User className="h-4 w-4 mr-1" />
                    )}
                    <span className="text-xs font-medium">
                      {isAI ? 'AI Assistant' : message.sender?.username || 'You'}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
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
                  className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 shadow-sm"
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
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                AI responses are generated for demonstration. Always consult with financial professionals for important decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}