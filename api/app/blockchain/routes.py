from flask import Blueprint, request, jsonify, current_app
from web3 import Web3
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.blockchain.models import CryptoWallet, DeFiPosition, NFTCollection, Block, CryptoTransaction
from app.auth.models import User
from app.extensions import db
from app.blockchain.market_data import get_crypto_prices
import hashlib
import json
from datetime import datetime
import logging

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
        network=data.get("network", "testnet"),
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


@blockchain_bp.route("/wallets/<int:wallet_id>/balance", methods=["GET"])
@jwt_required()
def get_wallet_balance(wallet_id):
    user_id = get_jwt_identity()
    wallet = CryptoWallet.query.filter_by(id=wallet_id, user_id=user_id).first()
    if not wallet:
        return jsonify({"error": "Wallet not found"}), 404

    if wallet.network == 'mainnet':
        rpc_url = current_app.config.get("MAINNET_RPC_URL")
    else:
        rpc_url = current_app.config.get("TESTNET_RPC_URL")

    if not rpc_url:
        return jsonify({"error": f"{wallet.network.capitalize()} RPC URL not configured"}), 500

    try:
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        if not w3.is_connected():
            return jsonify({"error": "Failed to connect to blockchain network"}), 500

        checksum_address = Web3.to_checksum_address(wallet.address)
        balance_wei = w3.eth.get_balance(checksum_address)
        balance_ether = w3.from_wei(balance_wei, "ether")

        return jsonify({"balance": float(balance_ether)})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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
@blockchain_bp.route("/latest-block", methods=["GET"])
@jwt_required()
def get_latest_block():
    logging.info("Attempting to get the latest block.")
    try:
        last_block = Block.query.order_by(Block.index.desc()).first()
        if not last_block:
            logging.warning("No blocks found in the chain.")
            return jsonify({"error": "No blocks in the chain yet"}), 404
        
        logging.info(f"Successfully retrieved latest block with index: {last_block.index}")
        return jsonify({
            "index": last_block.index + 1,
            "previous_hash": last_block.hash,
            "difficulty": last_block.difficulty,
            "reward": 10  # Example reward
        })
    except Exception as e:
        logging.error(f"Error getting latest block: {e}")
        return jsonify({"error": "Internal server error"}), 500

@blockchain_bp.route("/mine", methods=["POST"])
@jwt_required()
def mine_block():
    data = request.get_json()
    if isinstance(data, str):
        data = json.loads(data)

    if not data or not data.get("transactions"):
        return jsonify({"error": "Transaction data required"}), 400

    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        last_block = Block.query.order_by(Block.index.desc()).first()
        previous_hash = last_block.hash if last_block else "0"
        index = last_block.index + 1 if last_block else 0
        difficulty = last_block.difficulty if last_block else 4

        block = Block(
            index=index,
            data=json.dumps(data["transactions"]),
            previous_hash=previous_hash,
            difficulty=difficulty,
            mined_by=user.username,
            reward=10
        )

        block.mine_block(difficulty)

        db.session.add(block)
        db.session.commit()

        return jsonify({
            "message": "Block mined successfully",
            "block_hash": block.hash,
            "index": block.index,
            "nonce": block.nonce,
            "timestamp": block.timestamp.isoformat(),
            "reward": block.reward
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to mine block: {str(e)}"}), 500

@blockchain_bp.route("/chain", methods=["GET"])
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

@blockchain_bp.route("/validate", methods=["GET"])
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

@blockchain_bp.route("/leaderboard", methods=["GET"])
@jwt_required()
def get_leaderboard():
    logging.info("Attempting to get the leaderboard.")
    try:
        leaderboard = db.session.query(
            Block.mined_by,
            db.func.count(Block.mined_by).label("blocks_mined")
        ).filter(Block.mined_by.isnot(None)).group_by(Block.mined_by).order_by(db.desc("blocks_mined")).all()
        
        results = [{
            "username": row[0],
            "blocks_mined": row[1]
        } for row in leaderboard]
        
        logging.info("Successfully retrieved the leaderboard.")
        return jsonify(results)
    except Exception as e:
        logging.error(f"Error getting leaderboard: {e}")
        return jsonify({"error": "Internal server error"}), 500

@blockchain_bp.route("/market/prices", methods=["GET"])
@jwt_required()
def get_prices():
    coin_ids = request.args.getlist("ids")
    prices = get_crypto_prices(coin_ids)
    return jsonify(prices)


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