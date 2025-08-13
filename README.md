<p align="center"><img src="https://placehold.co/1280x320/2d3748/ffffff/png?text=EasyFinance" alt="EasyFinance Banner"></p>

# 💰 Easy Finance - AI-Powered Financial Platform

> A next-generation financial application combining blockchain technology, AI intelligence, and modern web/mobile interfaces for comprehensive wealth management.

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3+-green.svg)](https://flask.palletsprojects.com)
[![React Native](https://img.shields.io/badge/React%20Native-0.80+-61DAFB.svg)](https://reactnative.dev)
[![Next.js](https://img.shields.io/badge/Next.js-15+-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Features

### 🤖 **AI-Powered Intelligence**
- **Large Language Models (LLMs)** - Intelligent financial advice and natural language queries
- **Retrieval-Augmented Generation (RAG)** - Context-aware responses using Chroma vector database
- **AI Agents** - Automated portfolio management, fraud detection, and transaction monitoring
- **Model Context Protocol (MCP)** - Advanced context orchestration for coherent AI interactions

### ⛓️ **Blockchain & Digital Assets**
- **Custom Blockchain** - Immutable transaction ledger with cryptographic security
- **Digital Wallets** - Multi-currency wallet management
- **DeFi Integration** - Decentralized finance protocols and yield farming
- **NFT Portfolio** - Non-fungible token collection and trading
- **Cryptocurrency Trading** - Real-time crypto asset management

### 💼 **Comprehensive Finance Management**
- **Account Management** - Multiple account types and transaction tracking
- **Transaction Import** - Easily upload bank statements (.xls, .xlsx, .pdf) to automatically populate your transaction history.
- **Investment Portfolio** - Real-time portfolio analytics and performance metrics
- **Financial Planning** - Goal setting, budget management, and progress tracking
- **Wealth Analytics** - Advanced reporting and investment insights
- **Smart Notifications** - AI-driven alerts and recommendations

### 📱 **Multi-Platform Experience**
- **Mobile App** - React Native cross-platform application
- **Web Dashboard** - Next.js responsive web interface
- **Real-time Sync** - Seamless data synchronization across platforms
- **Modern UI/UX** - Gradient designs and intuitive navigation

### Screenshots

#### Mobile App

![Mobile Screenshot 1](mobile/images/1.png)
![Mobile Screenshot 2](mobile/images/2.png)
![Mobile Screenshot 3](mobile/images/3.png)

#### Web Dashboard

![Web Screenshot 1](web/images/1.png)
![Web Screenshot 2](web/images/2.png)
![Web Screenshot 3](web/images/3.png)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile App    │    │  Web Dashboard  │    │   Admin Panel   │
│ (React Native)  │    │   (Next.js)     │    │   (Analytics)   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │     Flask API Server      │
                    │   (Python + SQLAlchemy)   │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
    ┌─────┴─────┐         ┌───────┴───────┐       ┌───────┴───────┐
    │PostgreSQL │         │ Milvus Vector │       │ Redis Cache   │
    │ Database  │         │   Database    │       │ & Sessions    │
    └───────────┘         └───────────────┘       └───────────────┘
                                  │
                          ┌───────┴───────┐
                          │ MCP Context   │
                          │  Management   │
                          └───────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Redis Server
- PostgreSQL (optional, SQLite for development)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/easy-finance.git
cd easy-finance
```

### 2. Backend Setup
```bash
cd api
pip install -r requirements.txt
cp .env.example .env
# Configure your environment variables
python run.py
```

### 3. Web Frontend Setup
```bash
cd web
npm install
npm run dev
```

### 4. Mobile App Setup
```bash
cd mobile
npm install
npx react-native run-ios  # or run-android
```

## 📱 Applications

### 🌐 **Web Dashboard** (`/web`)
- **Next.js 15** with TypeScript
- **Tailwind CSS** for modern styling
- **Real-time updates** via Socket.IO
- **Responsive design** with gradient themes
- **Tab-based navigation** for organized UX

### 📱 **Mobile Application** (`/mobile`)
- **React Native 0.80** cross-platform
- **TypeScript** for type safety
- **Bottom tab navigation** with clean UI
- **Context API** for state management
- **Native performance** on iOS/Android

### ⚙️ **API Server** (`/api`)
- **Flask RESTful API** with comprehensive endpoints
- **SQLAlchemy ORM** for database operations
- **JWT Authentication** with role-based access
- **MCP Integration** for AI context management
- **Blockchain operations** with cryptographic security

## 🔧 Configuration

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost/easyfinance

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret

# AI/ML Models
LLAMA_MODEL_PATH=/path/to/llama/model.gguf
MILVUS_DB_PATH=./milvus_rag.db
EMBED_MODEL_NAME=all-MiniLM-L6-v2

# Redis
REDIS_URL=redis://localhost:6379

# Blockchain
BLOCKCHAIN_DIFFICULTY=4
MINING_REWARD=10.0
```

## 📊 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Token refresh

### Finance Management
- `GET /finance/accounts` - List accounts
- `POST /finance/transactions` - Create transaction
- `GET /finance/summary` - Account summary

### Wealth Management
- `GET /wealth/portfolio` - Portfolio overview
- `POST /wealth/investments` - Add investment
- `GET /wealth/performance` - Performance metrics

### Blockchain Operations
- `GET /blockchain/chain` - Get blockchain
- `POST /blockchain/mine` - Mine new block
- `GET /blockchain/wallets` - List wallets

### AI & MCP
- `POST /mcp/chat` - AI-powered chat
- `POST /mcp/context` - Store context
- `GET /mcp/agents` - List AI agents

## 🧪 Testing

```bash
# Backend tests
cd api
python -m pytest tests/

# Frontend tests
cd web
npm test

# Mobile tests
cd mobile
npm test
```

## 🐳 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale api=3
```

## 📈 Key Technologies

### Backend
- **Flask** - Web framework
- **SQLAlchemy** - ORM
- **Chroma** - Vector database
- **Redis** - Caching & sessions
- **JWT** - Authentication

### Frontend
- **Next.js 15** - React framework
- **React Native 0.80** - Mobile development
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### AI & Blockchain
- **Llama Models** - LLM inference
- **MCP** - Context protocol
- **Cryptographic Hashing** - Blockchain security
- **Vector Embeddings** - Semantic search

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@easyfinance.com
- 📖 Documentation: [docs.easyfinance.com](https://docs.easyfinance.com)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/easy-finance/issues)

## 🙏 Acknowledgments

- **Flask** - Powerful web framework
- **React Native** - Cross-platform mobile development
- **Next.js** - Modern React framework
- **Chroma** - Vector database for AI
- **OpenAI** - AI model inspiration

### More Screenshots

#### Mobile App

![Mobile Screenshot 14](mobile/images/14.png)
![Mobile Screenshot 15](mobile/images/15.png)
![Mobile Screenshot 16](mobile/images/16.png)

#### Web Dashboard

![Web Screenshot 14](web/images/14.png)
![Web Screenshot 15](web/images/15.png)
![Web Screenshot 16](web/images/16.png)

---

<div align="center">
  <strong>Built with 💰 for smarter financial management</strong>
</div>