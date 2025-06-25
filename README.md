# Easy Finance

This is a financial app featuring blockchain and digital assets, leveraging the power of Python Flask, integrating AI technologies like large language models (LLMs), Retrieval-Augmented Generation (RAG), AI agents, and Model Context Protocol (MCP)

## Core Features

### Blockchain Core with Flask

1. Python Flask RESTful APIs are used for blockchain operations such as mining blocks, retrieving the chain, and validating it. Each block is a class instance containing transactions or financial data, chained via cryptographic hashes to ensure immutability and security.
2. Python’s hashlib library is used for cryptographic hashing, and Flask for API endpoints, enabling fast development and easy integration.

### Large Language Models (LLMs)

1. LLMs use Flask API endpoints that handle user queries or commands, leveraging prompt engineering to guide the model’s responses.
2. Inference logic and chat functionalities are separated into modules and then combining in Flask routes to serve JSON responses.
3. Support for intelligent financial advice, natural language queries about blockchain data, or customer support.

### Retrieval-Augmented Generation (RAG)

1. RAG enhances LLM responses by retrieving relevant contextual data from a knowledge base or document store before generating answers.
2. Chroma, a vector databases is used for efficient semantic search of financial documents or blockchain records, then augment LLM prompts with retrieved context.
3. Flask blueprints are used for ingestion, retrieval, and generation components, adapted for financial data retrieval and AI answer generation.

### Model Context Protocol (MCP)

1. MCP is a protocol layer to manage how context is stored, indexed, retrieved, assembled, and injected into LLM prompts dynamically. It ensures that AI models receive only the most relevant information at the right time, improving response quality and efficiency.
2. MCP’s modular pipeline includes context storage (e.g., documents, transaction histories), context indexing (embeddings), retrieval logic, assembly of prompt context, and prompt execution with the LLM.
3. Implementing MCP in Python helps ensure that financial app maintain coherent and contextually rich interactions, especially when combined with RAG.

### AI Agents and Automation

1. AI agents automate financial tasks such as transaction monitoring, fraud detection, or portfolio management by integrating AI models with blockchain backend.
2. These agents leverage LLMs for decision-making, RAG for informed responses, and MCP for context-aware processing.
3. Flask APIs exposes endpoints for agent commands and status, enabling interaction through web or mobile interfaces.
