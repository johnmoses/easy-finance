'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../xlib/auth'; // Import useAuth hook
import { financeService } from '../../xlib/services';
import { Plus, CreditCard, TrendingUp, TrendingDown, Wallet, Receipt, ArrowUpRight, ArrowDownRight, Calculator, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Account {
  id: number;
  name: string;
  account_type: string;
  balance: number;
  currency: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  transaction_type: string;
  category: string;
  timestamp: string;
  account_id: number;
}

interface Budget {
  id: number;
  name: string;
  amount: number;
  spent?: number;
  category: string;
  period: string;
}

export default function Finance() {
  const { features } = useAuth(); // Use the auth hook to get features
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [activeTab, setActiveTab] = useState<'accounts' | 'transactions' | 'budgets'>('accounts');
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAccountForUpload, setSelectedAccountForUpload] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const [loading, setLoading] = useState(true);

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }
    if (!selectedAccountForUpload) {
      alert('Please select an account for the transactions.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      await financeService.uploadTransactions(formData, parseInt(selectedAccountForUpload));
      alert('Transactions uploaded successfully!');
      setShowUploadForm(false);
      setSelectedFile(null);
      setSelectedAccountForUpload('');
      fetchData(); // Refresh data after upload
    } catch (error) {
      console.error('Failed to upload transactions:', error);
      alert('Failed to upload transactions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [accountsRes, transactionsRes, budgetsRes] = await Promise.all([
        financeService.getAccounts(),
        financeService.getTransactions(),
        financeService.getBudgets().catch(() => ({ data: [] }))
      ]);
      setAccounts(accountsRes.data);
      setTransactions(transactionsRes.data);
      setBudgets(budgetsRes.data.map((budget: any) => ({
        ...budget,
        amount: budget.amount || 0,
        spent: budget.spent || 0
      })));
    } catch (error) {
      console.error('Failed to fetch finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (formData: any) => {
    try {
      await financeService.createAccount(formData);
      fetchData();
      setShowAccountForm(false);
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const createTransaction = async (formData: any) => {
    try {
      console.log('Creating transaction with data:', formData);
      const response = await financeService.createTransaction(formData);
      console.log('Transaction created successfully:', response.data);
      fetchData();
      setShowTransactionForm(false);
    } catch (error: any) {
      console.error('Failed to create transaction:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to create transaction: ${error.response?.data?.error || error.message}`);
    }
  };

  const createBudget = async (formData: any) => {
    try {
      await financeService.createBudget(formData);
      fetchData();
      setShowBudgetForm(false);
    } catch (error) {
      console.error('Failed to create budget:', error);
    }
  };

  const getBudgetStatus = (budget: Budget) => {
    const spent = budget?.spent || 0;
    const amount = budget?.amount || 1;
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-red-600', bgColor: 'bg-red-600' };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-600' };
    return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-600' };
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const monthlyIncome = transactions
    .filter(t => t.transaction_type === 'income' && new Date(t.timestamp).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpenses = transactions
    .filter(t => t.transaction_type === 'expense' && new Date(t.timestamp).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0);

  // Feature gating logic
  const canAddAccount = features ? accounts.length < features.max_accounts : false;
  const canAddBudget = features ? budgets.length < features.max_budgets : false;

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Finance Management</h1>
          <p className="text-gray-600">Manage your accounts and track your transactions</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Balance</p>
                <p className="text-3xl font-bold">${totalBalance.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Wallet className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Monthly Income</p>
                <p className="text-3xl font-bold">${monthlyIncome.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <ArrowUpRight className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium mb-1">Monthly Expenses</p>
                <p className="text-3xl font-bold">${monthlyExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <ArrowDownRight className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('accounts')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'accounts'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="h-5 w-5 inline mr-2" />
              Accounts ({accounts.length})
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Receipt className="h-5 w-5 inline mr-2" />
              Transactions ({transactions.length})
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
                {activeTab === 'accounts' ? 'Your Accounts' : activeTab === 'transactions' ? 'Transaction History' : 'Budget Management'}
              </h2>
              <div className="space-x-3">
                {activeTab === 'accounts' ? (
                  <div>
                    <button
                      onClick={() => setShowAccountForm(true)}
                      disabled={!canAddAccount}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Account</span>
                    </button>
                    {!canAddAccount && (
                      <p className="text-sm text-red-600 mt-2">
                        <Link href="/billing">Upgrade your plan</Link> to add more accounts.
                      </p>
                    )}
                  </div>
                ) : activeTab === 'transactions' ? (
                  <>
                    <button
                      onClick={() => setShowTransactionForm(true)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Transaction</span>
                    </button>
                    <button
                      onClick={() => setShowUploadForm(true)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Upload Transactions</span>
                    </button>
                  </>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowBudgetForm(true)}
                      disabled={!canAddBudget}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Budget</span>
                    </button>
                    {!canAddBudget && (
                      <p className="text-sm text-red-600 mt-2">
                        <Link href="/billing">Upgrade your plan</Link> to add more budgets.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'accounts' ? (
              <div className="space-y-4">
                {accounts.length === 0 ? (
                  <div className="text-center py-12">
                    <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No accounts found</p>
                    <p className="text-gray-400">Add your first account to get started</p>
                  </div>
                ) : (
                  accounts.map((account) => (
                    <div key={account.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${
                          account.account_type === 'checking' ? 'bg-blue-100 text-blue-600' :
                          account.account_type === 'savings' ? 'bg-green-100 text-green-600' :
                          account.account_type === 'credit' ? 'bg-red-100 text-red-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-slate-800">{account.name}</h3>
                          <p className="text-gray-600 capitalize">{account.account_type} Account</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-2xl text-slate-800">{new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(account.balance)}</p>
                        <p className="text-sm text-gray-500">Available Balance</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'transactions' ? (
              <div className="space-y-4">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No transactions found</p>
                    <p className="text-gray-400">Add your first transaction to get started</p>
                  </div>
                ) : (
                  transactions.slice(0, 20).map((transaction) => {
                    const account = accounts.find(acc => acc.id === transaction.account_id);
                    const currency = account ? account.currency : 'USD';
                    return (
                      <div key={transaction.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${
                            transaction.transaction_type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {transaction.transaction_type === 'income' ? (
                              <TrendingUp className="h-6 w-6" />
                            ) : (
                              <TrendingDown className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-slate-800">{transaction.description}</h3>
                            <p className="text-gray-600">{transaction.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-xl ${
                            transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.transaction_type === 'income' ? '+' : '-'}{new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(transaction.amount)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.timestamp).toLocaleDateString()}
                          </p>
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

        {/* Account Form Modal */}
        {showAccountForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Add New Account</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createAccount({
                  name: formData.get('name'),
                  account_type: formData.get('account_type'),
                  balance: parseFloat(formData.get('balance') as string),
                  currency: 'USD'
                });
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Main Checking" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                    <select name="account_type" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="checking">Checking Account</option>
                      <option value="savings">Savings Account</option>
                      <option value="credit">Credit Card</option>
                      <option value="investment">Investment Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Balance</label>
                    <input name="balance" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowAccountForm(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-300">
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transaction Form Modal */}
        {showTransactionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Add New Transaction</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const accountId = formData.get('account_id');
                const category = formData.get('category');
                const amount = parseFloat(formData.get('amount') as string);
                
                if (!category || category.toString().trim() === '') {
                  alert('Category is required');
                  return;
                }
                
                if (amount === 0) {
                  alert('Amount cannot be zero');
                  return;
                }
                
                createTransaction({
                  description: formData.get('description') || '',
                  amount: amount,
                  transaction_type: formData.get('transaction_type'),
                  category: category.toString().trim(),
                  account_id: parseInt(accountId as string)
                });
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input name="description" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Grocery shopping" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <input name="amount" type="number" step="0.01" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Type</label>
                    <select name="transaction_type" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input name="category" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" placeholder="e.g., Food, Salary, Entertainment" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account</label>
                    <select name="account_id" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      <option value="">Select an account</option>
                      {accounts.map((account) => (
                        <option key={account.id} value={account.id}>{account.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowTransactionForm(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all duration-300">
                    Add Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Upload Transactions</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</label>
                  <input 
                    type="file" 
                    accept=".csv, .pdf, .xls, .xlsx" 
                    onChange={handleFileChange} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account for Transactions</label>
                  <select 
                    name="account_id" 
                    required 
                    value={selectedAccountForUpload}
                    onChange={(e) => setSelectedAccountForUpload(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>{account.name}</option>
                    ))}
                  </select>
                </div>
                {selectedFile && (
                  <p className="text-sm text-gray-600">Selected file: {selectedFile.name}</p>
                )}
              </div>
              <div className="flex justify-end space-x-4 mt-8">
                <button type="button" onClick={() => { setShowUploadForm(false); setSelectedFile(null); }} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleFileUpload} 
                  disabled={!selectedFile || loading}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}