from flask import Blueprint, request, jsonify, current_app
from web3 import Web3
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.blockchain.models import CryptoWallet, DeFiPosition, NFTCollection, CryptoTransaction
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

        # Save the updated balance to the database
        wallet.balance = balance_ether
        db.session.commit()

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

    # A simple mapping from currency symbol to CoinGecko API ID
    # In a real app, this might come from a database table
    SYMBOL_TO_ID_MAP = {
        "BTC": "bitcoin",
        "ETH": "ethereum",
        "USDC": "usd-coin",
        # Add other common currencies here
    }

    wallets = CryptoWallet.query.filter_by(user_id=user_id, is_active=True).all()
    
    # Get prices for all wallet currencies
    coin_ids_to_fetch = [SYMBOL_TO_ID_MAP[w.currency] for w in wallets if w.currency in SYMBOL_TO_ID_MAP]
    
    total_crypto_value = 0.0
    if coin_ids_to_fetch:
        prices = get_crypto_prices(list(set(coin_ids_to_fetch)))
        
        # Calculate total value
        for w in wallets:
            coin_id = SYMBOL_TO_ID_MAP.get(w.currency)
            if coin_id and coin_id in prices and 'usd' in prices[coin_id]:
                total_crypto_value += w.balance * prices[coin_id]['usd']

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