import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
} from 'react-native';

interface Block {
  index: number;
  timestamp: string;
  data: string;
  hash: string;
  previousHash: string;
  nonce: number;
}

interface Wallet {
  id: string;
  name: string;
  address: string;
  currency: string;
  balance: number;
  network: string;
}

interface DeFiPosition {
  id: string;
  protocol: string;
  type: string;
  tokenPair: string;
  amount: number;
  apy: number;
  rewards: number;
}

interface NFT {
  id: string;
  name: string;
  collection: string;
  tokenId: string;
  purchasePrice: number;
  currentPrice: number;
  marketplace: string;
}

interface CryptoHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  currentPrice: number;
  totalValue: number;
  change24h: number;
}

const BlockchainScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'wallets' | 'defi' | 'nft' | 'crypto'>('wallets');
  const [blockchain, setBlockchain] = useState<Block[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([]);
  const [mining, setMining] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Mock data
    setWallets([
      {
        id: '1',
        name: 'Main Wallet',
        address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
        currency: 'ETH',
        balance: 2.5,
        network: 'Ethereum',
      },
      {
        id: '2',
        name: 'Trading Wallet',
        address: '0x532925a3b8D4C0532925a3b8D4C0742d35Cc6634',
        currency: 'BTC',
        balance: 0.15,
        network: 'Bitcoin',
      },
    ]);

    setDefiPositions([
      {
        id: '1',
        protocol: 'Uniswap V3',
        type: 'Liquidity Pool',
        tokenPair: 'ETH/USDC',
        amount: 1000,
        apy: 12.5,
        rewards: 25.3,
      },
      {
        id: '2',
        protocol: 'Aave',
        type: 'Lending',
        tokenPair: 'USDC',
        amount: 5000,
        apy: 8.2,
        rewards: 102.5,
      },
    ]);

    setNfts([
      {
        id: '1',
        name: 'Bored Ape #1234',
        collection: 'Bored Ape Yacht Club',
        tokenId: '1234',
        purchasePrice: 15.5,
        currentPrice: 18.2,
        marketplace: 'OpenSea',
      },
      {
        id: '2',
        name: 'CryptoPunk #5678',
        collection: 'CryptoPunks',
        tokenId: '5678',
        purchasePrice: 25.0,
        currentPrice: 22.8,
        marketplace: 'LooksRare',
      },
    ]);

    setCryptoHoldings([
      {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.15,
        currentPrice: 45000,
        totalValue: 6750,
        change24h: 2.5,
      },
      {
        id: '2',
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 2.5,
        currentPrice: 3200,
        totalValue: 8000,
        change24h: -1.2,
      },
    ]);
  };

  const openAddModal = () => {
    setNewItem({});
    setModalVisible(true);
  };

  const saveItem = async () => {
    try {
      const id = Date.now().toString();
      
      switch (activeTab) {
        case 'wallets':
          if (!newItem.name || !newItem.address) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
          }
          setWallets([{ ...newItem, id, balance: 0 }, ...wallets]);
          break;
        case 'defi':
          if (!newItem.protocol || !newItem.amount) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
          }
          setDefiPositions([{ ...newItem, id, rewards: 0 }, ...defiPositions]);
          break;
        case 'nft':
          if (!newItem.name || !newItem.collection) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
          }
          setNfts([{ ...newItem, id }, ...nfts]);
          break;
        case 'crypto':
          if (!newItem.symbol || !newItem.amount) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
          }
          setCryptoHoldings([{ ...newItem, id, totalValue: newItem.amount * (newItem.currentPrice || 0) }, ...cryptoHoldings]);
          break;
      }
      
      setModalVisible(false);
      setNewItem({});
    } catch (error) {
      Alert.alert('Error', 'Failed to save item');
    }
  };

  const renderWallet = ({ item }: { item: Wallet }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemNetwork}>{item.network}</Text>
      </View>
      <Text style={styles.itemAddress}>{item.address}</Text>
      <View style={styles.itemFooter}>
        <Text style={styles.itemBalance}>{item.balance} {item.currency}</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDeFi = ({ item }: { item: DeFiPosition }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.protocol}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
      </View>
      <Text style={styles.itemPair}>{item.tokenPair}</Text>
      <View style={styles.itemStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Amount</Text>
          <Text style={styles.statValue}>${item.amount.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>APY</Text>
          <Text style={styles.statValue}>{item.apy}%</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Rewards</Text>
          <Text style={styles.statValue}>${item.rewards.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  const renderNFT = ({ item }: { item: NFT }) => {
    const profitLoss = item.currentPrice - item.purchasePrice;
    const profitLossPercent = ((profitLoss / item.purchasePrice) * 100);

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <Text style={styles.itemMarketplace}>{item.marketplace}</Text>
        </View>
        <Text style={styles.itemCollection}>{item.collection}</Text>
        <View style={styles.itemStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Purchase</Text>
            <Text style={styles.statValue}>{item.purchasePrice} ETH</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Current</Text>
            <Text style={styles.statValue}>{item.currentPrice} ETH</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>P&L</Text>
            <Text style={[styles.statValue, { color: profitLoss >= 0 ? '#4CAF50' : '#F44336' }]}>
              {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} ETH ({profitLossPercent.toFixed(1)}%)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCrypto = ({ item }: { item: CryptoHolding }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.symbol}</Text>
        <Text style={[styles.itemChange, { color: item.change24h >= 0 ? '#4CAF50' : '#F44336' }]}>
          {item.change24h >= 0 ? '+' : ''}{item.change24h.toFixed(2)}%
        </Text>
      </View>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Amount</Text>
          <Text style={styles.statValue}>{item.amount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Price</Text>
          <Text style={styles.statValue}>${item.currentPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Value</Text>
          <Text style={styles.statValue}>${item.totalValue.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );

  const renderModalContent = () => {
    switch (activeTab) {
      case 'wallets':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Wallet Name"
              value={newItem.name || ''}
              onChangeText={name => setNewItem({ ...newItem, name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Wallet Address"
              value={newItem.address || ''}
              onChangeText={address => setNewItem({ ...newItem, address })}
            />
            <TextInput
              style={styles.input}
              placeholder="Currency (e.g., ETH, BTC)"
              value={newItem.currency || ''}
              onChangeText={currency => setNewItem({ ...newItem, currency })}
            />
            <TextInput
              style={styles.input}
              placeholder="Network"
              value={newItem.network || ''}
              onChangeText={network => setNewItem({ ...newItem, network })}
            />
          </>
        );
      case 'defi':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Protocol (e.g., Uniswap, Aave)"
              value={newItem.protocol || ''}
              onChangeText={protocol => setNewItem({ ...newItem, protocol })}
            />
            <TextInput
              style={styles.input}
              placeholder="Position Type"
              value={newItem.type || ''}
              onChangeText={type => setNewItem({ ...newItem, type })}
            />
            <TextInput
              style={styles.input}
              placeholder="Token Pair"
              value={newItem.tokenPair || ''}
              onChangeText={tokenPair => setNewItem({ ...newItem, tokenPair })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newItem.amount || ''}
              onChangeText={amount => setNewItem({ ...newItem, amount: parseFloat(amount) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="APY (%)"
              value={newItem.apy || ''}
              onChangeText={apy => setNewItem({ ...newItem, apy: parseFloat(apy) || 0 })}
              keyboardType="numeric"
            />
          </>
        );
      case 'nft':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="NFT Name"
              value={newItem.name || ''}
              onChangeText={name => setNewItem({ ...newItem, name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Collection"
              value={newItem.collection || ''}
              onChangeText={collection => setNewItem({ ...newItem, collection })}
            />
            <TextInput
              style={styles.input}
              placeholder="Token ID"
              value={newItem.tokenId || ''}
              onChangeText={tokenId => setNewItem({ ...newItem, tokenId })}
            />
            <TextInput
              style={styles.input}
              placeholder="Purchase Price (ETH)"
              value={newItem.purchasePrice || ''}
              onChangeText={purchasePrice => setNewItem({ ...newItem, purchasePrice: parseFloat(purchasePrice) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Current Price (ETH)"
              value={newItem.currentPrice || ''}
              onChangeText={currentPrice => setNewItem({ ...newItem, currentPrice: parseFloat(currentPrice) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Marketplace"
              value={newItem.marketplace || ''}
              onChangeText={marketplace => setNewItem({ ...newItem, marketplace })}
            />
          </>
        );
      case 'crypto':
        return (
          <>
            <TextInput
              style={styles.input}
              placeholder="Symbol (e.g., BTC, ETH)"
              value={newItem.symbol || ''}
              onChangeText={symbol => setNewItem({ ...newItem, symbol })}
            />
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newItem.name || ''}
              onChangeText={name => setNewItem({ ...newItem, name })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newItem.amount || ''}
              onChangeText={amount => setNewItem({ ...newItem, amount: parseFloat(amount) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Current Price ($)"
              value={newItem.currentPrice || ''}
              onChangeText={currentPrice => setNewItem({ ...newItem, currentPrice: parseFloat(currentPrice) || 0 })}
              keyboardType="numeric"
            />
          </>
        );
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'wallets': return wallets;
      case 'defi': return defiPositions;
      case 'nft': return nfts;
      case 'crypto': return cryptoHoldings;
      default: return [];
    }
  };

  const getCurrentRenderer = () => {
    switch (activeTab) {
      case 'wallets': return renderWallet;
      case 'defi': return renderDeFi;
      case 'nft': return renderNFT;
      case 'crypto': return renderCrypto;
      default: return renderWallet;
    }
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
          <Text style={styles.title}>Blockchain</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {(['wallets', 'defi', 'nft', 'crypto'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={getCurrentData()}
        renderItem={getCurrentRenderer()}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Text>
            {renderModalContent()}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveItem}>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
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
  list: {
    padding: 15,
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemNetwork: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  itemType: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  itemMarketplace: {
    fontSize: 12,
    color: '#FF9500',
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  itemChange: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemAddress: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  itemPair: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemCollection: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemBalance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  itemStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#999',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  actionButtonText: {
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
    maxHeight: '80%',
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

export default BlockchainScreen;