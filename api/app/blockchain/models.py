from app.extensions import db
from datetime import datetime
import hashlib
import json

class CryptoWallet(db.Model):
    __tablename__ = "crypto_wallets"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    currency = db.Column(db.String(10), nullable=False)  # BTC, ETH, USDC
    balance = db.Column(db.Float, default=0.0)
    network = db.Column(db.String(20), default='mainnet')  # mainnet, testnet
    wallet_type = db.Column(db.String(20), default='hot')  # hot, cold, hardware
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class DeFiPosition(db.Model):
    __tablename__ = "defi_positions"
    id = db.Column(db.Integer, primary_key=True)
    protocol = db.Column(db.String(50), nullable=False)  # Uniswap, Aave, Compound
    position_type = db.Column(db.String(20), nullable=False)  # liquidity, lending, staking
    token_pair = db.Column(db.String(20))  # ETH/USDC, BTC/ETH
    amount_deposited = db.Column(db.Float, nullable=False)
    current_value = db.Column(db.Float, default=0.0)
    apy = db.Column(db.Float, default=0.0)  # Annual Percentage Yield
    rewards_earned = db.Column(db.Float, default=0.0)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    wallet_id = db.Column(db.Integer, db.ForeignKey('crypto_wallets.id'), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    @property
    def profit_loss(self):
        return self.current_value - self.amount_deposited + self.rewards_earned

class NFTCollection(db.Model):
    __tablename__ = "nft_collections"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contract_address = db.Column(db.String(100), nullable=False)
    token_id = db.Column(db.String(50), nullable=False)
    purchase_price = db.Column(db.Float, default=0.0)
    current_price = db.Column(db.Float, default=0.0)
    currency = db.Column(db.String(10), default='ETH')
    marketplace = db.Column(db.String(50))  # OpenSea, Rarible
    metadata_url = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    wallet_id = db.Column(db.Integer, db.ForeignKey('crypto_wallets.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Block(db.Model):
    __tablename__ = "blocks"
    id = db.Column(db.Integer, primary_key=True)
    index = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    data = db.Column(db.Text, nullable=False)  # JSON string of transactions
    previous_hash = db.Column(db.String(64), nullable=False)
    hash = db.Column(db.String(64), nullable=False)
    nonce = db.Column(db.Integer, default=0)
    difficulty = db.Column(db.Integer, default=4)
    mined_by = db.Column(db.String(100), nullable=True)
    reward = db.Column(db.Float, default=0.0)
    
    def calculate_hash(self):
        block_string = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}{self.nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def mine_block(self, difficulty=4):
        target = "0" * difficulty
        if self.nonce is None:
            self.nonce = 0
        self.hash = self.calculate_hash()  # Initialize hash
        while not self.hash.startswith(target):
            self.nonce += 1
            self.hash = self.calculate_hash()

class CryptoTransaction(db.Model):
    __tablename__ = "crypto_transactions"
    id = db.Column(db.Integer, primary_key=True)
    tx_hash = db.Column(db.String(100), unique=True, nullable=False)
    from_address = db.Column(db.String(100), nullable=False)
    to_address = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    gas_fee = db.Column(db.Float, default=0.0)
    block_number = db.Column(db.Integer)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, failed
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    wallet_id = db.Column(db.Integer, db.ForeignKey('crypto_wallets.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)