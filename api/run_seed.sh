#!/bin/bash

# EasyFinance Seed Data Runner
echo "🌱 EasyFinance Seed Data Generator"
echo "=================================="

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please create one first:"
    echo "   python -m venv venv"
    echo "   source venv/bin/activate"
    echo "   pip install -r requirements.txt"
    exit 1
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies if needed
echo "📦 Checking dependencies..."
pip install -q flask flask-sqlalchemy flask-migrate flask-jwt-extended flask-cors flask-marshmallow flask-socketio

# Run seed data script
echo "🌱 Running seed data generation..."
python seed_data.py

echo ""
echo "✅ Seed data generation completed!"
echo ""
echo "🚀 You can now start the server with:"
echo "   python run.py"
echo ""
echo "📮 Test the API with the provided Postman collection:"
echo "   EasyFinance_API_Collection.json"