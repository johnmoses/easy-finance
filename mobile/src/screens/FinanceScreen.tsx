import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { financeAPI } from '../services/api';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  bank: string;
}

const FinanceScreen = () => {
  const [activeTab, setActiveTab] = useState<'accounts' | 'transactions'>('accounts');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    category: '',
  });
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'credit',
    balance: '',
    bank: '',
  });

  useEffect(() => {
    loadAccounts();
    loadTransactions();
  }, []);

  const loadAccounts = async () => {
    try {
      const data = await financeAPI.getAccounts();
      setAccounts(data.map((account: any) => ({
        id: account.id.toString(),
        name: account.name,
        type: account.account_type,
        balance: account.balance,
        bank: account.bank || 'Default Bank',
      })));
    } catch (error) {
      console.error('Error loading accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    }
  };

  const loadTransactions = async () => {
    try {
      // Mock data for now
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 3000,
          description: 'Salary',
          date: '2024-01-15',
          category: 'Work',
        },
        {
          id: '2',
          type: 'expense',
          amount: 150,
          description: 'Groceries',
          date: '2024-01-14',
          category: 'Food',
        },
        {
          id: '3',
          type: 'expense',
          amount: 80,
          description: 'Gas',
          date: '2024-01-13',
          category: 'Transportation',
        },
      ];
      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const saveTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (editingTransaction) {
        // Update existing transaction
        const updatedTransactions = transactions.map(t => 
          t.id === editingTransaction.id 
            ? {
                ...t,
                type: newTransaction.type,
                amount: parseFloat(newTransaction.amount),
                description: newTransaction.description,
                category: newTransaction.category || 'Other',
              }
            : t
        );
        setTransactions(updatedTransactions);
      } else {
        // Add new transaction
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: newTransaction.type,
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          category: newTransaction.category || 'Other',
          date: new Date().toISOString().split('T')[0],
        };
        setTransactions([transaction, ...transactions]);
      }
      
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      type: transaction.type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
    });
    setModalVisible(true);
  };

  const deleteTransaction = (transactionId: string) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTransactions(transactions.filter(t => t.id !== transactionId));
          },
        },
      ]
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingTransaction(null);
    setNewTransaction({
      type: 'expense',
      amount: '',
      description: '',
      category: '',
    });
  };

  const saveAccount = async () => {
    if (!newAccount.name || !newAccount.bank || !newAccount.balance) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const account: Account = {
        id: Date.now().toString(),
        name: newAccount.name,
        type: newAccount.type,
        balance: parseFloat(newAccount.balance),
        bank: newAccount.bank,
      };
      
      setAccounts([account, ...accounts]);
      closeAccountModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
    }
  };

  const closeAccountModal = () => {
    setAccountModalVisible(false);
    setNewAccount({
      name: '',
      type: 'checking',
      balance: '',
      bank: '',
    });
  };

  const renderAccount = ({ item }: { item: Account }) => (
    <View style={styles.accountItem}>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{item.name}</Text>
        <Text style={styles.accountBank}>{item.bank}</Text>
        <Text style={styles.accountType}>{item.type.toUpperCase()}</Text>
      </View>
      <View style={styles.accountRight}>
        <Text
          style={[
            styles.accountBalance,
            { color: item.balance >= 0 ? '#4CAF50' : '#F44336' },
          ]}>
          ${Math.abs(item.balance).toFixed(2)}
        </Text>
        <View style={styles.accountActions}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionCategory}>{item.category}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionRight}>
        <Text
          style={[
            styles.transactionAmount,
            { color: item.type === 'income' ? '#4CAF50' : '#F44336' },
          ]}>
          {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
        </Text>
        <View style={styles.transactionActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => editTransaction(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteTransaction(item.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Finance</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            if (activeTab === 'accounts') {
              setAccountModalVisible(true);
            } else {
              setModalVisible(true);
            }
          }}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'accounts' && styles.activeTab]}
          onPress={() => setActiveTab('accounts')}>
          <Text style={[styles.tabText, activeTab === 'accounts' && styles.activeTabText]}>
            Accounts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'transactions' && styles.activeTab]}
          onPress={() => setActiveTab('transactions')}>
          <Text style={[styles.tabText, activeTab === 'transactions' && styles.activeTabText]}>
            Transactions
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'accounts' ? (
        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id}
          style={styles.list}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            </Text>

            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === 'income' && styles.activeTypeButton,
                ]}
                onPress={() =>
                  setNewTransaction({ ...newTransaction, type: 'income' })
                }>
                <Text
                  style={[
                    styles.typeButtonText,
                    newTransaction.type === 'income' && styles.activeTypeButtonText,
                  ]}>
                  Income
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  newTransaction.type === 'expense' && styles.activeTypeButton,
                ]}
                onPress={() =>
                  setNewTransaction({ ...newTransaction, type: 'expense' })
                }>
                <Text
                  style={[
                    styles.typeButtonText,
                    newTransaction.type === 'expense' && styles.activeTypeButtonText,
                  ]}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newTransaction.amount}
              onChangeText={amount =>
                setNewTransaction({ ...newTransaction, amount })
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTransaction.description}
              onChangeText={description =>
                setNewTransaction({ ...newTransaction, description })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newTransaction.category}
              onChangeText={category =>
                setNewTransaction({ ...newTransaction, category })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveTransaction}>
                <Text style={styles.saveButtonText}>
                  {editingTransaction ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={accountModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Account Name"
              value={newAccount.name}
              onChangeText={name => setNewAccount({ ...newAccount, name })}
            />

            <TextInput
              style={styles.input}
              placeholder="Bank Name"
              value={newAccount.bank}
              onChangeText={bank => setNewAccount({ ...newAccount, bank })}
            />

            <View style={styles.typeSelector}>
              {(['checking', 'savings', 'credit'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newAccount.type === type && styles.activeTypeButton,
                  ]}
                  onPress={() => setNewAccount({ ...newAccount, type })}>
                  <Text
                    style={[
                      styles.typeButtonText,
                      newAccount.type === type && styles.activeTypeButtonText,
                    ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Initial Balance"
              value={newAccount.balance}
              onChangeText={balance => setNewAccount({ ...newAccount, balance })}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeAccountModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveAccount}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transactionActions: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  accountItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  accountBank: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  accountType: {
    fontSize: 12,
    color: '#999',
  },
  accountRight: {
    alignItems: 'flex-end',
  },
  accountBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accountActions: {
    flexDirection: 'row',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeTypeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    color: '#666',
  },
  activeTypeButtonText: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButton: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FinanceScreen;