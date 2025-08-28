// User & Auth Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Finance Types
export interface Account {
  id: number;
  name: string;
  account_type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  user_id: number;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  transaction_type: 'income' | 'expense';
  category: string;
  timestamp: string;
  account_id: number;
  user_id: number;
}

// Wealth Types
export interface Investment {
  id: number;
  name: string;
  symbol: string;
  shares: number;
  purchase_price: number;
  current_price: number;
  user_id: number;
}

export interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  user_id: number;
}

// Planning Types
export interface Budget {
  id: number;
  name: string;
  category: string;
  amount: number;
  period: 'monthly' | 'yearly';
  user_id: number;
}

export interface Goal {
  id: number;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  user_id: number;
}

// Blockchain Types
export interface Wallet {
  id: number;
  name: string;
  address: string;
  balance: number;
  currency: string;
  user_id: number;
}

export interface Block {
  index: number;
  timestamp: string;
  data: any;
  previous_hash: string;
  hash: string;
  nonce: number;
}

// Chat Types
export interface ChatMessage {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  room_id: number;
}

export interface ChatRoom {
  id: number;
  name: string;
  user_id: number;
  created_at: string;
}

// Billing & Subscription Types
export interface Features {
  max_accounts: number;
  max_budgets: number;
  ai_chat: boolean;
  advanced_reporting: boolean;
  max_goals: number;
  max_wallets: number;
  defi_tracking: boolean;
  nft_tracking: boolean;
  multi_user_teams: boolean;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  features: Features;
}

export interface Subscription {
  id: number;
  plan: Plan;
  status: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface ApiError {
  error: string;
  message?: string;
  status: number;
}

// Support Types
export interface SupportArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  created_at: string;
  updated_at: string;
}