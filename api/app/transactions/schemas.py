from app.extensions import ma
from app.transactions.models import Transaction

class TransactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Transaction
        load_instance = True

transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
