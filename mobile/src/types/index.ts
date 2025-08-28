
// --- API Response ---
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// --- Auth ---
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'assistant';
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

// --- Chat ---
export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  is_private: boolean;
  created_by: number;
  created_at: string;
  last_message?: ChatMessage;
}

export interface ChatMessage {
  id: number;
  room_id: number;
  sender_id: number;
  content: string;
  role: string;
  is_ai: boolean;
  message_type: string;
  status: string;
  timestamp: string;
}

// --- Finance ---
export interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  currency: string;
  user_id: number;
  is_active: boolean;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  transaction_type: 'income' | 'expense';
  category: string;
  timestamp: string;
  user_id: number;
  account_id?: number;
  budget_id?: number;
}



// --- Wealth ---
export interface Investment {
  id: number;
  symbol: string;
  name: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
  total_value: number;
  profit_loss: number;
  profit_loss_percentage: number;
  investment_type: string;
  user_id: number;
  account_id?: number;
}

export interface SavingsGoal {
  id: number;
  name: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  progress_percentage: number;
  remaining_amount: number;
  target_date?: string;
  days_remaining: number;
  priority: 'low' | 'medium' | 'high';
  is_completed: boolean;
  user_id: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: string;
  priority: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
  user_id: number;
}

export interface PriceAlert {
  id: number;
  symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  is_triggered: boolean;
  is_active: boolean;
  user_id: number;
}

// --- Blockchain ---
export interface CryptoWallet {
  id: number;
  name: string;
  address: string;
  currency: string;
  balance: number;
  network: string;
  wallet_type: string;
  user_id: number;
  is_active: boolean;
}

export interface DeFiPosition {
  id: number;
  protocol: string;
  position_type: string;
  token_pair: string;
  amount_deposited: number;
  current_value: number;
  apy: number;
  rewards_earned: number;
  profit_loss: number;
  user_id: number;
  wallet_id?: number;
  is_active: boolean;
}

export interface NFTCollection {
  id: number;
  name: string;
  contract_address: string;
  token_id: string;
  purchase_price: number;
  current_price: number;
  currency: string;
  marketplace: string;
  metadata_url?: string;
  user_id: number;
  wallet_id?: number;
}

export interface Block {
  index: number;
  timestamp: string;
  data: any;
  hash: string;
  previous_hash: string;
  nonce: number;
}

export interface CryptoTransaction {
  id: number;
  tx_hash: string;
  from_address: string;
  to_address: string;
  amount: number;
  currency: string;
  gas_fee: number;
  status: string;
  created_at: string;
  user_id: number;
  wallet_id?: number;
}

// --- Billing ---
export interface PlanFeatures {
    max_accounts: number;
    max_wallets: number;
    ai_chat: boolean;
    advanced_reporting: boolean;
    multi_user_teams: boolean;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  features: PlanFeatures;
}

export interface Subscription {
  id: number;
  plan_id: number;
  status: string;
  start_date: string;
  end_date: string | null;
  plan: Plan;
}

// --- Support ---
export interface Article {
  id: number;
  title: string;
  content: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

// --- Error ---
export interface ApiError {
  message: string;
  statusCode: number;
}
