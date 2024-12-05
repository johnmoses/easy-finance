from flask import session, request, jsonify, Response
import io
import numpy as np
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
from matplotlib import pyplot as plt

plt.rcParams["figure.autolayout"] = True
plt.rcParams["figure.figsize"] = [12,10]
from portfolios import bp
from portfolios.controllers import PortfolioController
# from portfolios.schemas import PortfolioSchema

@bp.route('/portfolios', methods=['POST'])
def get_portfolios():
    request_data = request.get_json()
    symbols = request_data['symbols']
    portfolios = PortfolioController.get_historical_prices(symbols)
    return portfolios, 200

@bp.route('/plot/stocks', methods=['POST'])
def plot_stocks():
    request_data = request.get_json()
    symbols = request_data['symbols']
    fig, plot = PortfolioController.plot_stocks(symbols)

    # Create figurecanvas for matplotlib fig and plot
    FigureCanvas(fig).print_png(plot)
    return Response(plot.getvalue(), mimetype='image/png')

@bp.route('/plot/sample', methods=['POST'])
def plot_sample():
    request_data = request.get_json()
    symbols = request_data['symbols']
    fig, plot = PortfolioController.plot_sample(symbols)

    # Create figurecanvas for matplotlib fig and plot
    FigureCanvas(fig).print_png(plot)
    response = {
        plot.getvalue()
    }
    return Response(response, mimetype='image/png')

@bp.route('/plot/fig', methods=['GET'])
def plot_fig():
   fig = Figure()
   axis = fig.add_subplot(1, 1, 1)

   # Generate x axis
   x = np.arange(0, 10, 0.1);

   # Plot it
   axis.plot(x, np.sin(x), '-')
   axis.plot(x, np.cos(x), '--')
   output = io.BytesIO()
#    plt.savefig(output, format='png')  # save image in file-like object
#    output.seek(0)                     # move to beginning of file-like object to read it later

#    return output
   FigureCanvas(fig).print_png(output)
   return Response(output.getvalue(), mimetype='image/png')