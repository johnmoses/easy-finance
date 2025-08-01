'use client';
import { useEffect, useState } from 'react';
import { blockchainService } from '../../xlib/services';
import { Shield, Coins, TrendingUp, Plus, Wallet, Zap, Image, BarChart3 } from 'lucide-react';

interface CryptoWallet {
  id: number;
  name: string;
  address: string;
  balance: number;
  currency: string;
}

interface DeFiPosition {
  id: number;
  protocol: string;
  position_type: string;
  token_pair: string;
  amount_deposited: number;
  current_value: number;
  apy: number;
  rewards_earned: number;
}

interface NFT {
  id: number;
  name: string;
  contract_address: string;
  token_id: string;
  purchase_price: number;
  current_price: number;
  currency: string;
  marketplace: string;
}

interface CryptoHolding {
  id: number;
  symbol: string;
  name: string;
  amount: number;
  purchase_price: number;
  current_price: number;
}

export default function Blockchain() {
  const [wallets, setWallets] = useState<CryptoWallet[]>([]);
  const [defiPositions, setDefiPositions] = useState<DeFiPosition[]>([]);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [cryptoHoldings, setCryptoHoldings] = useState<CryptoHolding[]>([]);
  const [activeTab, setActiveTab] = useState<'wallets' | 'defi' | 'nft' | 'crypto'>('wallets');
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [showDefiForm, setShowDefiForm] = useState(false);
  const [showNftForm, setShowNftForm] = useState(false);
  const [showCryptoForm, setShowCryptoForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [walletsRes, defiRes, nftsRes] = await Promise.all([
        blockchainService.getWallets().catch(() => ({ data: [] })),
        // Mock DeFi data
        Promise.resolve({ data: [
          { id: 1, protocol: 'Uniswap V3', position_type: 'Liquidity Pool', token_pair: 'ETH/USDC', amount_deposited: 5000, current_value: 5250, apy: 12.5, rewards_earned: 125 },
          { id: 2, protocol: 'Aave', position_type: 'Lending', token_pair: 'USDC', amount_deposited: 10000, current_value: 10200, apy: 8.2, rewards_earned: 200 }
        ] }),
        // Mock NFT data
        Promise.resolve({ data: [
          { id: 1, name: 'CryptoPunk #1234', contract_address: '0x...', token_id: '1234', purchase_price: 2.5, current_price: 3.2, currency: 'ETH', marketplace: 'OpenSea' },
          { id: 2, name: 'Bored Ape #5678', contract_address: '0x...', token_id: '5678', purchase_price: 15, current_price: 12.8, currency: 'ETH', marketplace: 'OpenSea' }
        ] })
      ]);
      
      setWallets(walletsRes.data);
      setDefiPositions(defiRes.data);
      setNfts(nftsRes.data);
      
      // Mock crypto holdings
      setCryptoHoldings([
        { id: 1, symbol: 'BTC', name: 'Bitcoin', amount: 0.5, purchase_price: 45000, current_price: 52000 },
        { id: 2, symbol: 'ETH', name: 'Ethereum', amount: 2.3, purchase_price: 2800, current_price: 3200 },
        { id: 3, symbol: 'ADA', name: 'Cardano', amount: 1000, purchase_price: 1.2, current_price: 1.45 }
      ]);
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (formData: any) => {
    try {
      await blockchainService.createWallet(formData);
      fetchData();
      setShowWalletForm(false);
    } catch (error) {
      console.error('Failed to create wallet:', error);
    }
  };

  const createDefiPosition = async (formData: any) => {
    try {
      const newPosition = { id: Date.now(), rewards_earned: 0, ...formData };
      setDefiPositions(prev => [...prev, newPosition]);
      setShowDefiForm(false);
    } catch (error) {
      console.error('Failed to create DeFi position:', error);
    }
  };

  const createNft = async (formData: any) => {
    try {
      const newNft = { id: Date.now(), ...formData };
      setNfts(prev => [...prev, newNft]);
      setShowNftForm(false);
    } catch (error) {
      console.error('Failed to add NFT:', error);
    }
  };

  const createCryptoHolding = async (formData: any) => {
    try {
      const newHolding = { id: Date.now(), ...formData };
      setCryptoHoldings(prev => [...prev, newHolding]);
      setShowCryptoForm(false);
    } catch (error) {
      console.error('Failed to add crypto holding:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
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

  const totalWalletValue = wallets.reduce((sum, wallet) => sum + (wallet?.balance || 0), 0);
  const totalDefiValue = defiPositions.reduce((sum, pos) => sum + (pos?.current_value || 0), 0);
  const totalNftValue = nfts.reduce((sum, nft) => sum + (nft?.current_price || 0), 0);
  const totalCryptoValue = cryptoHoldings.reduce((sum, holding) => sum + ((holding?.amount || 0) * (holding?.current_price || 0)), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Blockchain & Crypto</h1>
          <p className="text-gray-600">Manage your digital assets, DeFi positions, and NFT collection</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Wallets</p>
                <p className="text-3xl font-bold">{wallets.length}</p>
                <p className="text-purple-200 text-xs">${totalWalletValue.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Wallet className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">DeFi Value</p>
                <p className="text-3xl font-bold">${totalDefiValue.toLocaleString()}</p>
                <p className="text-green-200 text-xs">{defiPositions.length} positions</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Zap className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium mb-1">NFT Value</p>
                <p className="text-3xl font-bold">{totalNftValue.toFixed(1)} ETH</p>
                <p className="text-pink-200 text-xs">{nfts.length} items</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <Image className="h-8 w-8" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-xl shadow-lg text-white hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Crypto Value</p>
                <p className="text-3xl font-bold">${totalCryptoValue.toLocaleString()}</p>
                <p className="text-orange-200 text-xs">{cryptoHoldings.length} holdings</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <BarChart3 className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('wallets')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'wallets'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Wallet className="h-5 w-5 inline mr-2" />
              Wallets ({wallets.length})
            </button>
            <button
              onClick={() => setActiveTab('defi')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'defi'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Zap className="h-5 w-5 inline mr-2" />
              DeFi ({defiPositions.length})
            </button>
            <button
              onClick={() => setActiveTab('nft')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'nft'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Image className="h-5 w-5 inline mr-2" />
              NFT ({nfts.length})
            </button>
            <button
              onClick={() => setActiveTab('crypto')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'crypto'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Coins className="h-5 w-5 inline mr-2" />
              Crypto ({cryptoHoldings.length})
            </button>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                {activeTab === 'wallets' ? 'Crypto Wallets' :
                 activeTab === 'defi' ? 'DeFi Positions' :
                 activeTab === 'nft' ? 'NFT Collection' : 'Crypto Holdings'}
              </h2>
              <div className="space-x-3">
                {activeTab === 'wallets' && (
                  <button
                    onClick={() => setShowWalletForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Wallet</span>
                  </button>
                )}
                {activeTab === 'defi' && (
                  <button
                    onClick={() => setShowDefiForm(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Position</span>
                  </button>
                )}
                {activeTab === 'nft' && (
                  <button
                    onClick={() => setShowNftForm(true)}
                    className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-pink-700 hover:to-rose-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add NFT</span>
                  </button>
                )}
                {activeTab === 'crypto' && (
                  <button
                    onClick={() => setShowCryptoForm(true)}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-amber-700 flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Crypto</span>
                  </button>
                )}
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'wallets' ? (
              <div className="space-y-4">
                {wallets.length === 0 ? (
                  <div className="text-center py-12">
                    <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No wallets found</p>
                    <p className="text-gray-400">Create your first crypto wallet</p>
                  </div>
                ) : (
                  wallets.map((wallet) => (
                    <div key={wallet.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="bg-purple-100 p-3 rounded-lg">
                            <Wallet className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-slate-800">{wallet.name}</h4>
                            <p className="text-gray-600 font-mono text-sm">
                              {wallet.address?.slice(0, 10)}...{wallet.address?.slice(-10)}
                            </p>
                            <p className="text-sm text-gray-500">{wallet.currency}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-slate-800">
                            {(wallet?.balance || 0).toFixed(8)} {wallet.currency}
                          </p>
                          <div className="flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+2.5%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'defi' ? (
              <div className="space-y-4">
                {defiPositions.length === 0 ? (
                  <div className="text-center py-12">
                    <Zap className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No DeFi positions found</p>
                    <p className="text-gray-400">Start earning with DeFi protocols</p>
                  </div>
                ) : (
                  defiPositions.map((position) => (
                    <div key={position.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="bg-green-100 p-3 rounded-lg">
                            <Zap className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-slate-800">{position.protocol}</h4>
                            <p className="text-gray-600">{position.position_type} • {position.token_pair}</p>
                            <p className="text-sm text-gray-500">APY: {position.apy}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-xl text-slate-800">
                            ${(position?.current_value || 0).toLocaleString()}
                          </p>
                          <p className="text-sm text-green-600">+${(position?.rewards_earned || 0).toLocaleString()} earned</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === 'nft' ? (
              <div className="space-y-4">
                {nfts.length === 0 ? (
                  <div className="text-center py-12">
                    <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No NFTs found</p>
                    <p className="text-gray-400">Add your NFT collection</p>
                  </div>
                ) : (
                  nfts.map((nft) => {
                    const profitLoss = (nft?.current_price || 0) - (nft?.purchase_price || 0);
                    return (
                      <div key={nft.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="bg-pink-100 p-3 rounded-lg">
                              <Image className="h-6 w-6 text-pink-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-slate-800">{nft.name}</h4>
                              <p className="text-gray-600">{nft.marketplace}</p>
                              <p className="text-sm text-gray-500">Token ID: {nft.token_id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-slate-800">
                              {(nft?.current_price || 0).toFixed(2)} {nft.currency}
                            </p>
                            <p className={`text-sm font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)} {nft.currency}
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
                {cryptoHoldings.length === 0 ? (
                  <div className="text-center py-12">
                    <Coins className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No crypto holdings found</p>
                    <p className="text-gray-400">Add your cryptocurrency portfolio</p>
                  </div>
                ) : (
                  cryptoHoldings.map((holding) => {
                    const totalValue = (holding?.amount || 0) * (holding?.current_price || 0);
                    const profitLoss = ((holding?.current_price || 0) - (holding?.purchase_price || 0)) * (holding?.amount || 0);
                    return (
                      <div key={holding.id} className="p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="bg-orange-100 p-3 rounded-lg">
                              <Coins className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-slate-800">{holding.name}</h4>
                              <p className="text-gray-600">{holding.symbol} • {(holding?.amount || 0).toFixed(4)} coins</p>
                              <p className="text-sm text-gray-500">${(holding?.current_price || 0).toLocaleString()}/coin</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-slate-800">
                              ${totalValue.toLocaleString()}
                            </p>
                            <p className={`text-sm font-medium ${profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Form Modal */}
        {showWalletForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-slate-800">Add New Wallet</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createWallet({
                  name: formData.get('name'),
                  address: formData.get('address'),
                  balance: parseFloat(formData.get('balance') as string) || 0,
                  currency: formData.get('currency')
                });
              }}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g., My Bitcoin Wallet" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
                    <input name="address" type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm" placeholder="0x..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select name="currency" required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Select currency</option>
                      <option value="BTC">Bitcoin (BTC)</option>
                      <option value="ETH">Ethereum (ETH)</option>
                      <option value="ADA">Cardano (ADA)</option>
                      <option value="DOT">Polkadot (DOT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Initial Balance</label>
                    <input name="balance" type="number" step="0.00000001" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="0.00000000" />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                  <button type="button" onClick={() => setShowWalletForm(false)} className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium transition-all duration-300">
                    Add Wallet
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Additional modals for other forms would go here */}
      </div>
    </div>
  );
}