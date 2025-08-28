import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Transaction, Investment, SavingsGoal, Plan, Subscription } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  investments: Investment[];
  goals: SavingsGoal[];
  plans: Plan[];
  subscription: Subscription | null;
  loading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'SET_GOALS'; payload: SavingsGoal[] }
  | { type: 'ADD_GOAL'; payload: SavingsGoal }
  | { type: 'SET_PLANS'; payload: Plan[] }
  | { type: 'SET_SUBSCRIPTION'; payload: Subscription | null }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  transactions: [],
  investments: [],
  goals: [],
  plans: [],
  subscription: null,
  loading: false,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'SET_INVESTMENTS':
      return { ...state, investments: action.payload };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'SET_PLANS':
      return { ...state, plans: action.payload };
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Helper hooks
export const useAuth = () => {
  const { state, dispatch } = useAppContext();
  
  const login = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
  };
  
  const logout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'SET_TRANSACTIONS', payload: [] });
    dispatch({ type: 'SET_INVESTMENTS', payload: [] });
    dispatch({ type: 'SET_GOALS', payload: [] });
  };
  
  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    subscription: state.subscription,
    loadingSubscription: state.loading,
    refetchSubscription: () => {
      // Placeholder function, will be implemented later
    },
    login,
    logout,
  };
};

export const useFinance = () => {
  const { state, dispatch } = useAppContext();
  
  const addTransaction = (transaction: Transaction) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };
  
  const setTransactions = (transactions: Transaction[]) => {
    dispatch({ type: 'SET_TRANSACTIONS', payload: transactions });
  };
  
  return {
    transactions: state.transactions,
    addTransaction,
    setTransactions,
  };
};

export const useWealth = () => {
  const { state, dispatch } = useAppContext();
  
  const setInvestments = (investments: Investment[]) => {
    dispatch({ type: 'SET_INVESTMENTS', payload: investments });
  };
  
  return {
    investments: state.investments,
    setInvestments,
  };
};



export const useBilling = () => {
  const { state, dispatch } = useAppContext();

  const setPlans = (plans: Plan[]) => {
    dispatch({ type: 'SET_PLANS', payload: plans });
  };

  const setSubscription = (subscription: Subscription | null) => {
    dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
  };

  return {
    plans: state.plans,
    subscription: state.subscription,
    setPlans,
    setSubscription,
  };
};