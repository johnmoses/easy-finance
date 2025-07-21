import pytest
from app import create_app
from app.extensions import db

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def test_register_and_login(client):
    # Register
    response = client.post("/api/auth/register", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "secret"
    })
    assert response.status_code == 201

    # Login
    response = client.post("/api/auth/login", json={
        "username": "testuser",
        "password": "secret"
    })
    assert response.status_code == 200
    assert "access_token" in response.get_json()
