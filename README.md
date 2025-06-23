# student-instructor-platform

## Getting Started

#### Prerequisites

- **Python**: Version 3.12 or higher  
- **Node.js**: Version 20 or higher
- **npm**: Comes bundled with Node.js 20+
- **Git**: (Recommended) For cloning the repository

### Backend (Python)

1. Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2. (Optional) Create and activate a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
2. (Anaconda optional ) Create a virtual env
    ```
    conda create -y -n py312 python=3.12.**
    conda activate py312
    ```    
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. ### Environment Variables

Create a `.env` file in the `backend` directory  , pls check .env file in mail
5. Start the backend server:
    ```bash
    python main.py
    ```
    

### Frontend

1. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2. Install dependencies:
    ```bash
    npm install  --legacy-peer-deps
    ```
3. Start the frontend development server:
    ```bash
  npm run dev
    ```

The frontend will typically run on [http://localhost:5173](http://localhost:5173) and the backend on [http://localhost:5000](http://localhost:5000) by default.




---

## Things to Note

- **Slowness of Response**: The application may experience slow responses due to the use of a free MongoDB tier.
- **API Keys Security**: Do **not** share your OpenAI or MongoDB keys. Exposing these keys can lead to unauthorized usage and potential charges.
- **OpenAI Usage**: Be aware that excessive API calls to OpenAI may result in additional charges to my account :( .