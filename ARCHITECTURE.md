# Digital Twin Architecture & Developer Guide

Welcome to the technical documentation for Ashwin's **Digital Twin** project. This guide is designed to help developers (especially those new to the codebase) understand how the system works, why specific technologies were chosen, and how the different pieces fit together.

## 1. High-Level Overview

This project is a **"Digital Twin" RAG (Retrieval-Augmented Generation) Agent**. It's an AI assistant that "knows" about Ashwin's professional experience and can answer questions from recruiters or hiring managers.

### The Goal
To demonstrate technical expertise in LLM (Large Language Model) management while providing a strictly informational, interactive resume experience.

### System Architecture

The system is split into two main parts: a **Frontend** (what the user sees) and a **Backend** (where the AI logic lives).

```mermaid
graph TD
    subgraph "Client Side (Browser)"
        User[👤 User]
        FE[💻 Frontend (React + Vite)]
    end

    subgraph "Server Side (Google Cloud)"
        API[🚀 Backend API (FastAPI)]
        Auth[🔐 Security (API Key)]
    end

    subgraph "Data & AI Services"
        DB[(🗄️ Firestore)]
        AI[🧠 Vertex AI (Gemini)]
        Email[📧 Brevo API]
    end

    User -->|Visits Website| FE
    FE -->|Sends Message| API
    
    API -->|1. Validate Key| Auth
    API -->|2. Search Context| DB
    DB -- "Returns Project/Resume Data" --> API
    
    API -->|3. Send Prompt + Context| AI
    AI -- "Generates Answer" --> API
    
    API -- "4. Response" --> FE
    FE -- "Displays Message" --> User

    API -.-|Optional: Send Email| Email
```

---

## 2. Technology Stack & Decisions

We chose specific tools to balance **performance**, **simplicity**, and **cloud integration**. Here is the "Why" behind each choice:

### 🎨 Frontend: React + Vite
*   **What it is:** The visual interface where users chat.
*   **Why we chose it:**
    *   **Lower Hosting Complexity:** Unlike Next.js (which often requires a Node.js server for server-side rendering), a Vite app compiles to static HTML/JS/CSS files. These can be hosted anywhere cheaply and easily (like Firebase Hosting).
    *   **Performance:** It loads fast and feels snappy for a Single Page Application (SPA).

### ⚡ Backend: FastAPI (Python)
*   **What it is:** The brain of the operation. It receives messages, talks to the database, and calls the AI.
*   **Why we chose it:**
    *   **Speed:** FastAPI is one of the fastest Python frameworks available.
    *   **Async Support:** It handles multiple requests efficiently (great for chat apps).
    *   **Native AI Support:** Python is the language of AI. Using FastAPI makes it easy to integrate with Google's Vertex AI SDK.

### 🧠 AI Model: Gemini on Vertex AI
*   **What it is:** The Large Language Model (LLM) that generates the text.
*   **Why we chose it:**
    *   **Native GCP Integration:** Since we are on Google Cloud Platform (GCP), using Vertex AI eliminates complex authentication setups. It "just works" within the Google ecosystem.
    *   **Capability:** Gemini 1.5/2.5 offers a massive context window, meaning it can "read" a lot of resume data before answering.

### 🗄️ Database: Google Firestore
*   **What it is:** A NoSQL database that stores chat history and vector embeddings (mathematical representations of text).
*   **Why we chose it:**
    *   **Serverless Nature:** We don't have to manage servers. It scales up and down automatically.
    *   **Vector Search:** It has built-in support for vector search, which is essential for RAG (finding the right piece of resume text to answer a question).

---

## 3. How it Works: The RAG Pipeline

"RAG" stands for **Retrieval-Augmented Generation**. It sounds complex, but here is the simple breakdown of what happens when a user asks: *"What did Ashwin do at Google?"*

### Step 1: Retrieval (The "Search")
The backend doesn't just ask the AI immediately. First, it looks through its **Knowledge Base** (stored in Firestore).
*   It converts the user's question into a "vector" (a list of numbers).
*   It compares this vector to the vectors of Ashwin's resume projects.
*   It finds the most relevant text chunks (e.g., the paragraph about his time at Google).

### Step 2: Augmentation (The "Context")
The backend constructs a specific prompt for the AI. It looks something like this:

> **System:** You are Ashwin's Digital Twin. Answer the user's question using ONLY the context below.
>
> **Context:** (The paragraph we found in Step 1 about Google...)
>
> **User Question:** "What did Ashwin do at Google?"

### Step 3: Generation (The "Answer")
The Gemini model reads the prompt and the context. Because we gave it the *exact* facts from the resume, it generates an accurate, hallucination-free answer.

### Step 4: Tool Use (Optional)
If the user says *"Please email Ashwin my contact info"*, the AI recognizes this intent. Instead of generating text, it asks the backend to run a function (`send_email_via_brevo`). The backend executes the code to send the email and confirms back to the AI.

---

## 4. Key Files for New Developers

*   **Frontend**: `portfolio/src/components/ChatWidget.jsx` - Contains the chat UI logic, message state, and API calls.
*   **Backend**: `Assistant/app/main.py` - The entry point for the API. Defines the `/chat` endpoint and connects the pieces together.
*   **Prompts**: `Assistant/app/main.py` (look for `SYSTEM_INSTRUCTION`) - This defines the personality and rules for the AI.

## 5. Deployment Flow

1.  **Frontend**: Built with `npm run build` and pushed to Firebase Hosting.
2.  **Backend**: Containerized with Docker and pushed to Google Cloud Run.
