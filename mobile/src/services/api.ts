import axios from 'axios';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:5001/api' 
  : 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  register: (email: string, password: string, username: string, role: string = 'user') =>
    api.post('/auth/register', { email, password, username, role }),
  logout: () => api.post('/auth/logout'),
};

// Finance endpoints
export const financeAPI = {
  getTransactions: () => api.get('/finance/transactions'),
  createTransaction: (data: any) => api.post('/finance/transactions', data),
  getAccounts: () => api.get('/finance/accounts'),
};

// Wealth endpoints
export const wealthAPI = {
  getPortfolio: () => api.get('/wealth/portfolio'),
  getInvestments: () => api.get('/wealth/investments'),
};

// Planning endpoints
export const planningAPI = {
  getGoals: () => api.get('/planning/goals'),
  createGoal: (data: any) => api.post('/planning/goals', data),
};

// Blockchain endpoints
export const blockchainAPI = {
  getChain: () => api.get('/blockchain/chain'),
  mineBlock: (data: any) => api.post('/blockchain/mine', data),
};

// Chat endpoints
export const chatAPI = {
  sendMessage: (message: string) => api.post('/chat/message', { message }),
  getHistory: () => api.get('/chat/history'),
};

export default api;