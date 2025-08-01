'use client';
import { useEffect, useState } from 'react';
import { planningService } from '../../xlib/services';
import { Calculator, PieChart, Plus, AlertCircle, Target, Calendar, DollarSign } from 'lucide-react';

interface Budget {
  id: number;
  name: string;
  amount: number;
  spent?: number;
  category: string;
  period: string;
}

interface Goal {
  id: number;
  name: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

export default function Planning() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'goals' | 'budgets'>('goals');
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [budgetsRes, goalsRes] = await Promise.all([
        planningService.getBudgets().catch(() => ({ data: [] })),
        // Mock goals data since endpoint might not exist
        Promise.resolve({ data: [
          { id: 1, name: 'Emergency Fund', description: 'Build 6 months of expenses', target_amount: 15000, current_amount: 8500, deadline: '2024-12-31' },
          { id: 2, name: 'Vacation', description: 'Trip to Europe', target_amount: 5000, current_amount: 2200, deadline: '2024-08-15' },
          { id: 3, name: 'New Car', description: 'Down payment for new car', target_amount: 10000, current_amount: 6800, deadline: '2025-06-30' }
        ] })
      ]);
      
      setBudgets(budgetsRes.data.map((budget: any) => ({ 
        ...budget, 
        amount: budget.amount || 0,
        spent: budget.spent || 0 
      })));
      setGoals(goalsRes.data);
    } catch (error) {
      console.error('Failed to fetch planning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async (formData: any) => {
    try {
      await planningService.createBudget(formData);
      fetchData();
      setShowBudgetForm(false);
    } catch (error) {
      console.error('Failed to create budget:', error);
    }
  };

  const createGoal = async (formData: any) => {
    try {
      // Mock creation for now
      const newGoal = { id: Date.now(), current_amount: 0, ...formData };
      setGoals(prev => [...prev, newGoal]);
      setShowGoalForm(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const getTotalBudget = () => {
    return budgets.reduce((total, budget) => total + (budget?.amount || 0), 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((total, budget) => total + (budget?.spent || 0), 0);
  };

  const getBudgetStatus = (budget: Budget) => {
    const spent = budget?.spent || 0;
    const amount = budget?.amount || 1;
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-red-600', bgColor: 'bg-red-600' };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-600' };
    return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-600' };
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

  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const remainingBudget = totalBudget - totalSpent;
  const totalGoalsValue = goals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalGoalsTarget = goals.reduce((sum, goal) => sum + goal.target_amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Financial Planning</h1>
          <p className="text-gray-600">Set goals and manage your budgets for better financial health</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Active Goals</p>
                <p className="text-3xl font-bold">{goals.length}</p>
                <p className="text-blue-200 text-xs">${totalGoalsValue.toLocaleString()} saved</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Target className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Budget</p>
                <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
                <p className="text-green-200 text-xs">${totalSpent.toLocaleString()} spent</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Calculator className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className={`bg-gradient-to-r ${remainingBudget >= 0 ? 'from-purple-500 to-indigo-600' : 'from-red-500 to-pink-600'} p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${remainingBudget >= 0 ? 'text-purple-100' : 'text-red-100'} text-sm font-medium mb-1`}>Budget Status</p>
                <p className="text-3xl font-bold">${Math.abs(remainingBudget).toLocaleString()}</p>
                <p className={`${remainingBudget >= 0 ? 'text-purple-200' : 'text-red-200'} text-xs`}>{remainingBudget >= 0 ? 'Remaining' : 'Over budget'}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <DollarSign className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'goals'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Target className="h-5 w-5 inline mr-2" />
              Goals ({goals.length})
            </button>
            <button
              onClick={() => setActiveTab('budgets')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'budgets'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Budgets ({budgets.length})
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                {activeTab === 'goals' ? 'Financial Goals' : 'Budget Management'}
              </h2>
              <div className="space-x-3">
                {activeTab === 'goals' ? (
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Goal</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setShowBudgetForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Budget</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'goals' ? (
              <div className="space-y-4">
                {goals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No goals found</p>
                    <p className="text-gray-400">Set your first financial goal to get started</p>
                  </div>
                ) : (
                  goals.map((goal) => {
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
            ) : (
              <div className="space-y-4">
                {budgets.length === 0 ? (
                  <div className="text-center py-12">
                    <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No budgets found</p>
                    <p className="text-gray-400">Create your first budget to start planning</p>
                  </div>
                ) : (
                  budgets.map((budget) => {
                    const spent = budget.spent || 0;
                    const percentage = (spent / budget.amount) * 100;
                    const status = getBudgetStatus({ ...budget, spent });
                    
                    return (
                      <div key={budget.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${
                              status.status === 'over' ? 'bg-red-100 text-red-600' :
                              status.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              <Calculator className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-slate-800">{budget.name}</h4>
                              <p className="text-gray-600 capitalize">{budget.category} • {budget.period}</p>
                              <p className="text-sm text-gray-500">Remaining: ${((budget?.amount || 0) - spent).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-slate-800">
                              ${(budget?.amount || 0).toLocaleString()}
                            </p>
                            <p className={`text-sm font-medium ${status.color}`}>
                              ${spent.toLocaleString()} spent
                            </p>
                            <p className="text-sm text-gray-600">{percentage.toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              status.status === 'over' ? 'bg-gradient-to-r from-red-500 to-pink-600' :
                              status.status === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                              'bg-gradient-to-r from-green-500 to-emerald-600'
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          ></div>
                        </div>
                        {status.status === 'over' && (
                          <div className="flex items-center text-red-600 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Over budget by ${(spent - (budget?.amount || 0)).toLocaleString()}!</span>
                          </div>
                        )}
                        {status.status === 'warning' && (
                          <div className="flex items-center text-yellow-600 text-sm">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span>Approaching budget limit</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Goal Form Modal */}
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

        {/* Budget Form Modal */}
        {showBudgetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Create New Budget</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createBudget({
                  name: formData.get('name'),
                  amount: parseFloat(formData.get('amount') as string),
                  category: formData.get('category'),
                  period: formData.get('period')
                });
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Monthly Groceries" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input name="amount" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select name="category" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select a category</option>
                      <option value="food">Food & Dining</option>
                      <option value="transportation">Transportation</option>
                      <option value="entertainment">Entertainment</option>
                      <option value="utilities">Utilities</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="shopping">Shopping</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                    <select name="period" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select a period</option>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowBudgetForm(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-300">
                    Create Budget
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