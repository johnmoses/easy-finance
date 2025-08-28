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
import { blockchainAPI } from '../services/api';
import { CryptoWallet, DeFiPosition, NFTCollection, CryptoTransaction } from '../types';

const BlockchainScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'wallets' | 'defi' | 'nft' | 'crypto'>('wallets');
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([]);
  const [nfts, setNfts] = useState<NFTCollection[]>([]);
  const [cryptoTransactions, setCryptoTransactions] = useState<CryptoTransaction[]>([]);
  const [activeData, setActiveData] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<any>({});

  useEffect(() => {
    loadData();
  }, [activeTab]);

  useEffect(() => {
    switch (activeTab) {
      case 'wallets':
        setActiveData(wallets);
        break;
      case 'defi':
        setActiveData(defiPositions);
        break;
      case 'nft':
        setActiveData(nfts);
        break;
      case 'crypto':
        setActiveData(cryptoTransactions);
        break;
      default:
        setActiveData([]);
    }
  }, [activeTab, wallets, defiPositions, nfts, cryptoTransactions]);

  const loadData = async () => {
    try {
      switch (activeTab) {
        case 'wallets':
          const walletsData = await blockchainAPI.getWallets();
          setWallets(walletsData);
          break;
        case 'defi':
          const defiData = await blockchainAPI.getDeFiPositions();
          if (defiData.length === 0) {
            Alert.alert('No Data', 'No DeFi positions found.');
          }
          setDefiPositions(defiData);
          break;
        case 'nft':
          const nftData = await blockchainAPI.getNFTs();
          setNfts(nftData);
          break;
        case 'crypto':
          const cryptoData = await blockchainAPI.getCryptoTransactions();
          if (cryptoData.length === 0) {
            Alert.alert('No Data', 'No crypto transactions found.');
          }
          setCryptoTransactions(cryptoData);
          break;
      }
    } catch (error) {
      Alert.alert('Error', `Failed to load ${activeTab}`);
    }
  };

  const openAddModal = () => {
    setNewItem({});
    setModalVisible(true);
  };

  const saveItem = async () => {
    try {
      switch (activeTab) {
        case 'wallets':
          await blockchainAPI.createWallet(newItem);
          break;
        case 'defi':
          await blockchainAPI.createDeFiPosition(newItem);
          break;
        case 'nft':
          await blockchainAPI.addNFT(newItem);
          break;
        case 'crypto':
          await blockchainAPI.createCryptoTransaction(newItem);
          break;
      }
      loadData();
      setModalVisible(false);
      setNewItem({});
    } catch (error) {
      Alert.alert('Error', 'Failed to save item');
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (activeTab) {
      case 'wallets':
        return renderWallet({ item });
      case 'defi':
        return renderDeFi({ item });
      case 'nft':
        return renderNFT({ item });
      case 'crypto':
        return renderCrypto({ item });
      default:
        return null;
    }
  };

  const renderWallet = ({ item }: { item: CryptoWallet }) => (
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

  const renderDeFi = ({ item }: { item: DeFiPosition }) => {
    if (!item.amount_deposited) {
      return <View />;
    }
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.protocol}</Text>
          <Text style={styles.itemType}>{item.position_type}</Text>
        </View>
        <Text style={styles.itemPair}>{item.token_pair}</Text>
        <View style={styles.itemStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Amount</Text>
            <Text style={styles.statValue}>${item.amount_deposited.toLocaleString()}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>APY</Text>
            <Text style={styles.statValue}>{item.apy}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Rewards</Text>
            <Text style={styles.statValue}>${item.rewards_earned.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderNFT = ({ item }: { item: NFTCollection }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.name}</Text>
        <Text style={styles.itemMarketplace}>{item.marketplace}</Text>
      </View>
      <Text style={styles.itemCollection}>{item.contract_address}</Text>
      <View style={styles.itemStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Purchase</Text>
          <Text style={styles.statValue}>{item.purchase_price} {item.currency}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>{item.current_price} {item.currency}</Text>
        </View>
      </View>
    </View>
  );

  const renderCrypto = ({ item }: { item: CryptoTransaction }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.tx_hash}</Text>
        <Text style={styles.itemChange}>{item.status}</Text>
      </View>
      <Text style={styles.itemName}>{item.from_address} {"->"} {item.to_address}</Text>
      <View style={styles.itemStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Amount</Text>
          <Text style={styles.statValue}>{item.amount} {item.currency}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Gas Fee</Text>
          <Text style={styles.statValue}>{item.gas_fee}</Text>
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
              value={newItem.position_type || ''}
              onChangeText={type => setNewItem({ ...newItem, position_type: type })}
            />
            <TextInput
              style={styles.input}
              placeholder="Token Pair"
              value={newItem.token_pair || ''}
              onChangeText={tokenPair => setNewItem({ ...newItem, token_pair: tokenPair })}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount Deposited"
              value={newItem.amount_deposited || ''}
              onChangeText={amount => setNewItem({ ...newItem, amount_deposited: parseFloat(amount) || 0 })}
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
              placeholder="Contract Address"
              value={newItem.contract_address || ''}
              onChangeText={collection => setNewItem({ ...newItem, contract_address: collection })}
            />
            <TextInput
              style={styles.input}
              placeholder="Token ID"
              value={newItem.token_id || ''}
              onChangeText={tokenId => setNewItem({ ...newItem, token_id: tokenId })}
            />
            <TextInput
              style={styles.input}
              placeholder="Purchase Price (ETH)"
              value={newItem.purchase_price || ''}
              onChangeText={purchasePrice => setNewItem({ ...newItem, purchase_price: parseFloat(purchasePrice) || 0 })}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Currency"
              value={newItem.currency || ''}
              onChangeText={currency => setNewItem({ ...newItem, currency })}
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
              placeholder="From Address"
              value={newItem.from_address || ''}
              onChangeText={fromAddress => setNewItem({ ...newItem, from_address: fromAddress })}
            />
            <TextInput
              style={styles.input}
              placeholder="To Address"
              value={newItem.to_address || ''}
              onChangeText={toAddress => setNewItem({ ...newItem, to_address: toAddress })}
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
              placeholder="Currency"
              value={newItem.currency || ''}
              onChangeText={currency => setNewItem({ ...newItem, currency })}
            />
          </>
        );
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
        data={activeData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
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