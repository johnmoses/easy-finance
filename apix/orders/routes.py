from flask import session, request, jsonify
from orders import bp
from orders.controllers import OrderController
from orders.schemas import OrderSchema

@bp.route('/orders', methods=['POST'])
def get_orders():
    request_data = request.get_json()
    last = request_data['last']
    orders = OrderController.get_orders(last)
    return OrderSchema(many=True).dump(orders), 200

@bp.route('/order/<int:id>', methods=['GET'])
def get_order(id):
    order = OrderController.get_order(id)
    return OrderSchema().dump(order), 200

@bp.route('/order', methods=['POST'])
def create_order():
    request_data = request.get_json()
    quantity = request_data['quantity']
    buy_price = request_data['buy_price']
    sell_price = request_data['sell_price']
    user_id = request_data['user_id']
    stock_id = request_data['stock_id']
    strategy_id = request_data['strategy_id']
    account_id = request_data['account_id']
    OrderController.create_order(quantity,buy_price,sell_price,user_id,stock_id,strategy_id,account_id)
    print('Created order')
    return jsonify('Created order!'), 200