# """
# API functions
# """
from .models import db, Account, Transaction

class AccountController:
    def __init__(self):
        pass

    def get_accounts(last):
        accounts = Account.query.limit(last)
        return accounts if accounts else []
    
    def get_account(id):
        account = Account.query.filter_by(id=id).first()
        return account if account else []

    def create_account(name,description):
        account = Account(name,description)
        db.session.add(account)
        db.session.commit()

class TransactionController:
    def __init__(self):
        pass

    def get_transactions(last):
        transactions = Transaction.query.limit(last)
        return transactions if transactions else []
    
    def get_transaction(id):
        transaction = Transaction.query.filter_by(id=id).first()
        return transaction if transaction else []