import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, Transaction, Investment, Goal } from '../types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  transactions: Transaction[];
  investments: Investment[];
  goals: Goal[];
  loading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'SET_INVESTMENTS'; payload: Investment[] }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  transactions: [],
  investments: [],
  goals: [],
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

export const usePlanning = () => {
  const { state, dispatch } = useAppContext();
  
  const addGoal = (goal: Goal) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };
  
  const setGoals = (goals: Goal[]) => {
    dispatch({ type: 'SET_GOALS', payload: goals });
  };
  
  return {
    goals: state.goals,
    addGoal,
    setGoals,
  };
};