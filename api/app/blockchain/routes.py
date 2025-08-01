from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.blockchain.models import CryptoWallet, DeFiPosition, NFTCollection, Block, CryptoTransaction
from app.extensions import db
import hashlib
import json
from datetime import datetime

blockchain_bp = Blueprint("blockchain", __name__)

# ===== CRYPTO WALLETS =====
@blockchain_bp.route("/wallets", methods=["GET"])
@jwt_required()
def get_wallets():
    user_id = get_jwt_identity()
    wallets = CryptoWallet.query.filter_by(user_id=user_id, is_active=True).all()
    results = [{
        "id": w.id,
        "name": w.name,
        "address": w.address,
        "currency": w.currency,
        "balance": w.balance,
        "network": w.network,
        "wallet_type": w.wallet_type
    } for w in wallets]
    return jsonify(results)

@blockchain_bp.route("/wallets", methods=["POST"])
@jwt_required()
def create_wallet():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    wallet = CryptoWallet(
        name=data.get("name"),
        address=data.get("address"),
        currency=data.get("currency"),
        network=data.get("network", "mainnet"),
        wallet_type=data.get("wallet_type", "hot"),
        user_id=get_jwt_identity()
    )
    
    try:
        db.session.add(wallet)
        db.session.commit()
        return jsonify({"id": wallet.id, "message": "Wallet created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create wallet"}), 500

# ===== DEFI POSITIONS =====
@blockchain_bp.route("/defi", methods=["GET"])
@jwt_required()
def get_defi_positions():
    user_id = get_jwt_identity()
    positions = DeFiPosition.query.filter_by(user_id=user_id, is_active=True).all()
    results = [{
        "id": pos.id,
        "protocol": pos.protocol,
        "position_type": pos.position_type,
        "token_pair": pos.token_pair,
        "amount_deposited": pos.amount_deposited,
        "current_value": pos.current_value,
        "apy": pos.apy,
        "rewards_earned": pos.rewards_earned,
        "profit_loss": pos.profit_loss
    } for pos in positions]
    return jsonify(results)

@blockchain_bp.route("/defi", methods=["POST"])
@jwt_required()
def create_defi_position():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    position = DeFiPosition(
        protocol=data.get("protocol"),
        position_type=data.get("position_type"),
        token_pair=data.get("token_pair"),
        amount_deposited=data.get("amount_deposited"),
        current_value=data.get("current_value", data.get("amount_deposited")),
        apy=data.get("apy", 0.0),
        user_id=get_jwt_identity(),
        wallet_id=data.get("wallet_id")
    )
    
    try:
        db.session.add(position)
        db.session.commit()
        return jsonify({"id": position.id, "message": "DeFi position created"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create DeFi position"}), 500

@blockchain_bp.route("/defi/yield-opportunities", methods=["GET"])
@jwt_required()
def yield_opportunities():
    # Mock yield farming opportunities
    opportunities = [
        {"protocol": "Uniswap V3", "pair": "ETH/USDC", "apy": 12.5, "risk": "medium"},
        {"protocol": "Aave", "asset": "USDC", "apy": 8.2, "risk": "low"},
        {"protocol": "Compound", "asset": "ETH", "apy": 6.8, "risk": "low"},
        {"protocol": "Curve", "pair": "3CRV", "apy": 15.3, "risk": "medium"},
        {"protocol": "Yearn", "vault": "yvUSDC", "apy": 9.7, "risk": "medium"}
    ]
    return jsonify(opportunities)

# ===== NFT COLLECTION =====
@blockchain_bp.route("/nfts", methods=["GET"])
@jwt_required()
def get_nfts():
    user_id = get_jwt_identity()
    nfts = NFTCollection.query.filter_by(user_id=user_id).all()
    results = [{
        "id": nft.id,
        "name": nft.name,
        "contract_address": nft.contract_address,
        "token_id": nft.token_id,
        "purchase_price": nft.purchase_price,
        "current_price": nft.current_price,
        "currency": nft.currency,
        "marketplace": nft.marketplace,
        "profit_loss": nft.current_price - nft.purchase_price
    } for nft in nfts]
    return jsonify(results)

@blockchain_bp.route("/nfts", methods=["POST"])
@jwt_required()
def add_nft():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    nft = NFTCollection(
        name=data.get("name"),
        contract_address=data.get("contract_address"),
        token_id=data.get("token_id"),
        purchase_price=data.get("purchase_price", 0.0),
        current_price=data.get("current_price", 0.0),
        currency=data.get("currency", "ETH"),
        marketplace=data.get("marketplace"),
        metadata_url=data.get("metadata_url"),
        user_id=get_jwt_identity(),
        wallet_id=data.get("wallet_id")
    )
    
    try:
        db.session.add(nft)
        db.session.commit()
        return jsonify({"id": nft.id, "message": "NFT added"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to add NFT"}), 500

# ===== BLOCKCHAIN OPERATIONS =====
@blockchain_bp.route("/blockchain/mine", methods=["POST"])
@jwt_required()
def mine_block():
    data = request.get_json()
    if not data or not data.get("transactions"):
        return jsonify({"error": "Transaction data required"}), 400
    
    try:
        # Get the last block
        last_block = Block.query.order_by(Block.index.desc()).first()
        previous_hash = last_block.hash if last_block else "0"
        index = last_block.index + 1 if last_block else 0
        
        # Create new block
        block = Block(
            index=index,
            data=json.dumps(data["transactions"]),
            previous_hash=previous_hash,
            hash="",  # Initialize hash
            nonce=0   # Explicitly initialize nonce
        )
        
        # Mine the block (this will set the correct hash)
        block.mine_block(difficulty=2)  # Reduced difficulty for faster mining
        
        db.session.add(block)
        db.session.commit()
        
        return jsonify({
            "message": "Block mined successfully",
            "block_hash": block.hash,
            "index": block.index,
            "nonce": block.nonce,
            "timestamp": block.timestamp.isoformat()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to mine block: {str(e)}"}), 500

@blockchain_bp.route("/blockchain/chain", methods=["GET"])
@jwt_required()
def get_blockchain():
    blocks = Block.query.order_by(Block.index.asc()).all()
    chain = [{
        "index": block.index,
        "timestamp": block.timestamp.isoformat(),
        "data": json.loads(block.data),
        "hash": block.hash,
        "previous_hash": block.previous_hash,
        "nonce": block.nonce
    } for block in blocks]
    return jsonify({"chain": chain, "length": len(chain)})

@blockchain_bp.route("/blockchain/validate", methods=["GET"])
@jwt_required()
def validate_blockchain():
    blocks = Block.query.order_by(Block.index.asc()).all()
    
    for i in range(1, len(blocks)):
        current_block = blocks[i]
        previous_block = blocks[i-1]
        
        # Check if current block's hash is valid
        if current_block.hash != current_block.calculate_hash():
            return jsonify({"valid": False, "error": f"Invalid hash at block {current_block.index}"})
        
        # Check if current block points to previous block
        if current_block.previous_hash != previous_block.hash:
            return jsonify({"valid": False, "error": f"Invalid previous hash at block {current_block.index}"})
    
    return jsonify({"valid": True, "message": "Blockchain is valid"})

# ===== CRYPTO TRANSACTIONS =====
@blockchain_bp.route("/transactions", methods=["GET"])
@jwt_required()
def get_crypto_transactions():
    user_id = get_jwt_identity()
    transactions = CryptoTransaction.query.filter_by(user_id=user_id).order_by(CryptoTransaction.created_at.desc()).all()
    results = [{
        "id": tx.id,
        "tx_hash": tx.tx_hash,
        "from_address": tx.from_address,
        "to_address": tx.to_address,
        "amount": tx.amount,
        "currency": tx.currency,
        "gas_fee": tx.gas_fee,
        "status": tx.status,
        "created_at": tx.created_at.isoformat()
    } for tx in transactions]
    return jsonify(results)

@blockchain_bp.route("/transactions", methods=["POST"])
@jwt_required()
def create_crypto_transaction():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400
    
    # Generate transaction hash
    tx_data = f"{data.get('from_address')}{data.get('to_address')}{data.get('amount')}{datetime.utcnow()}"
    tx_hash = hashlib.sha256(tx_data.encode()).hexdigest()
    
    transaction = CryptoTransaction(
        tx_hash=tx_hash,
        from_address=data.get("from_address"),
        to_address=data.get("to_address"),
        amount=data.get("amount"),
        currency=data.get("currency"),
        gas_fee=data.get("gas_fee", 0.0),
        user_id=get_jwt_identity(),
        wallet_id=data.get("wallet_id")
    )
    
    try:
        db.session.add(transaction)
        db.session.commit()
        return jsonify({
            "id": transaction.id,
            "tx_hash": transaction.tx_hash,
            "message": "Transaction created"
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Failed to create transaction"}), 500

# ===== PORTFOLIO SUMMARY =====
@blockchain_bp.route("/portfolio-summary", methods=["GET"])
@jwt_required()
def blockchain_portfolio_summary():
    user_id = get_jwt_identity()
    
    # Crypto wallets total
    wallets = CryptoWallet.query.filter_by(user_id=user_id, is_active=True).all()
    total_crypto_value = sum(w.balance for w in wallets)
    
    # DeFi positions total
    defi_positions = DeFiPosition.query.filter_by(user_id=user_id, is_active=True).all()
    total_defi_value = sum(pos.current_value for pos in defi_positions)
    total_defi_rewards = sum(pos.rewards_earned for pos in defi_positions)
    
    # NFT collection total
    nfts = NFTCollection.query.filter_by(user_id=user_id).all()
    total_nft_value = sum(nft.current_price for nft in nfts)
    
    return jsonify({
        "total_crypto_wallets": len(wallets),
        "total_crypto_value": total_crypto_value,
        "total_defi_positions": len(defi_positions),
        "total_defi_value": total_defi_value,
        "total_defi_rewards": total_defi_rewards,
        "total_nfts": len(nfts),
        "total_nft_value": total_nft_value,
        "total_blockchain_portfolio": total_crypto_value + total_defi_value + total_nft_value
    })