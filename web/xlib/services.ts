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
  getBudgets: () => api.get('/finance/budgets'),
  createBudget: (data: any) => api.post('/finance/budgets', data),
};

// Wealth Services
export const wealthService = {
  getInvestments: () => api.get('/wealth/investments'),
  createInvestment: (data: any) => api.post('/wealth/investments', data),
  getSavingsGoals: () => api.get('/wealth/goals'),
  createSavingsGoal: (data: any) => api.post('/wealth/goals', data),
  getMarketData: (symbol: string) => api.get(`/wealth/market-data/${symbol}`),
  
  getAlerts: () => api.get('/wealth/alerts'),
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
  getRooms: () => api.get('/chat/rooms'),
  getMessages: (roomId: number) => api.get(`/chat/rooms/${roomId}/messages`),
  sendMessage: (roomId: number, data: any) => api.post(`/chat/rooms/${roomId}/messages`, data),
  chatWithAI: (data: any) => api.post('/chat/ai-chat', data),
  chatWithSupportAI: (data: any) => api.post('/chat/support-chat', data)
};

// Auth Services
export const authService = {
  login: (data: any) => api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout')
};

// General Services
export const generalService = {
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id: number) => api.put(`/notifications/${id}/read`),
  getSettings: () => api.get('/settings'),
  updateSettings: (data: any) => api.post('/settings', data),
};

// Billing, Subscription, and Team Services
export const billingService = {
  // Subscription Management
  getPlans: () => api.get('/billing/plans'),
  getSubscription: () => api.get('/billing/subscription'),
  subscribe: (planId: number) => api.post('/billing/subscribe', { plan_id: planId }),
  cancelSubscription: () => api.post('/billing/subscription/cancel'),

  // Team Management (requires backend implementation in billing routes)
  // getTeam: () => api.get('/billing/team'),
  // inviteMember: (email: string) => api.post('/billing/team/members', { email }),
  // updateMemberRole: (memberId: number, role: string) => api.patch(`/billing/team/members/${memberId}`, { role }),
  // removeMember: (memberId: number) => api.delete(`/billing/team/members/${memberId}`),
};

// Support Services
export const supportService = {
  getArticles: () => api.get('/support/articles'),
  getArticle: (id: number) => api.get(`/support/articles/${id}`),
  getFaqs: () => api.get('/support/faqs'),
};
