import json
from flask import jsonify, request
from flask_login import login_required, current_user
from datetime import datetime
from finance import bp
from .models import db, Block, Transaction
from .blockchain import Blockchain
# from ai.vector_db import VectorDB

from ai.integration import AIProcessor

blockchain = Blockchain()
# Initialize system balance (mint some tokens to SYSTEM)
blockchain.balances["SYSTEM"] = 1000000
ai_processor = AIProcessor()
# vector_db = VectorDB()


@bp.route("/balance/<address>", methods=["GET"])
def get_balance(address):
    balance = blockchain.balances.get(address, 0)
    return jsonify({"address": address, "balance": balance})


@bp.route("/chain", methods=["GET"])
def full_chain():
    blocks = Block.query.order_by(Block.index).all()
    return jsonify([block.to_dict() for block in blocks]), 200


@bp.route("/transactions", methods=["GET"])
def all_transactions():
    txs = Transaction.query.order_by(Transaction.timestamp.desc()).all()
    return jsonify([tx.to_dict() for tx in txs]), 200


@bp.route("/transactions/history", methods=["GET"])
@login_required
def transaction_history():
    transactions = (
        Transaction.query.filter_by(user_id=current_user.id)
        .order_by(Transaction.timestamp.desc())
        .all()
    )
    return jsonify([tx.to_dict() for tx in transactions]), 200


@bp.route("/transactions/new", methods=["POST"])
def new_transaction():
    values = request.get_json()
    required = ["sender", "recipient", "amount"]
    if not all(k in values for k in required):
        return "Missing values", 400

    sender = values["sender"]
    recipient = values["recipient"]
    amount = values["amount"]

    success = blockchain.add_transaction(sender, recipient, amount)
    if not success:
        return jsonify({"message": "Insufficient balance"}), 400

    return (
        jsonify(
            {
                "message": f"Transaction from {sender} to {recipient} for {amount} tokens added."
            }
        ),
        201,
    )


# @bp.route("/transactions/new", methods=["POST"])
# @login_required
# def new_transaction():
#     data = request.get_json()
#     sender = data.get("sender")
#     recipient = data.get("recipient")
#     amount = data.get("amount")

#     if not sender or not recipient or not amount:
#         return jsonify({"message": "Missing transaction data"}), 400

#     # Associate transaction with current user
#     transaction = Transaction(
#         sender=sender, recipient=recipient, amount=amount, user_id=current_user.id
#     )
#     db.session.add(transaction)
#     db.session.commit()

#     return (
#         jsonify({"message": "Transaction added", "transaction_id": transaction.id}),
#         201,
#     )

# @bp.route('/mine', methods=['GET'])
# def mine():
#     last_block = blockchain.last_block
#     last_proof = last_block['proof']
#     proof = blockchain.proof_of_work(last_proof)

#     # Reward miner with 10 tokens from SYSTEM
#     blockchain.add_transaction('SYSTEM', 'miner-address', 10)

#     previous_hash = blockchain.hash(last_block)
#     block = blockchain.create_block(proof, previous_hash)

#     response = {
#         'message': 'New block mined',
#         'index': block['index'],
#         'transactions': block['transactions'],
#         'proof': block['proof'],
#         'previous_hash': block['previous_hash'],
#         'balances': blockchain.balances  # For demo purposes
#     }
#     return jsonify(response), 200


@bp.route("/mine", methods=["GET"])
def mine():
    last_block = blockchain.last_block
    last_proof = last_block["proof"]
    proof = blockchain.proof_of_work(last_proof)

    # Generate AI transaction and persist it
    ai_transaction = ai_processor.generate_ai_transaction()
    transaction = Transaction(
        sender=ai_transaction.get("sender", "AI"),
        recipient=ai_transaction.get("recipient", "User"),
        amount=ai_transaction.get("amount", 0),
    )
    db.session.add(transaction)
    db.session.commit()

    blockchain.add_transaction(
        transaction.sender, transaction.recipient, transaction.amount
    )

    previous_hash = blockchain.hash(last_block)
    block = blockchain.create_block(proof, previous_hash)

    # Persist block with transactions as JSON string
    block_db = Block(
        index=block["index"],
        timestamp=datetime.utcfromtimestamp(block["timestamp"]),
        transactions=json.dumps(block["transactions"]),
        proof=block["proof"],
        previous_hash=block["previous_hash"],
    )
    db.session.add(block_db)
    db.session.commit()

    response = {"message": "New Block Forged", "block": block_db.to_dict()}
    return jsonify(response), 200


# Endpoint to ingest documents
# @bp.route("/ingest", methods=["POST"])
# def ingest_documents():
#     data = request.json
#     if not data or "documents" not in data or not isinstance(data["documents"], list):
#         return jsonify({"error": "Missing or invalid 'documents' list"}), 400
#     try:
#         vector_db.ingest_documents(data["documents"])
#         return (
#             jsonify(
#                 {
#                     "message": f"Ingested {len(data['documents'])} documents successfully."
#                 }
#             ),
#             201,
#         )
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# Endpoint to retrieve context
# @bp.route("/retrieve", methods=["POST"])
# def retrieve_context():
#     data = request.json
#     if not data or "query" not in data:
#         return jsonify({"error": "Missing 'query' parameter"}), 400
#     k = data.get("k", 3)
#     try:
#         context = vector_db.retrieve_financial_context(query=data["query"], k=k)
#         return jsonify({"context": context}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# Endpoint to generate AI response using RAG
# @bp.route("/generate", methods=["POST"])
# def generate():
#     data = request.json
#     if not data or "query" not in data:
#         return jsonify({"error": "Missing 'query' parameter"}), 400

#     query = data["query"]
#     k = data.get("k", 3)

#     # Retrieve context from ChromaDB
#     context = vector_db.retrieve_financial_context(query=query, k=k)

#     # Generate AI response using the context
#     response = ai_processor.generate_response(query=query, context=context)

#     return jsonify({"response": response}), 200
