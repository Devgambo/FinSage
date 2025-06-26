# 🧠 FinSolve AI Assistant

A full-stack **Role-Based AI Assistant** for HR and Finance teams — powered by **FastAPI**, **React**, **Zustand**, and **LLM-based Retrieval-Augmented Generation (RAG)**.  
It enables authorized users (HRs, Analysts, etc.) to query internal documents securely and conversationally.

---

## 🚀 Features

- ✅ **Role-Based Access Control (RBAC)** for secure document visibility
- 🧠 **LLM-powered Q&A** on HR/Finance/Engi/Marketing data
- 🔐 **Basic Auth with persistent login** via Zustand
- 📁 **Document chunking + embedding** using `langchain`, `ChromaDB`
- 💬 **Chat with memory** — each session retains conversation context
- 🧑‍💼 **Admin dashboard** to manage users and roles (HR only)
- 🎨 Clean, responsive UI with **TailwindCSS**

---

## 📦 Tech Stack

| Layer        | Tech Used                                   |
|--------------|---------------------------------------------|
| Frontend     | React, Zustand, Tailwind CSS, Axios         |
| Backend      | FastAPI, LangChain, Groq (LLM), SQLiteCloud |
| State Mgmt   | Zustand (with persistence & expiry)         |
| Embeddings   | `sentence-transformers`, `ChromaDB`
| Auth         | HTTP Basic Auth with role-based logic       |
| Storage      | SQLite ( Locally for now )                     |

---

## 🛠️ Setup Instructions

### ⚙️ Backend

1. **Create & activate a virtual environment**
   ```bash
   uv venv
   .venv/Scripts/activate  
   # or `source venv/bin/activate` on Mac/Linux
   ```

2. **Install dependencies**
   ```bash
   uv pip install -r requirements.txt
   ```

3. **Start the FastAPI server**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

4. **.env Example**
   ```
   GROQ_API_KEY=...
   ```

---

### 🎨 Frontend

1. **Create the React app**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```

3. **API Connection**
   API base URL is set to `http://localhost:8000` in `api/api.js`

---

## 🔑 Authentication & RBAC

- Login using **Basic Auth** (username/password)
- Users are stored in a SQLiteCloud DB with assigned roles
- Role-based access enforced on:
  - `/chat`: All roles
  - `/users/get-all`: HR only
  - `/users/delete`: HR only
  - `/users/add`: HR only

---

## 💬 Chat Example

```json
POST /chat
{
  "message": "Show all Business Analysts"
}
```

Response:

```json
{
  "message": {
    "response": "['Krishna Malhotra', 'Sai Sharma']",
    "source_locations": [...],
    "source_content": [...]
  }
}
```

---

## 📁 Folder Structure

```
backend/
├── app/
│   ├── main.py
│   ├── utils/
│   ├── services/
│   └── llm_service.py
frontend/
├── src/
│   ├── components/
│   ├── store/
│   ├── api/
│   └── pages/
```

---

## 🧪 Sample Test Users

| Username | Password | Role   |
|----------|----------|--------|
| `admin`  | `admin`  | `hr`   |
| `sai`    | `sai123` | `user` |

---

## 🔐 Security Notes

- Passwords are currently stored in plain text (dev only) — hash before deploying
- Basic Auth is suitable for internal tools; switch to JWT for public access

---
## 🖼️UI

