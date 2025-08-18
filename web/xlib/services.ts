import api from './api';

// Finance Services
export const financeService = {
  getAccounts: () => api.get('/finance/accounts'),
  createAccount: (data: any) => api.post('/finance/accounts', data),
  getTransactions: () => api.get('/finance/transactions'),
  createTransaction: (data: any) => api.post('/finance/transactions', data),
  deleteTransaction: (id: number) => api.delete(`/finance/transactions/${id}`),
  uploadTransactions: (formData: FormData, accountId: number) => {
    return api.post(`/finance/transactions/upload?account_id=${accountId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Wealth Services
export const wealthService = {
  getInvestments: () => api.get('/wealth/investments'),
  createInvestment: (data: any) => api.post('/wealth/investments', data),
  getSavingsGoals: () => api.get('/wealth/goals'),
  createSavingsGoal: (data: any) => api.post('/wealth/goals', data),
  getMarketData: (symbol: string) => api.get(`/wealth/market-data/${symbol}`),
  getInvestmentAdvice: (data: any) => api.post('/wealth/investment-advice', data),
  rebalancePortfolio: (data: any) => api.post('/wealth/portfolio-rebalance', data),
  executeTrade: (data: any) => api.post('/wealth/trades', data),
  getTopInvestments: () => api.get('/wealth/top-investments'),
  getAlerts: () => api.get('/wealth/alerts'),
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
  getWalletBalance: (walletId: number) => api.get(`/blockchain/wallets/${walletId}/balance`),
  getDeFiPositions: () => api.get('/blockchain/defi'),
  createDeFiPosition: (data: any) => api.post('/blockchain/defi', data),
  getNFTs: () => api.get('/blockchain/nfts'),
  addNFT: (data: any) => api.post('/blockchain/nfts', data),
  getBlocks: () => api.get('/blockchain/blocks'),
  getLatestBlock: () => api.get('/blockchain/latest-block'),
  mineBlock: (data: any) => api.post('/blockchain/mine', data),
  getLeaderboard: () => api.get('/blockchain/leaderboard'),
  getCryptoPrices: (coinIds: string[]) => api.get(`/blockchain/market/prices?ids=${coinIds.join(',')}`)
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