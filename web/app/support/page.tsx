'use client';

import { useEffect, useState, useRef } from 'react';
import { supportService, chatService } from '../../xlib/services';
import { useAuth } from '../../xlib/auth';
import { ChevronDown, MessageSquare, X, Send, Bot, User } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  content: string;
}

interface Faq {
  id: number;
  question: string;
  answer: string;
}

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    username: string;
  };
  timestamp: string;
}

const FaqItem = ({ faq }: { faq: Faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex justify-between items-center p-6 text-left text-lg font-semibold text-gray-800 hover:bg-gray-50 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{faq.question}</span>
        <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-6 bg-white">
          <p className="text-gray-700 text-base">{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const SupportChatModal = ({ onClose }: { onClose: () => void }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      const response = await chatService.chatWithSupportAI({ message: newMessage, sender_id: user?.id });
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: response.data.response,
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
    <div className="fixed bottom-24 right-8 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50">
      <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
        <h3 className="font-bold text-lg">Support Chat</h3>
        <button onClick={onClose} className="hover:text-blue-200">
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isAI = message.sender?.username === 'support_assistant';
          return (
            <div key={message.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-md lg:max-w-lg px-5 py-3 rounded-xl ${isAI ? 'bg-gray-200 text-gray-900' : 'bg-blue-600 text-white'}`}>
                <div className="flex items-center mb-1">
                  {isAI ? <Bot className="h-5 w-5 mr-2" /> : <User className="h-5 w-5 mr-2" />}
                  <span className="text-sm font-semibold">{isAI ? 'Support AI' : message.sender?.username || 'You'}</span>
                </div>
                <p className="text-lg leading-relaxed">{message.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <form onSubmit={sendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a question..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base text-gray-900 placeholder-gray-400"
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50">
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default function SupportPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    supportService.getArticles().then(response => {
      setArticles(response.data);
    });
    supportService.getFaqs().then(response => {
      setFaqs(response.data);
    });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Support Center</h1>

        <section>
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Help Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <div key={article.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{article.title}</h3>
                <p className="text-gray-600">{article.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-semibold text-gray-700 mb-6">Frequently Asked Questions</h2>
          <div className="bg-white rounded-lg shadow-md">
            {faqs.map(faq => (
              <FaqItem key={faq.id} faq={faq} />
            ))}
          </div>
        </section>
      </div>

      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300"
      >
        {isChatOpen ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
      </button>

      {isChatOpen && <SupportChatModal onClose={() => setIsChatOpen(false)} />}
    </div>
  );
}