import React, { useState } from 'react';
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

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface Budget {
  id: string;
  name: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

const PlanningScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'goals' | 'budgets'>('goals');
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 6500,
      deadline: '2024-12-31',
      category: 'Savings',
    },
    {
      id: '2',
      title: 'Vacation to Europe',
      targetAmount: 5000,
      currentAmount: 2800,
      deadline: '2024-08-15',
      category: 'Travel',
    },
    {
      id: '3',
      title: 'New Car',
      targetAmount: 25000,
      currentAmount: 8500,
      deadline: '2025-06-30',
      category: 'Transportation',
    },
  ]);
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'Groceries',
      category: 'Food',
      limit: 800,
      spent: 650,
      period: 'monthly',
    },
    {
      id: '2',
      name: 'Entertainment',
      category: 'Leisure',
      limit: 300,
      spent: 280,
      period: 'monthly',
    },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    name: '',
    category: '',
    limit: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
  });

  const saveBudget = async () => {
    if (!newBudget.name || !newBudget.category || !newBudget.limit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (editingItem) {
        const updatedBudgets = budgets.map(b => 
          b.id === editingItem.id 
            ? {
                ...b,
                name: newBudget.name,
                category: newBudget.category,
                limit: parseFloat(newBudget.limit),
                period: newBudget.period,
              }
            : b
        );
        setBudgets(updatedBudgets);
      } else {
        const budget: Budget = {
          id: Date.now().toString(),
          name: newBudget.name,
          category: newBudget.category,
          limit: parseFloat(newBudget.limit),
          spent: 0,
          period: newBudget.period,
        };
        setBudgets([budget, ...budgets]);
      }
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to save budget');
    }
  };

  const editBudget = (budget: Budget) => {
    setEditingItem(budget);
    setNewBudget({
      name: budget.name,
      category: budget.category,
      limit: budget.limit.toString(),
      period: budget.period,
    });
    setModalVisible(true);
  };

  const deleteBudget = (budgetId: string) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setBudgets(budgets.filter(b => b.id !== budgetId)),
        },
      ]
    );
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingItem(null);
    setNewBudget({ name: '', category: '', limit: '', period: 'monthly' });
  };

  const renderGoal = ({ item }: { item: Goal }) => {
    const progress = item.currentAmount / item.targetAmount;
    const progressPercent = Math.min(progress * 100, 100);

    return (
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>{item.title}</Text>
          <Text style={styles.goalCategory}>{item.category}</Text>
        </View>
        
        <View style={styles.goalProgress}>
          <View style={styles.progressInfo}>
            <Text style={styles.currentAmount}>
              ${item.currentAmount.toLocaleString()}
            </Text>
            <Text style={styles.targetAmount}>
              of ${item.targetAmount.toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercent}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressPercent}>
              {progressPercent.toFixed(1)}%
            </Text>
          </View>
        </View>
        
        <Text style={styles.deadline}>
          Target: {new Date(item.deadline).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  const renderBudget = ({ item }: { item: Budget }) => {
    const progress = item.spent / item.limit;
    const progressPercent = Math.min(progress * 100, 100);
    const isOverBudget = item.spent > item.limit;

    return (
      <View style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Text style={styles.budgetName}>{item.name}</Text>
          <Text style={styles.budgetPeriod}>{item.period.toUpperCase()}</Text>
        </View>
        <Text style={styles.budgetCategory}>{item.category}</Text>
        <View style={styles.budgetProgress}>
          <View style={styles.progressInfo}>
            <Text style={[styles.spentAmount, isOverBudget && { color: '#F44336' }]}>
              ${item.spent.toLocaleString()}
            </Text>
            <Text style={styles.limitAmount}>
              of ${item.limit.toLocaleString()}
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${Math.min(progressPercent, 100)}%`,
                    backgroundColor: isOverBudget ? '#F44336' : '#4CAF50'
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressPercent, isOverBudget && { color: '#F44336' }]}>
              {progressPercent.toFixed(1)}%
            </Text>
          </View>
        </View>
        <View style={styles.budgetActions}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => editBudget(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => deleteBudget(item.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Planning</Text>
          {activeTab === 'budgets' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          )}
          {activeTab !== 'budgets' && <View style={styles.placeholder} />}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'goals' && styles.activeTab]}
          onPress={() => setActiveTab('goals')}>
          <Text style={[styles.tabText, activeTab === 'goals' && styles.activeTabText]}>
            Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'budgets' && styles.activeTab]}
          onPress={() => setActiveTab('budgets')}>
          <Text style={[styles.tabText, activeTab === 'budgets' && styles.activeTabText]}>
            Budgets
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'goals' ? (
        <FlatList
          data={goals}
          renderItem={renderGoal}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.goalsList}
        />
      ) : (
        <FlatList
          data={budgets}
          renderItem={renderBudget}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.budgetsList}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingItem ? 'Edit Budget' : 'Add Budget'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Budget Name"
              value={newBudget.name}
              onChangeText={name => setNewBudget({ ...newBudget, name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={newBudget.category}
              onChangeText={category => setNewBudget({ ...newBudget, category })}
            />
            <TextInput
              style={styles.input}
              placeholder="Budget Limit"
              value={newBudget.limit}
              onChangeText={limit => setNewBudget({ ...newBudget, limit })}
              keyboardType="numeric"
            />
            <View style={styles.periodSelector}>
              {(['weekly', 'monthly', 'yearly'] as const).map(period => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    newBudget.period === period && styles.activePeriodButton,
                  ]}
                  onPress={() => setNewBudget({ ...newBudget, period })}>
                  <Text
                    style={[
                      styles.periodButtonText,
                      newBudget.period === period && styles.activePeriodButtonText,
                    ]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveBudget}>
                <Text style={styles.saveButtonText}>
                  {editingItem ? 'Update' : 'Save'}
                </Text>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 60,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
    borderRadius: 8,
    padding: 4,
    marginBottom: 15,
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
  goalsList: {
    padding: 15,
  },
  budgetsList: {
    padding: 15,
  },
  goalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    marginBottom: 15,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  budgetName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  budgetPeriod: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  goalCategory: {
    fontSize: 14,
    color: '#666',
  },
  budgetCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  goalProgress: {
    marginBottom: 15,
  },
  budgetProgress: {
    marginBottom: 15,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  currentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  spentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  targetAmount: {
    fontSize: 14,
    color: '#666',
  },
  limitAmount: {
    fontSize: 14,
    color: '#666',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
  },
  deadline: {
    fontSize: 12,
    color: '#999',
  },
  budgetActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  periodSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  periodButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 5,
  },
  activePeriodButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  periodButtonText: {
    color: '#666',
  },
  activePeriodButtonText: {
    color: '#fff',
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

export default PlanningScreen;