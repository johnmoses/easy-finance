import os
import psycopg2  

def connect():
    database = os.environ['DATABASE']
    host = os.environ['SQL_HOST']
    db_port = os.environ['SQL_PORT']
    db_user = os.environ['SQL_USER']
    db_password = os.environ['SQL_PASSWORD']

    try:
        conn = psycopg2.connect(
            host=host,
            database=database,
            port=db_port,
            user=db_user,
            password=db_password
        )
        print('Database Connected')
        return conn
    except Exception as e:
        print('Dbx error: ', e)
        return 'Dbx error'