import os
from dotenv import load_dotenv

# Set the base directory path
basedir = os.path.abspath(os.path.dirname(__file__))

# Get flask environment variable
env_var = os.environ.get('FLASK_ENV')
print(env_var)

if env_var == 'production':
    load_dotenv('.env.prod')
if env_var == 'development':
    load_dotenv('.env.dev')
if env_var == 'local':
    load_dotenv('.env')
else:
    load_dotenv('.env.test')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(os.getcwd(), 'main.db')


class Config:
    SECRET_KEY = os.environ['SECRET_KEY']
    ALPACA_API_URL = os.environ['ALPACA_API_URL']
    ALPACA_API_KEY = os.environ['ALPACA_API_KEY']
    ALPACA_API_SECRET = os.environ['ALPACA_API_SECRET']
    DEBUG = os.environ['DEBUG']
    PORT = os.environ['PORT']
    UPLOADS = './static/uploads'
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_PERMANENT = False
