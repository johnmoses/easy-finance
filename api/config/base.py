import os
from dotenv import load_dotenv

# Set the base directory path
basedir = os.path.abspath(os.path.dirname(__file__))

# Get flask environment variable
env_var = os.environ.get('FLASK_ENV')
print(env_var)

if env_var == 'local':
    load_dotenv('.env')
    SECRET_KEY = os.environ['SECRET_KEY']
    DEBUG = os.environ['DEBUG']
    PORT = os.environ['PORT']
    SESSION_PERMANENT = False
else:
    load_dotenv('.env.test')
    SECRET_KEY = os.environ['SECRET_KEY']
    DEBUG = os.environ['DEBUG']
    PORT = os.environ['PORT']
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(os.getcwd(), 'demodb.db')
    SESSION_PERMANENT = False

class Config:
    SECRET_KEY = os.environ['SECRET_KEY']
    DEBUG = os.environ['DEBUG']
    PORT = os.environ['PORT']
    UPLOADS = './static/uploads'
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SESSION_PERMANENT = False
