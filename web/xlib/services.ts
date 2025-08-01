import api from './api';

// Finance Services
export const financeService = {
  getAccounts: () => api.get('/finance/accounts'),
  createAccount: (data: any) => api.post('/finance/accounts', data),
  getTransactions: () => api.get('/finance/transactions'),
  createTransaction: (data: any) => api.post('/finance/transactions', data),
  deleteTransaction: (id: number) => api.delete(`/finance/transactions/${id}`)
};

// Wealth Services
export const wealthService = {
  getInvestments: () => api.get('/wealth/investments'),
  createInvestment: (data: any) => api.post('/wealth/investments', data),
  getSavingsGoals: () => api.get('/wealth/savings-goals'),
  createSavingsGoal: (data: any) => api.post('/wealth/savings-goals', data)
};

// Planning Services
export const planningService = {
  getBudgets: () => api.get('/planning/budgets'),
  createBudget: (data: any) => api.post('/planning/budgets', data)
};

// Blockchain Services
export const blockchainService = {
  getWallets: () => api.get('/blockchain/wallets'),
  createWallet: (data: any) => api.post('/blockchain/wallets', data),
  getBlocks: () => api.get('/blockchain/blocks'),
  mineBlock: (data: any) => api.post('/blockchain/mine', data)
};

// Chat Services
export const chatService = {
  getMessages: (roomId: number) => api.get(`/chat/rooms/${roomId}/messages`),
  sendMessage: (roomId: number, data: any) => api.post(`/chat/rooms/${roomId}/messages`, data),
  chatWithAI: (data: any) => api.post('/llm/chat', data)
};

// Auth Services
export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout')
};