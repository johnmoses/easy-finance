'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../xlib/auth';
import api from '../../xlib/api';
import { TrendingUp, DollarSign, Target, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';

interface DashboardData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoals: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsGoals: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/finance/accounts'),
          api.get('/finance/transactions'),
          api.get('/wealth/goals')
        ]);

        const accounts = results[0].status === 'fulfilled' ? results[0].value.data : [];
        const transactions = results[1].status === 'fulfilled' ? results[1].value.data : [];
        const goals = results[2].status === 'fulfilled' ? results[2].value.data : [];

        const totalBalance = accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlyTransactions = transactions.filter((t: any) => {
          const date = new Date(t.timestamp);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const monthlyIncome = monthlyTransactions
          .filter((t: any) => t.transaction_type === 'income')
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        const monthlyExpenses = monthlyTransactions
          .filter((t: any) => t.transaction_type === 'expense')
          .reduce((sum: number, t: any) => sum + t.amount, 0);

        setData({
          totalBalance,
          monthlyIncome,
          monthlyExpenses,
          savingsGoals: goals.length
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="h-16 w-16 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const netSavings = data.monthlyIncome - data.monthlyExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}! Here's your financial overview.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Balance</p>
                <p className="text-3xl font-bold">
                  ${data.totalBalance.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Wallet className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Monthly Income</p>
                <p className="text-3xl font-bold">
                  ${data.monthlyIncome.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <ArrowUpRight className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Monthly Expenses</p>
                <p className="text-3xl font-bold">
                  ${data.monthlyExpenses.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <ArrowDownRight className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Savings Goals</p>
                <p className="text-3xl font-bold">{data.savingsGoals}</p>
                <p className="text-purple-200 text-xs">Active goals</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Target className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              Financial Overview
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Net Worth</span>
                <span className="font-bold text-xl text-slate-800">
                  ${data.totalBalance.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Monthly Savings</span>
                <span className={`font-bold text-xl ${
                  netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {netSavings >= 0 ? '+' : ''}${netSavings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium">Savings Rate</span>
                <span className="font-bold text-xl text-blue-600">
                  {data.monthlyIncome > 0 ? Math.round((netSavings / data.monthlyIncome) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-slate-800 flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-green-600" />
              Quick Stats
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border-l-4 border-green-500 bg-green-50">
                <span className="text-gray-700">Income vs Expenses</span>
                <span className={`font-semibold ${
                  netSavings >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {netSavings >= 0 ? 'Positive' : 'Negative'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border-l-4 border-blue-500 bg-blue-50">
                <span className="text-gray-700">Active Goals</span>
                <span className="font-semibold text-blue-600">{data.savingsGoals} goals</span>
              </div>
              <div className="flex items-center justify-between p-3 border-l-4 border-purple-500 bg-purple-50">
                <span className="text-gray-700">Financial Health</span>
                <span className="font-semibold text-purple-600">
                  {netSavings >= data.monthlyIncome * 0.2 ? 'Excellent' : 
                   netSavings >= 0 ? 'Good' : 'Needs Attention'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}