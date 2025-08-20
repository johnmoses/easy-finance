'use client';
import { useEffect, useState } from 'react';
import { wealthService } from '../../xlib/services';
import { TrendingUp, Target, PieChart, Plus, Bell, Briefcase, DollarSign, BarChart3, Calendar } from 'lucide-react';

interface Investment {
  id: number;
  name: string;
  symbol: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
}

interface Goal {
  id: number;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

interface Alert {
  id: number;
  type: 'goal' | 'investment' | 'milestone';
  message: string;
  timestamp: string;
  read: boolean;
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
}

interface InvestmentAdvice {
  message: string;
  recommendations: {
    symbol: string;
    name: string;
    action: string;
  }[];
}

interface PortfolioRebalance {
  message: string;
  trades: {
    symbol: string;
    action: string;
    quantity: number;
  }[];
}

interface Trade {
  message: string;
  order_id: string;
}

interface TopInvestment {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export default function Wealth() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<Goal[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'goals' | 'invest' | 'alerts'>('portfolio');
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [marketDataSymbol, setMarketDataSymbol] = useState('');
  const [tradingMode, setTradingMode] = useState('paper');

  useEffect(() => {
    console.log('useEffect: Calling fetchData and fetchAlerts');
    fetchData();
    fetchAlerts();
  }, []);

  const fetchData = async () => {
    console.log('fetchData: Starting data fetch');
    try {
      const [investmentsRes, goalsRes] = await Promise.all([
        wealthService.getInvestments().catch((error) => {
          console.error('fetchData: Error fetching investments:', error);
          return { data: [] };
        }),
        wealthService.getSavingsGoals().catch((error) => {
          console.error('fetchData: Error fetching goals:', error);
          return { data: { goals: [] } };
        })
      ]);

      console.log('fetchData: Raw investments response:', investmentsRes);
      console.log('fetchData: Raw goals response:', goalsRes);

      const processedInvestments = Array.isArray(investmentsRes.data) ? investmentsRes.data : [];
      const processedGoals = Array.isArray(goalsRes.data.goals) ? goalsRes.data.goals : [];

      console.log('fetchData: Processed investments:', processedInvestments);
      console.log('fetchData: Processed goals:', processedGoals);

      setInvestments(processedInvestments);
      setSavingsGoals(processedGoals);

    } catch (error) {
      console.error('Failed to fetch wealth data (outer catch):', error);
    } finally {
      setLoading(false);
      console.log('fetchData: Data fetch complete, loading set to false');
    }
  };

  const createInvestment = async (formData: any) => {
    try {
      alert(`Creating investment in ${tradingMode} mode.`);
      await wealthService.createInvestment(formData);
      fetchData();
      setShowInvestmentForm(false);
    } catch (error) {
      console.error('Failed to create investment:', error);
    }
  };

  const createGoal = async (formData: any) => {
    try {
      await wealthService.createSavingsGoal(formData);
      fetchData();
      setShowGoalForm(false);
    } catch (error) {
      console.error('Failed to create savings goal:', error);
    }
  };

  const fetchMarketData = async () => {
    if (!marketDataSymbol) return;
    try {
      const res = await wealthService.getMarketData(marketDataSymbol);
      setMarketData(res.data);
    } catch (error) {
      console.error('Failed to fetch market data:', error);
      setMarketData(null);
    }
  };



  const fetchAlerts = async () => {
    try {
      const res = await wealthService.getAlerts();
      setAlerts(res.data.alerts);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const calculatePortfolioValue = () => {
    return Array.isArray(investments) ? investments.reduce((total, inv) => total + (inv.quantity * inv.current_price), 0) : 0;
  };

  const calculatePortfolioGain = () => {
    const currentValue = calculatePortfolioValue();
    const purchaseValue = Array.isArray(investments) ? investments.reduce((total, inv) => total + (inv.quantity * inv.purchase_price), 0) : 0;
    return currentValue - purchaseValue;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="h-16 w-16 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const portfolioGain = calculatePortfolioGain();
  const portfolioValue = calculatePortfolioValue();
  const totalGoalsValue = Array.isArray(savingsGoals) ? savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0) : 0;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Wealth Management</h1>
          <p className="text-gray-600">Track your investments, goals, and portfolio performance</p>
        </div>

        <div className="flex justify-end mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Trading Mode:</span>
            <div className="flex rounded-lg bg-gray-200 p-1">
              <button
                onClick={() => setTradingMode('paper')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tradingMode === 'paper' ? 'bg-white text-blue-600 shadow' : 'text-gray-600 hover:bg-gray-300'
                  }`}
              >
                Paper
              </button>
              <button
                onClick={() => setTradingMode('live')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tradingMode === 'live' ? 'bg-white text-red-600 shadow' : 'text-gray-600 hover:bg-gray-300'
                  }`}
              >
                Live
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Portfolio Value</p>
                <p className="text-3xl font-bold">${portfolioValue.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-r ${portfolioGain >= 0 ? 'from-blue-500 to-cyan-600' : 'from-red-500 to-pink-600'} p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${portfolioGain >= 0 ? 'text-blue-100' : 'text-red-100'} text-sm font-medium mb-1`}>Total Gain/Loss</p>
                <p className="text-3xl font-bold">
                  {portfolioGain >= 0 ? '+' : ''}${portfolioGain.toLocaleString()}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Savings Goals</p>
                <p className="text-3xl font-bold">${totalGoalsValue.toLocaleString()}</p>
                <p className="text-purple-200 text-xs">{Array.isArray(savingsGoals) ? savingsGoals.length : 0} active goals</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Target className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'portfolio'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <PieChart className="h-5 w-5 inline mr-2" />
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'goals'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <Target className="h-5 w-5 inline mr-2" />
              Goals
            </button>
            <button
              onClick={() => setActiveTab('invest')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'invest'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <Briefcase className="h-5 w-5 inline mr-2" />
              Invest
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${activeTab === 'alerts'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
            >
              <Bell className="h-5 w-5 inline mr-2" />
              Alerts
            </button>
          </div>

          <div className="p-6">

            {/* Tab Content */}
            {activeTab === 'portfolio' || activeTab === 'invest' ? (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Your Investments</h3>
                  {investments.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No investments found</p>
                      <p className="text-gray-400">Start building your portfolio!</p>
                    </div>
                  ) : (
                    investments.map((investment) => {
                      const gain = (investment.current_price - investment.purchase_price) * investment.quantity;
                      const gainPercent = ((investment.current_price - investment.purchase_price) / investment.purchase_price) * 100;
                      const investmentAlert = alerts.find(a => a.type === 'investment' && a.message.includes(investment.symbol) && !a.read);

                      return (
                        <div key={investment.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg ${gain >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                <TrendingUp className="h-6 w-6" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg text-slate-800">{investment.name}</h4>
                                <p className="text-gray-600">{investment.symbol} • {investment.quantity} shares</p>
                                <p className="text-sm text-gray-500">${investment.current_price}/share</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-xl text-slate-800">
                                ${(investment.quantity * investment.current_price).toLocaleString()}
                              </p>
                              <p className={`text-sm font-medium ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercent.toFixed(2)}%)
                              </p>
                            </div>
                          </div>
                          {investmentAlert && (
                            <div className="mt-4 flex items-center text-sm text-green-600">
                              <Bell className="h-4 w-4 mr-2" />
                              {investmentAlert.message}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ) : activeTab === 'goals' ? (
              <div className="space-y-4">
                {savingsGoals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No goals found</p>
                    <p className="text-gray-400">Set your first financial goal to get started</p>
                  </div>
                ) : (
                  savingsGoals.map((goal) => {
                    const progress = (goal.current_amount / goal.target_amount) * 100;
                    const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <div key={goal.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                              <Target className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-slate-800">{goal.name}</h4>
                              <p className="text-gray-600">{goal.description}</p>
                              <p className={`text-sm ${daysLeft > 0 ? 'text-gray-500' : 'text-red-600'}`}>
                                {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-slate-800">
                              ${goal.current_amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-600">of ${goal.target_amount.toLocaleString()}</p>
                            <p className="text-sm text-blue-600 font-medium">{progress.toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            ) : activeTab === 'alerts' ? (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg ${alert.read ? 'bg-gray-100' : 'bg-blue-100'}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 mr-3 text-blue-500" />
                        <div>
                          <p className={`font-medium ${alert.read ? 'text-gray-600' : 'text-blue-800'}`}>{alert.message}</p>
                          <p className={`text-sm ${alert.read ? 'text-gray-500' : 'text-blue-600'}`}>{new Date(alert.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      {!alert.read && (
                        <button
                          onClick={() => {
                            const newAlerts = alerts.map(a => a.id === alert.id ? { ...a, read: true } : a);
                            setAlerts(newAlerts);
                          }}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Investment Form Modal */}
        {showInvestmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Add New Investment</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createInvestment({
                  name: formData.get('name'),
                  symbol: formData.get('symbol'),
                  quantity: parseFloat(formData.get('quantity') as string),
                  purchase_price: parseFloat(formData.get('purchase_price') as string),
                  current_price: parseFloat(formData.get('current_price') as string)
                });
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Investment Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-base" placeholder="e.g., Apple Inc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
                    <input name="symbol" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-base" placeholder="e.g., AAPL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input name="quantity" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-base" placeholder="Number of shares" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                    <input name="purchase_price" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-base" placeholder="Price per share" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                    <input name="current_price" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 text-base" placeholder="Current market price" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowInvestmentForm(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-300">
                    Add Investment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Savings Goal Form Modal */}
        {showGoalForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Create New Goal</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createGoal({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  target_amount: parseFloat(formData.get('target_amount') as string),
                  deadline: formData.get('deadline')
                });
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Emergency Fund" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea name="description" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={3} placeholder="Describe your goal..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                    <input name="target_amount" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                    <input name="deadline" type="date" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowGoalForm(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300">
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}