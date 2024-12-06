import io
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib import pyplot as plt
from flask import session, request, jsonify, Response
from stocks import bp
from stocks.controllers import (
    StockController, StockPriceController,
    StrategyController
)
from stocks.schemas import (
    StockSchema, StockPriceSchema,
    StrategySchema
)

@bp.route('/stocks', methods=['POST'])
def get_stocks():
    request_data = request.get_json()
    last = request_data['last']
    res = StockController.get_stocks(last)
    return StockSchema(many=True).dump(res), 200

@bp.route('/stock/<int:id>', methods=['GET'])
def get_stock(id):
    res = StockController.get_stock(id)
    return StockSchema().dump(res), 200

@bp.route('/stock/stickers', methods=['POST'])
def get_stock_stickers():
    res = StockController.get_stickers()
    return res, 200


@bp.route('/stock/topgainers', methods=['POST'])
def get_stock_topgainers():
    res = StockController.get_top_gainers()
    return res, 200

@bp.route('/stock/prices', methods=['POST'])
def get_stock_prices():
    request_data = request.get_json()
    symbol = request_data['symbol']
    res = StockController.get_stock_prices(symbol)
    return res, 200

@bp.route('/stock/returns', methods=['POST'])
def get_stock_returns():
    request_data = request.get_json()
    symbol = request_data['symbol']
    res = StockController.get_stock_returns(symbol)
    return res, 200

@bp.route('/plot/returns', methods=['POST'])
def plot_stock_returns():
    request_data = request.get_json()
    symbol = request_data['symbol']
    fig, plot = StockController.plot_stock_returns(symbol)

    # Create figurecanvas for matplotlib fig and plot
    FigureCanvas(fig).print_png(plot)
    return Response(plot.getvalue(), mimetype='image/png')

@bp.route('/stock', methods=['POST'])
def create_stock():
    request_data = request.get_json()
    symbol = request_data['symbol']
    name = request_data['name']
    StockController.create_stock(symbol,name)
    print('Created stock')
    return jsonify('Created stock!'), 200

@bp.route('/stockprices', methods=['POST'])
def get_stockprices():
    request_data = request.get_json()
    last = request_data['last']
    stockprices = StockPriceController.get_stockprices(last)
    return StockPriceSchema(many=True).dump(stockprices), 200

@bp.route('/stockprice/<int:id>', methods=['GET'])
def get_stockprice(id):
    stockprice = StockPriceController.get_stockprice(id)
    return StockPriceSchema().dump(stockprice), 200

@bp.route('/strategies', methods=['POST'])
def get_strategies():
    request_data = request.get_json()
    last = request_data['last']
    strategies = StrategyController.get_strategies(last)
    return StrategySchema(many=True).dump(strategies), 200

@bp.route('/strategy/<int:id>', methods=['GET'])
def get_strategy(id):
    strategy = StrategyController.get_strategy(id)
    return StrategySchema().dump(strategy), 200

@bp.route('/strategy', methods=['POST'])
def create_strategy():
    request_data = request.get_json()
    name = request_data['name']
    StrategyController.create_strategy(name)
    print('Created strategy')
    return jsonify('Created strategy!'), 200