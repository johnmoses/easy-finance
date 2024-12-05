from flask import session, request, jsonify
from finance import bp
from finance.controllers import AccountController, TransactionController
from finance.schemas import AccountSchema, TransactionSchema

@bp.route('/accounts', methods=['POST'])
def get_accounts():
    request_data = request.get_json()
    last = request_data['last']
    accounts = AccountController.get_accounts(last)
    return AccountSchema(many=True).dump(accounts), 200

@bp.route('/account/<int:id>', methods=['GET'])
def get_account(id):
    account = AccountController.get_account(id)
    return AccountController().dump(account), 200

@bp.route('/account', methods=['POST'])
def create_account():
    request_data = request.get_json()
    name = request_data['name']
    description = request_data['description']
    AccountController.create_account(name,description)
    print('Created account')
    return jsonify('Created account!'), 200

@bp.route('/transactions', methods=['POST'])
def get_transactions():
    request_data = request.get_json()
    last = request_data['last']
    transactions = TransactionController.get_transactions(last)
    return TransactionSchema(many=True).dump(transactions), 200

@bp.route('/transaction/<int:id>', methods=['GET'])
def get_transaction(id):
    transaction = TransactionController.get_transaction(id)
    return TransactionController().dump(transaction), 200