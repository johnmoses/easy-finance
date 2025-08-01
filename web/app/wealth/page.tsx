'use client';
import { useEffect, useState } from 'react';
import { wealthService } from '../../xlib/services';
import { TrendingUp, Target, PieChart, Plus, Bell, Briefcase, DollarSign, BarChart3 } from 'lucide-react';

interface Investment {
  id: number;
  name: string;
  symbol: string;
  quantity: number;
  purchase_price: number;
  current_price: number;
}

interface SavingsGoal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string;
}

interface Alert {
  id: number;
  type: 'goal' | 'investment' | 'milestone';
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Wealth() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'investments' | 'alerts'>('portfolio');
  const [showInvestmentForm, setShowInvestmentForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [investmentsRes, goalsRes] = await Promise.all([
        wealthService.getInvestments().catch(() => ({ data: [] })),
        wealthService.getSavingsGoals().catch(() => ({ data: [] }))
      ]);
      
      setInvestments(investmentsRes.data);
      setSavingsGoals(goalsRes.data);
      
      // Mock alerts data for now
      setAlerts([
        { id: 1, type: 'goal', message: 'Emergency Fund goal is 80% complete!', timestamp: new Date().toISOString(), read: false },
        { id: 2, type: 'investment', message: 'AAPL stock gained 5% today', timestamp: new Date().toISOString(), read: false },
        { id: 3, type: 'milestone', message: 'Portfolio reached $50,000 milestone', timestamp: new Date().toISOString(), read: true }
      ]);
    } catch (error) {
      console.error('Failed to fetch wealth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createInvestment = async (formData: any) => {
    try {
      await wealthService.createInvestment(formData);
      fetchData();
      setShowInvestmentForm(false);
    } catch (error) {
      console.error('Failed to create investment:', error);
    }
  };

  const createSavingsGoal = async (formData: any) => {
    try {
      await wealthService.createSavingsGoal(formData);
      fetchData();
      setShowGoalForm(false);
    } catch (error) {
      console.error('Failed to create savings goal:', error);
    }
  };

  const calculatePortfolioValue = () => {
    return investments.reduce((total, inv) => total + (inv.quantity * inv.current_price), 0);
  };

  const calculatePortfolioGain = () => {
    const currentValue = calculatePortfolioValue();
    const purchaseValue = investments.reduce((total, inv) => total + (inv.quantity * inv.purchase_price), 0);
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
  const totalGoalsValue = savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const unreadAlerts = alerts.filter(alert => !alert.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Wealth Management</h1>
          <p className="text-gray-600">Track your investments, goals, and portfolio performance</p>
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
                <p className="text-purple-200 text-xs">{savingsGoals.length} active goals</p>
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
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'portfolio'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <PieChart className="h-5 w-5 inline mr-2" />
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('investments')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'investments'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="h-5 w-5 inline mr-2" />
              Investments ({investments.length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors relative ${
                activeTab === 'alerts'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Bell className="h-5 w-5 inline mr-2" />
              Alerts
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                {activeTab === 'portfolio' ? 'Portfolio Overview' : 
                 activeTab === 'investments' ? 'Your Investments' : 'Notifications & Alerts'}
              </h2>
              <div className="space-x-3">
                {activeTab === 'investments' && (
                  <button
                    onClick={() => setShowInvestmentForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Investment</span>
                  </button>
                )}
                {activeTab === 'portfolio' && (
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Goal</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'portfolio' ? (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Savings Goals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Savings Goals</h3>
                    {savingsGoals.length === 0 ? (
                      <div className="text-center py-12">
                        <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No savings goals found</p>
                        <p className="text-gray-400">Set your first financial goal!</p>
                      </div>
                    ) : (
                      savingsGoals.map((goal) => {
                        const progress = (goal.current_amount / goal.target_amount) * 100;
                        const daysLeft = Math.ceil((new Date(goal.target_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                        
                        return (
                          <div key={goal.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="font-semibold text-lg text-slate-800">{goal.name}</h4>
                                <p className="text-gray-600">
                                  Target: ${goal.target_amount.toLocaleString()}
                                </p>
                                <p className={`text-sm ${daysLeft > 0 ? 'text-gray-600' : 'text-red-600'}`}>
                                  {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-xl text-slate-800">
                                  ${goal.current_amount.toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">{progress.toFixed(1)}%</p>
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
                  
                  {/* Portfolio Summary */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Portfolio Summary</h3>
                    <div className="space-y-4">
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Total Investments</span>
                          <span className="font-bold text-xl text-slate-800">{investments.length}</span>
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Portfolio Value</span>
                          <span className="font-bold text-xl text-green-600">${portfolioValue.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-medium">Total Gain/Loss</span>
                          <span className={`font-bold text-xl ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {portfolioGain >= 0 ? '+' : ''}${portfolioGain.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : activeTab === 'investments' ? (
              <div className="space-y-4">
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
                      </div>
                    );
                  })
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No alerts found</p>
                    <p className="text-gray-400">You'll see notifications here</p>
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <div key={alert.id} className={`p-6 rounded-lg border-l-4 ${
                      alert.type === 'goal' ? 'border-blue-500 bg-blue-50' :
                      alert.type === 'investment' ? 'border-green-500 bg-green-50' :
                      'border-purple-500 bg-purple-50'
                    } ${!alert.read ? 'ring-2 ring-blue-200' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            alert.type === 'goal' ? 'bg-blue-100 text-blue-600' :
                            alert.type === 'investment' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {alert.type === 'goal' ? <Target className="h-5 w-5" /> :
                             alert.type === 'investment' ? <TrendingUp className="h-5 w-5" /> :
                             <Bell className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{alert.message}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(alert.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {!alert.read && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
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
                    <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Apple Inc." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symbol</label>
                    <input name="symbol" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., AAPL" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                    <input name="quantity" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Number of shares" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Price</label>
                    <input name="purchase_price" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Price per share" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                    <input name="current_price" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="Current market price" />
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
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Add New Savings Goal</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createSavingsGoal({
                  name: formData.get('name'),
                  target_amount: parseFloat(formData.get('target_amount') as string),
                  current_amount: parseFloat(formData.get('current_amount') as string) || 0,
                  target_date: formData.get('target_date')
                });
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Goal Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Emergency Fund" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount</label>
                    <input name="target_amount" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Goal amount" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Amount</label>
                    <input name="current_amount" type="number" step="0.01" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Current savings (optional)" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
                    <input name="target_date" type="date" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowGoalForm(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300">
                    Add Goal
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