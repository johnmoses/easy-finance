import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

interface Investment {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  currentValue: number;
  change: number;
  changePercent: number;
  type: 'stock' | 'crypto' | 'bond' | 'etf';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'info' | 'warning';
  timestamp: string;
  read: boolean;
}

const WealthScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'investments' | 'notifications'>('portfolio');
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    symbol: '',
    amount: '',
    currentValue: '',
    type: 'stock' as 'stock' | 'crypto' | 'bond' | 'etf',
  });

  useEffect(() => {
    loadInvestments();
    loadNotifications();
  }, []);

  const loadInvestments = async () => {
    // Mock data
    const mockInvestments: Investment[] = [
      {
        id: '1',
        name: 'Apple Inc.',
        symbol: 'AAPL',
        amount: 10,
        currentValue: 1500,
        change: 50,
        changePercent: 3.45,
        type: 'stock',
      },
      {
        id: '2',
        name: 'Tesla Inc.',
        symbol: 'TSLA',
        amount: 5,
        currentValue: 1200,
        change: -30,
        changePercent: -2.44,
        type: 'stock',
      },
      {
        id: '3',
        name: 'Bitcoin',
        symbol: 'BTC',
        amount: 0.5,
        currentValue: 2500,
        change: 100,
        changePercent: 4.17,
        type: 'crypto',
      },
    ];

    setInvestments(mockInvestments);
    const total = mockInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalChangeValue = mockInvestments.reduce((sum, inv) => sum + inv.change, 0);
    setTotalValue(total);
    setTotalChange(totalChangeValue);
  };

  const loadNotifications = async () => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Portfolio Alert',
        message: 'AAPL is up 5% today. Consider taking profits.',
        type: 'info',
        timestamp: '2024-01-15T10:30:00Z',
        read: false,
      },
      {
        id: '2',
        title: 'Market Warning',
        message: 'TSLA dropped 3%. Monitor your position.',
        type: 'warning',
        timestamp: '2024-01-15T09:15:00Z',
        read: false,
      },
      {
        id: '3',
        title: 'Dividend Payment',
        message: 'You received $25.50 in dividends.',
        type: 'info',
        timestamp: '2024-01-14T16:00:00Z',
        read: true,
      },
    ];
    setNotifications(mockNotifications);
  };

  const saveInvestment = async () => {
    if (!newInvestment.name || !newInvestment.symbol || !newInvestment.amount || !newInvestment.currentValue) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const investment: Investment = {
        id: Date.now().toString(),
        name: newInvestment.name,
        symbol: newInvestment.symbol.toUpperCase(),
        amount: parseFloat(newInvestment.amount),
        currentValue: parseFloat(newInvestment.currentValue),
        change: 0,
        changePercent: 0,
        type: newInvestment.type,
      };
      
      setInvestments([investment, ...investments]);
      closeModal();
    } catch (error) {
      Alert.alert('Error', 'Failed to add investment');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setNewInvestment({
      name: '',
      symbol: '',
      amount: '',
      currentValue: '',
      type: 'stock',
    });
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const renderInvestment = ({ item }: { item: Investment }) => (
    <View style={styles.investmentCard}>
      <View style={styles.investmentHeader}>
        <View>
          <Text style={styles.investmentName}>{item.name}</Text>
          <Text style={styles.investmentSymbol}>{item.symbol} • {item.type.toUpperCase()}</Text>
        </View>
        <View style={styles.investmentValues}>
          <Text style={styles.investmentValue}>
            ${item.currentValue.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.investmentChange,
              { color: item.change >= 0 ? '#4CAF50' : '#F44336' },
            ]}>
            {item.change >= 0 ? '+' : ''}${item.change.toFixed(2)} (
            {item.changePercent.toFixed(2)}%)
          </Text>
        </View>
      </View>
      <Text style={styles.investmentAmount}>
        {item.amount} {item.type === 'crypto' ? 'coins' : 'shares'}
      </Text>
    </View>
  );

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notificationCard, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}>
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationTime}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
      <View style={[styles.notificationBadge, { backgroundColor: 
        item.type === 'alert' ? '#F44336' : 
        item.type === 'warning' ? '#FF9500' : '#007AFF' 
      }]}>
        <Text style={styles.notificationBadgeText}>{item.type.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Wealth</Text>
          {activeTab === 'investments' && (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          )}
          {activeTab !== 'investments' && <View style={styles.placeholder} />}
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'portfolio' && styles.activeTab]}
          onPress={() => setActiveTab('portfolio')}>
          <Text style={[styles.tabText, activeTab === 'portfolio' && styles.activeTabText]}>
            Portfolio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'investments' && styles.activeTab]}
          onPress={() => setActiveTab('investments')}>
          <Text style={[styles.tabText, activeTab === 'investments' && styles.activeTabText]}>
            Investments
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notifications' && styles.activeTab]}
          onPress={() => setActiveTab('notifications')}>
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.activeTabText]}>
            Alerts ({notifications.filter(n => !n.read).length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'portfolio' && (
        <ScrollView>
            <View style={styles.totalContainer}>
              <Text style={styles.totalValue}>${totalValue.toFixed(2)}</Text>
              <Text
                style={[
                  styles.totalChange,
                  { color: totalChange >= 0 ? '#4CAF50' : '#F44336' },
                ]}>
                {totalChange >= 0 ? '+' : ''}${totalChange.toFixed(2)}
              </Text>
            </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Portfolio Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Investments:</Text>
              <Text style={styles.summaryValue}>{investments.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Best Performer:</Text>
              <Text style={styles.summaryValue}>
                {investments.find(inv => inv.changePercent === Math.max(...investments.map(i => i.changePercent)))?.symbol || 'N/A'}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Worst Performer:</Text>
              <Text style={styles.summaryValue}>
                {investments.find(inv => inv.changePercent === Math.min(...investments.map(i => i.changePercent)))?.symbol || 'N/A'}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {activeTab === 'investments' && (
        <FlatList
          data={investments}
          renderItem={renderInvestment}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.investmentsList}
        />
      )}

      {activeTab === 'notifications' && (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Investment</Text>

            <TextInput
              style={styles.input}
              placeholder="Investment Name"
              value={newInvestment.name}
              onChangeText={name => setNewInvestment({ ...newInvestment, name })}
            />

            <TextInput
              style={styles.input}
              placeholder="Symbol (e.g., AAPL)"
              value={newInvestment.symbol}
              onChangeText={symbol => setNewInvestment({ ...newInvestment, symbol })}
              autoCapitalize="characters"
            />

            <View style={styles.typeSelector}>
              {(['stock', 'crypto', 'bond', 'etf'] as const).map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    newInvestment.type === type && styles.activeTypeButton,
                  ]}
                  onPress={() => setNewInvestment({ ...newInvestment, type })}>
                  <Text
                    style={[
                      styles.typeButtonText,
                      newInvestment.type === type && styles.activeTypeButtonText,
                    ]}>
                    {type.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Amount/Shares"
              value={newInvestment.amount}
              onChangeText={amount => setNewInvestment({ ...newInvestment, amount })}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Current Value"
              value={newInvestment.currentValue}
              onChangeText={currentValue => setNewInvestment({ ...newInvestment, currentValue })}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveInvestment}>
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
  placeholder: {
    width: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  totalContainer: {
    alignItems: 'center',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  totalChange: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
  },
  investmentsList: {
    padding: 15,
  },
  investmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  investmentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  investmentSymbol: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  investmentValues: {
    alignItems: 'flex-end',
  },
  investmentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  investmentChange: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  investmentAmount: {
    fontSize: 12,
    color: '#999',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationsList: {
    padding: 15,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 2,
    borderRadius: 5,
  },
  activeTypeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeButtonText: {
    color: '#666',
    fontSize: 10,
  },
  activeTypeButtonText: {
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

export default WealthScreen;