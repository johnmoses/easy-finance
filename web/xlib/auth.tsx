'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from './api';
import { billingService } from './services';
import { User, Subscription, Plan, Features } from '../types'; // Use the central types file

// --- TYPE DEFINITIONS ---


interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  plan: Plan | null;
  features: Features | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  loadingSubscription: boolean;
  refetchSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  const fetchSubscription = useCallback(async () => {
    setLoadingSubscription(true);
    try {
      const response = await billingService.getSubscription();
      setSubscription(response.data);
    } catch (error) {
      console.error("Could not fetch subscription", error);
      setSubscription(null);
    } finally {
      setLoadingSubscription(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setLoading(true);
      api.get('/auth/profile')
        .then(response => {
          setUser(response.data);
          // Once user is fetched, fetch their subscription
          fetchSubscription();
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
          setSubscription(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setLoadingSubscription(false);
    }
  }, [fetchSubscription]);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { access_token, refresh_token, user } = response.data;
    
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setUser(user);
    // After login, fetch the new subscription info
    await fetchSubscription();
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setSubscription(null); // Clear subscription on logout
    window.location.href = '/auth/login';
  };

  const plan = subscription ? subscription.plan : null;
  const features = plan ? plan.features : null;

  return (
    <AuthContext.Provider value={{
      user, 
      subscription,
      plan,
      features,
      login, 
      logout, 
      loading,
      loadingSubscription,
      refetchSubscription: fetchSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};