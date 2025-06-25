import os

import pytest

from main import app


@pytest.fixture
def client():
    app.app.testing = True
    return app.app.test_client()


def test_handler_no_env_variable(client):
    r = client.get("/")

    assert r.data.decode() == "Hello World!"
    assert r.status_code == 200


def test_handler_with_env_variable(client):
    os.environ["NAME"] = "Foo"
    r = client.get("/")

    assert r.data.decode() == "Hello Foo!"
    assert r.status_code == 200
