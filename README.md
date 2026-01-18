# Ashwin's Personal Portfolio & Digital Twin

A futuristic, interactive portfolio website featuring a "Digital Twin" AI assistant.

**Live Site:** [https://ashwinkumars.com](https://ashwinkumars.com)

## 🏗️ Architecture & Documentation

This project uses a modern tech stack designed for performance and scalability:
- **Frontend:** React + Vite (hosted on Firebase)
- **Backend:** FastAPI + LangChain (hosted on Cloud Run)
- **AI:** Google Vertex AI (Gemini Models)
- **Data:** Google Firestore (Vector Search + History)

👉 **[Read the Full Architecture Guide](ARCHITECTURE.md)** for a detailed breakdown of the system design, tech stack decisions, and RAG pipeline.

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.11+
- Google Cloud CLI

### Installation

1.  **Clone the repo**
    ```bash
    git clone ...
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Run Locally**
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:3000`.

## 🤖 Digital Twin Agent
The AI assistant is capable of answering professional questions based on Ashwin's resume and project history. It uses a RAG (Retrieval-Augmented Generation) pipeline to ensure accuracy.
