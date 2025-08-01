// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Finance: undefined;
  Wealth: undefined;
  Planning: undefined;
  Blockchain: undefined;
  Chat: undefined;
};

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Finance types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  userId: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  userId: string;
}

// Wealth types
export interface Investment {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  currentValue: number;
  change: number;
  changePercent: number;
  userId: string;
}

export interface Portfolio {
  id: string;
  totalValue: number;
  totalChange: number;
  investments: Investment[];
  userId: string;
}

// Planning types
export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  userId: string;
}

// Blockchain types
export interface Block {
  index: number;
  timestamp: string;
  data: string;
  hash: string;
  previousHash: string;
  nonce: number;
}

export interface Blockchain {
  chain: Block[];
  difficulty: number;
  miningReward: number;
}

// Chat types
export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  userId?: string;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  userId: string;
  createdAt: string;
}