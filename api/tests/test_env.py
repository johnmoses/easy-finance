import logging
import os

from flask.testing import FlaskClient

import pytest

from main import app

# load proper environment variables
def setup_test_env():
    os.environ["DB_USER"] = 'dr_user'
    os.environ["INSTANCE_UNIX_SOCKET"] = os.environ["POSTGRES_UNIX_SOCKET"]
    os.environ["INSTANCE_CONNECTION_NAME"] = os.environ["POSTGRES_INSTANCE"]

@pytest.fixture(scope="module")
def client() -> FlaskClient:
    setup_test_env()
    app.testing = True
    client = app.test_client()

    return client


def test_connector_connection(client: FlaskClient) -> None:
    del os.environ["INSTANCE_UNIX_SOCKET"]
    app.db = app.init_connection_pool()
    assert str(app.db.url) == "postgresql+pg8000://"