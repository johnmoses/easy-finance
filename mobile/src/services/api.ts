import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RegisterRequest,
  User,
  ChatRoom,
  ChatMessage,
  Account,
  Transaction,
  Investment,
  SavingsGoal,
  Notification,
  PriceAlert,
  CryptoWallet,
  DeFiPosition,
  NFTCollection,
  CryptoTransaction,
  Plan,
  Subscription,
  Article,
  Faq,
} from '../types';

// Set the API base URL
const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5001/api' : 'http://localhost:5001/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized error logging
const logError = (error: any, context: string) => {
  console.error(`API Error in ${context}:`, error.response?.status, error.message);
  if (error.response) {
    console.error('Error Response Data:', error.response.data);
  }
};

// Request interceptor to add auth token
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: { Authorization: `Bearer ${refreshToken}` },
          });
          await AsyncStorage.setItem('access_token', response.data.access_token);
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        }
      }
    }
    return Promise.reject(error);
  },
);

// --- Auth API ---
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      await AsyncStorage.setItem('access_token', response.data.access_token);
      await AsyncStorage.setItem('refresh_token', response.data.refresh_token);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  register: async (data: RegisterRequest) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      logError(error, 'register');
      throw error;
    }
  },
  profile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Fetching profile failed:', error);
      throw error;
    }
  },
  updateProfile: async (data: Partial<User>) => {
    try {
      const response = await api.put<User>('/auth/profile', data);
      return response.data;
    } catch (error) {
      logError(error, 'updateProfile');
      throw error;
    }
  },
  changePassword: async (data: any) => {
    try {
      const response = await api.post('/auth/change-password', data);
      return response.data;
    } catch (error) {
      logError(error, 'changePassword');
      throw error;
    }
  },
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      return response.data;
    } catch (error) {
      logError(error, 'logout');
      throw error;
    }
  },
  listUsers: async () => {
    try {
      const response = await api.get<User[]>('/auth/users');
      return response.data;
    } catch (error) {
      logError(error, 'listUsers');
      throw error;
    }
  },
};

// --- Chat API ---
export const chatAPI = {
  getRooms: async () => {
    try {
      const response = await api.get<ChatRoom[]>('/chat/rooms');
      return response.data;
    } catch (error) {
      logError(error, 'getRooms');
      throw error;
    }
  },
  createRoom: async (data: { name: string }) => {
    try {
      const response = await api.post<ChatRoom>('/chat/rooms', data);
      return response.data;
    } catch (error) {
      logError(error, 'createRoom');
      throw error;
    }
  },
  joinRoom: async (roomId: number) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/participants`);
      return response.data;
    } catch (error) {
      logError(error, 'joinRoom');
      throw error;
    }
  },
  getMessages: async (roomId: number) => {
    try {
      const response = await api.get<ChatMessage[]>(`/chat/rooms/${roomId}/messages`);
      return response.data;
    } catch (error) {
      logError(error, 'getMessages');
      throw error;
    }
  },
  sendMessage: async (roomId: number, data: { content: string; role: string }) => {
    try {
      const response = await api.post(`/chat/rooms/${roomId}/post_message`, data);
      return response.data;
    } catch (error) {
      logError(error, 'sendMessage');
      throw error;
    }
  },
};

// --- Finance API ---
export const financeAPI = {
  getAccounts: async () => {
    try {
      const response = await api.get<Account[]>('/finance/accounts');
      return response.data;
    } catch (error) {
      logError(error, 'getAccounts');
      throw error;
    }
  },
  createAccount: async (data: Partial<Account>) => {
    try {
      // Map frontend 'type' to backend 'account_type'
      const payload = {
        ...data,
        account_type: data.type, // Map 'type' to 'account_type' for backend
      };
      // Remove 'type' from payload if it exists, to avoid sending both
      delete payload.type; 

      const response = await api.post<Account>('/finance/accounts', payload);
      return response.data;
    } catch (error) {
      logError(error, 'createAccount');
      throw error;
    }
  },
  updateAccount: async (accountId: number, data: Partial<Account>) => {
    try {
      const response = await api.put<Account>(`/finance/accounts/${accountId}`, data);
      return response.data;
    } catch (error) {
      logError(error, 'updateAccount');
      throw error;
    }
  },
  getTransactions: async (params?: { account_id?: number; budget_id?: number }) => {
    try {
      const response = await api.get<Transaction[]>('/finance/transactions', { params });
      return response.data;
    } catch (error) {
      logError(error, 'getTransactions');
      throw error;
    }
  },
  createTransaction: async (data: Partial<Transaction>) => {
    try {
      const response = await api.post<Transaction>('/finance/transactions', data);
      return response.data;
    } catch (error) {
      logError(error, 'createTransaction');
      throw error;
    }
  },
  deleteTransaction: async (transactionId: number) => {
    try {
      const response = await api.delete(`/finance/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      logError(error, 'deleteTransaction');
      throw error;
    }
  },
  uploadTransactions: async (formData: FormData, accountId: string) => {
    try {
      const response = await api.post(`/finance/transactions/upload?account_id=${accountId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      logError(error, 'uploadTransactions');
      throw error;
    }
  },
};



// --- Wealth API ---
export const wealthAPI = {
  getInvestments: async () => {
    try {
      const response = await api.get<Investment[]>('/wealth/investments');
      return response.data;
    } catch (error) {
      logError(error, 'getInvestments');
      throw error;
    }
  },
  createInvestment: async (data: Partial<Investment>) => {
    try {
      const response = await api.post<Investment>('/wealth/investments', data);
      return response.data;
    } catch (error) {
      logError(error, 'createInvestment');
      throw error;
    }
  },
  getPortfolioSummary: async () => {
    try {
      const response = await api.get('/wealth/portfolio-summary');
      return response.data;
    } catch (error) {
      logError(error, 'getPortfolioSummary');
      throw error;
    }
  },
  getGoals: async () => {
    try {
      const response = await api.get<SavingsGoal[]>('/wealth/goals');
      return response.data;
    } catch (error) {
      logError(error, 'getGoals');
      throw error;
    }
  },
  createGoal: async (data: Partial<SavingsGoal>) => {
    try {
      const response = await api.post<SavingsGoal>('/wealth/goals', data);
      return response.data;
    } catch (error) {
      logError(error, 'createGoal');
      throw error;
    }
  },
  contributeToGoal: async (goalId: number, data: { amount: number }) => {
    try {
      const response = await api.post(`/wealth/goals/${goalId}/contribute`, data);
      return response.data;
    } catch (error) {
      logError(error, 'contributeToGoal');
      throw error;
    }
  },
  getWealthSummary: async () => {
    try {
      const response = await api.get('/wealth/wealth-summary');
      return response.data;
    } catch (error) {
      logError(error, 'getWealthSummary');
      throw error;
    }
  },
  getNotifications: async () => {
    try {
      const response = await api.get<Notification[]>('/wealth/alerts');
      return response.data;
    } catch (error) {
      logError(error, 'getNotifications');
      throw error;
    }
  },
  markNotificationRead: async (notificationId: number) => {
    try {
      const response = await api.put(`/wealth/alerts/${notificationId}/read`);
      return response.data;
    } catch (error) {
      logError(error, 'markNotificationRead');
      throw error;
    }
  },
  getPriceAlerts: async () => {
    try {
      const response = await api.get<PriceAlert[]>('/wealth/price-alerts');
      return response.data;
    } catch (error) {
      logError(error, 'getPriceAlerts');
      throw error;
    }
  },
  createPriceAlert: async (data: Partial<PriceAlert>) => {
    try {
      const response = await api.post<PriceAlert>('/wealth/price-alerts', data);
      return response.data;
    } catch (error) {
      logError(error, 'createPriceAlert');
      throw error;
    }
  },
};

// --- Blockchain API ---
// --- Billing API ---
export const billingAPI = {
  getPlans: async () => {
    try {
      const response = await api.get<Plan[]>('/billing/plans');
      return response.data;
    } catch (error) {
      logError(error, 'getPlans');
      throw error;
    }
  },
  getSubscription: async () => {
    try {
      const response = await api.get<Subscription>('/billing/subscription');
      return response.data;
    } catch (error) {
      logError(error, 'getSubscription');
      throw error;
    }
  },
  subscribe: async (plan_id: number) => {
    try {
      const response = await api.post('/billing/subscribe', { plan_id });
      return response.data;
    } catch (error) {
      logError(error, 'subscribe');
      throw error;
    }
  },
  cancelSubscription: async () => {
    try {
      const response = await api.post('/billing/subscription/cancel');
      return response.data;
    } catch (error) {
      logError(error, 'cancelSubscription');
      throw error;
    }
  },
};

// --- Blockchain API ---
export const blockchainAPI = {
  getWallets: async () => {
    try {
      const response = await api.get<CryptoWallet[]>('/blockchain/wallets');
      return response.data;
    } catch (error) {
      logError(error, 'getWallets');
      throw error;
    }
  },
  createWallet: async (data: Partial<CryptoWallet>) => {
    try {
      const response = await api.post<CryptoWallet>('/blockchain/wallets', data);
      return response.data;
    }  catch (error) {
      logError(error, 'createWallet');
      throw error;
    }
  },
  getDeFiPositions: async () => {
    try {
      const response = await api.get<DeFiPosition[]>('/blockchain/defi');
      return response.data;
    } catch (error) {
      logError(error, 'getDeFiPositions');
      throw error;
    }
  },
  createDeFiPosition: async (data: Partial<DeFiPosition>) => {
    try {
      const response = await api.post<DeFiPosition>('/blockchain/defi', data);
      return response.data;
    } catch (error) {
      logError(error, 'createDeFiPosition');
      throw error;
    }
  },
  getYieldOpportunities: async () => {
    try {
      const response = await api.get('/blockchain/defi/yield-opportunities');
      return response.data;
    } catch (error) {
      logError(error, 'getYieldOpportunities');
      throw error;
    }
  },
  getNFTs: async () => {
    try {
      const response = await api.get<NFTCollection[]>('/blockchain/nfts');
      return response.data;
    } catch (error) {
      logError(error, 'getNFTs');
      throw error;
    }
  },
  addNFT: async (data: Partial<NFTCollection>) => {
    try {
      const response = await api.post<NFTCollection>('/blockchain/nfts', data);
      return response.data;
    } catch (error) {
      logError(error, 'addNFT');
      throw error;
    }
  },
  
  getCryptoTransactions: async () => {
    try {
      const response = await api.get<CryptoTransaction[]>('/blockchain/transactions');
      return response.data;
    } catch (error) {
      logError(error, 'getCryptoTransactions');
      throw error;
    }
  },
  createCryptoTransaction: async (data: Partial<CryptoTransaction>) => {
    try {
      const response = await api.post<CryptoTransaction>('/blockchain/transactions', data);
      return response.data;
    } catch (error) {
      logError(error, 'createCryptoTransaction');
      throw error;
    }
  },
  getBlockchainPortfolioSummary: async () => {
    try {
      const response = await api.get('/blockchain/portfolio-summary');
      return response.data;
    } catch (error) {
      logError(error, 'getBlockchainPortfolioSummary');
      throw error;
    }
  },
};

// --- Support API ---
export const supportAPI = {
  getArticles: async () => {
    try {
      const response = await api.get<Article[]>('/support/articles');
      return response.data;
    } catch (error) {
      logError(error, 'getArticles');
      throw error;
    }
  },
  getFaqs: async () => {
    try {
      const response = await api.get<Faq[]>('/support/faqs');
      return response.data;
    } catch (error) {
      logError(error, 'getFaqs');
      throw error;
    }
  },
  chatWithSupportAI: async (message: string) => {
    try {
      const response = await api.post('/chat/support-chat', { message });
      return response.data;
    } catch (error) {
      logError(error, 'chatWithSupportAI');
      throw error;
    }
  },
};

export default api;