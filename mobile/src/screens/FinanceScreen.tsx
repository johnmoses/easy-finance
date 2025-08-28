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
import { Picker } from '@react-native-picker/picker';
import { financeAPI } from '../services/api';
import DocumentPicker, { errorCodes, isErrorWithCode } from '@react-native-documents/picker';

interface Account {
  id: number; // Changed from string to number
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment'; // Added 'investment'
  balance: number;
  bank: string; // Keep for now, as it's used in UI
}

interface Transaction {
  id: number; // Changed from string to number
  transaction_type: 'income' | 'expense'; // Changed from 'type' to 'transaction_type'
  amount: number;
  description: string;
  date: string; // Keep as derived property for display
  category: string;
  account_id?: number; // Changed from string to number
}

const FinanceScreen = () => {
  const [uploading, setUploading] = useState(false);
  const [fileUploadModalVisible, setFileUploadModalVisible] = useState(false);
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
    account_id: '', // Added for backend compatibility
  });
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'checking' as 'checking' | 'savings' | 'credit' | 'investment',
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
        id: account.id,
        name: account.name,
        type: account.account_type as Account['type'],
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
      const data = await financeAPI.getTransactions();
      setTransactions(data.map((transaction: any) => ({
        id: transaction.id,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.timestamp ? transaction.timestamp.split('T')[0] : new Date().toISOString().split('T')[0],
        category: transaction.category,
        account_id: transaction.account_id,
      })));
    } catch (error) {
      console.error('Error loading transactions:', error);
      Alert.alert('Error', 'Failed to load transactions');
    }
  };

  const saveTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.description || !newTransaction.account_id) {
      Alert.alert('Error', 'Please fill in all fields and select an account');
      return;
    }

    try {
      if (editingTransaction) {
        // Update existing transaction
        // Note: Backend updateTransaction is not yet implemented in financeAPI,
        // so this part will still rely on local state for now or needs a new API call.
        // For now, we'll simulate update locally.
        const updatedTransactions = transactions.map(t => 
          t.id === editingTransaction.id 
            ? {
                ...t,
                transaction_type: newTransaction.type,
                amount: parseFloat(newTransaction.amount),
                description: newTransaction.description,
                category: newTransaction.category || 'Other',
                account_id: parseInt(newTransaction.account_id, 10),
              }
            : t
        );
        setTransactions(updatedTransactions);
        Alert.alert('Success', 'Transaction updated locally. Backend update not implemented.');
      } else {
        // Add new transaction
        const createdTransaction = await financeAPI.createTransaction({
          transaction_type: newTransaction.type, // Backend expects transaction_type
          amount: parseFloat(newTransaction.amount),
          description: newTransaction.description,
          category: newTransaction.category || 'Other',
          account_id: newTransaction.account_id ? parseInt(newTransaction.account_id, 10) : undefined,
          timestamp: new Date().toISOString(),
        });
        setTransactions([
          {
            id: createdTransaction.id,
            transaction_type: createdTransaction.transaction_type,
            amount: createdTransaction.amount,
            description: createdTransaction.description,
            date: createdTransaction.timestamp.split('T')[0],
            category: createdTransaction.category,
            account_id: createdTransaction.account_id,
          },
          ...transactions,
        ]);
        Alert.alert('Success', 'Transaction added successfully!');
      }
      
      closeModal();
      loadAccounts(); // Reload accounts to reflect balance changes
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert('Error', 'Failed to save transaction');
    }
  };

  const editTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setNewTransaction({
      type: transaction.transaction_type,
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category,
      account_id: transaction.account_id?.toString() || '',
    });
    setModalVisible(true);
  };

  const deleteTransaction = (transactionId: number) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await financeAPI.deleteTransaction(transactionId);
              setTransactions(transactions.filter(t => t.id !== transactionId));
              loadAccounts(); // Reload accounts to reflect balance changes
              Alert.alert('Success', 'Transaction deleted successfully!');
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert('Error', 'Failed to delete transaction');
            }
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
      account_id: '',
    });
  };

  const saveAccount = async () => {
    if (!newAccount.name || !newAccount.balance) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const createdAccount = await financeAPI.createAccount({
        name: newAccount.name,
        type: newAccount.type,
        balance: parseFloat(newAccount.balance),
      });

      setAccounts([
        {
          id: createdAccount.id,
          name: createdAccount.name,
          type: newAccount.type,
          balance: createdAccount.balance,
          bank: newAccount.bank,
        },
        ...accounts,
      ]);
      closeAccountModal();
      Alert.alert('Success', 'Account added successfully!');
    } catch (error) {
      console.error('Error creating account:', error);
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

  const handleFileUpload = async () => {
    if (!newTransaction.account_id) {
      Alert.alert('Error', 'Please select an account before uploading transactions.');
      return;
    }

    setUploading(true); // Start loading

    try {
      const [res] = await DocumentPicker.pick({
        type: ['*/*'], // Allow all file types for now
      });

      if (!res) {
        console.log('User cancelled file picker or no file selected.');
        return; // Exit if no file was selected
      }

      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );

      const formData = new FormData();
      formData.append('file', {
        uri: res.uri,
        type: res.type,
        name: res.name,
      } as any); // Cast to any to satisfy FormData.append type for RN file objects

      await financeAPI.uploadTransactions(formData, newTransaction.account_id); 

      Alert.alert('Success', 'Transactions uploaded successfully!');
      loadTransactions(); // Reload transactions after successful upload
      loadAccounts(); // Reload accounts to reflect balance changes

    } catch (err: any) {
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
        console.log('User cancelled file picker');
      } else {
        console.error('File upload error:', err);
        let errorMessage = 'Failed to upload transactions.';
        if (err.response && err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.message) {
          errorMessage = err.message;
        }
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setUploading(false); // End loading
    }
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
          ${typeof item.balance === 'number' ? Math.abs(item.balance).toFixed(2) : 'N/A'}
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
            { color: item.transaction_type === 'income' ? '#4CAF50' : '#F44336' },
          ]}>
          {item.transaction_type === 'income' ? '+' : '-'}${typeof item.amount === 'number' ? item.amount.toFixed(2) : 'N/A'}
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

      {activeTab === 'transactions' && (
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={() => setFileUploadModalVisible(true)} // Open file upload modal
          disabled={uploading} // Disable button when uploading
        >
          <Text style={styles.uploadButtonText}>
            {uploading ? 'Uploading...' : 'Upload Transactions'} {/* Change text based on loading state */}
          </Text>
        </TouchableOpacity>
      )}

      {activeTab === 'accounts' ? (
        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderTransaction}
          keyExtractor={item => item.id.toString()}
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

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTransaction.account_id}
                onValueChange={(itemValue: any) => setNewTransaction({ ...newTransaction, account_id: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="-- Select an Account --" value="" />
                {accounts.map(account => (
                  <Picker.Item key={account.id} label={account.name} value={account.id.toString()} />
                ))}
              </Picker>
            </View>

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
              {(['checking', 'savings', 'credit', 'investment'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newAccount.type === type && styles.activeTypeButton,
                  ]}
                  onPress={() => setNewAccount({ ...newAccount, type })} >
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

      {/* File Upload Modal */}
      <Modal visible={fileUploadModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Transactions</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newTransaction.account_id}
                onValueChange={(itemValue: any) => setNewTransaction({ ...newTransaction, account_id: itemValue })}
                style={styles.picker}
              >
                <Picker.Item label="-- Select an Account --" value="" />
                {accounts.map(account => (
                  <Picker.Item key={account.id} label={account.name} value={account.id.toString()} />
                ))}
              </Picker>
            </View>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleFileUpload}
              disabled={uploading || !newTransaction.account_id} // Disable if no account selected
            >
              <Text style={styles.uploadButtonText}>
                {uploading ? 'Uploading...' : 'Select File and Upload'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelButton, { marginTop: 10 }]} // Add some margin
              onPress={() => setFileUploadModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#666',
    paddingLeft: 10,
    paddingTop: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 15,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FinanceScreen;