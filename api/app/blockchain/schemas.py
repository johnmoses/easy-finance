from app.extensions import ma
from app.blockchain.models import CryptoWallet, DeFiPosition, NFTCollection, Block, CryptoTransaction
from marshmallow import fields, validates, ValidationError

class CryptoWalletSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CryptoWallet
        load_instance = True
        exclude = ('user_id',)
    
    @validates('currency')
    def validate_currency(self, value):
        valid_currencies = ['BTC', 'ETH', 'USDC', 'USDT', 'ADA', 'SOL', 'MATIC', 'LINK']
        if value.upper() not in valid_currencies:
            raise ValidationError(f"Currency must be one of: {valid_currencies}")

class DeFiPositionSchema(ma.SQLAlchemyAutoSchema):
    profit_loss = fields.Float(dump_only=True)
    
    class Meta:
        model = DeFiPosition
        load_instance = True
        exclude = ('user_id',)
    
    @validates('position_type')
    def validate_position_type(self, value):
        valid_types = ['liquidity', 'lending', 'staking']
        if value not in valid_types:
            raise ValidationError(f"Position type must be one of: {valid_types}")

class NFTCollectionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = NFTCollection
        load_instance = True
        exclude = ('user_id',)

class BlockSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Block
        load_instance = True

class CryptoTransactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = CryptoTransaction
        load_instance = True
        exclude = ('user_id',)

crypto_wallet_schema = CryptoWalletSchema()
crypto_wallets_schema = CryptoWalletSchema(many=True)
defi_position_schema = DeFiPositionSchema()
defi_positions_schema = DeFiPositionSchema(many=True)
nft_collection_schema = NFTCollectionSchema()
nft_collections_schema = NFTCollectionSchema(many=True)
block_schema = BlockSchema()
blocks_schema = BlockSchema(many=True)
crypto_transaction_schema = CryptoTransactionSchema()
crypto_transactions_schema = CryptoTransactionSchema(many=True)