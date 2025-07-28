# 📑 Document Insight Viewer — Adobe India Hackathon 2025
========================================
# Table of Contents
========================
1. Overview
2. Features
3. Project Structure
4. Backend API
5. Frontend (React App)
6. PDF Outline Extraction (FastAPI)
7. Semantic Relevance Extraction (Standalone Script)
8. Multilingual Handling
9. Offline & Docker Deployment
10. How to Run
   - Clone the repository
   - Install dependencies
   - Start the backend server
   - Start the frontend development server
   - Open the app in your browser
11. Troubleshooting
12. Authors
13. License


# 📝 Overview:
Document Insight Viewer is a full-stack offline PDF document analytics solution for the Adobe India Hackathon 2025.

📄 Extracts clean, hierarchical outlines from PDFs (H1/H2 sections with page numbers).
🔍 Lets users navigate a document by clicking extracted headings.
🤖 Performs semantic section ranking with Sentence Transformers for deep relevance search.
🌐 Fully offline and Dockerized: No runtime network calls.
🧑 Persona-driven: All extraction and UI is focused on the analyst’s role and tasks.
💻 Modern React frontend with Adobe Embed API for PDF display and clickable navigation.

# 🚀 Features
    - PDF upload & viewing with clickable, scrollable sidebar outline.
    - Automatic outline detection: Levels H1 and H2, multilingual (English/Japanese).
    - Backend API (FastAPI) to process, extract, and serve PDFs.
    - Frontend (React + Vite): Clean, responsive UI. Outline click jumps to exact page.
    - Semantic transformer section ranking (Round 1B, optional/standalone).
    - Secure, compliant architecture: CPU-only, model <200MB, <10s per 50p PDF.
    - Full Docker deployment for development and production.

# 📂 Project Structure
adobe-round1b/
│
├── .venv/                     # Python venv (if used locally)
├── adobe-round1b/
│   ├── app/
│   │   ├── main.py            # (Standalone) semantic relevance script
│   │   ├── requirements.txt
│   │   ├── model/
│   │   │   └── all-MiniLM-L6-v2/  # Pre-downloaded transformer
│   │   ├── input/             # Input PDFs for batch mode
│   │   └── output/            # JSON output (semantic analysis)
│   ├── Dockerfile
│   └── README.md
├── backend/
│   ├── main.py                # FastAPI backend, PDF heading outline API
│   ├── requirements.txt
│   ├── Dockerfile
│   └── static/                # Saved and served PDFs for HTTP use
├── frontend/
│   ├── src/
│   │   └── App.jsx            # React app w/ Adobe viewer & outline navigation
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md                 # This file

# 🛠️ Backend API
1. Framework: FastAPI (Python 3.9+)
2. Endpoint: /extract-outline (POST)
3. Accepts: PDF file (multipart/form-data)
4. Returns: JSON with:
   - Title
   - Outline ([{level, text, page}])
   - pdf_url (HTTP static path for frontend/Adobe Embed navigation)
   - Metadata including persona, job, processing time, language detected
5. PDF storage: Uploaded files are stored in /static folder and served via /static/{filename}.
6. Multilingual: Adapts heading detection based on detected language (supports Japanese and English out-of-the-box).
7. CPU only: No hardware or cloud dependencies.
8. Performance: Under 10 seconds for 50 pages (empirical, typical doc).
9. Robust: Handles malformed PDFs, skips empty pages gracefully.

# 💡 Frontend (React App)

1. Framework: React (Vite, Node 18+)
2. PDF Viewer: Adobe PDF Embed API, loaded via registered client key for localhost
3. Outline Display:
 - Sidebar shows all H1/H2 titles with page numbers.
 - Outline is clickable, scrollable, and sorted by page.
4. PDF Navigation: Clicking an outline item jumps to the correct page using gotoLocation({ pageNumber }).
 - IMPORTANT: Works because PDF is loaded from HTTP URL, not blob.
5. File Upload: User can upload PDF, see processing state, error messages, and reset/remove with one click.
6. Styling: Professional, accessible, responsive.
7. Bonus: Keyboard navigation for outline via Enter/Space.

# 🎯 PDF Outline Extraction (FastAPI)

How it works:
 - Receives PDF upload via /extract-outline POST.
 - Parses text from each page with PyMuPDF.
 - Extracts likely H1/H2 headings by font size and pattern (with multilingual awareness).
 - Avoids duplicates, returns clean, hierarchical array of {level, text, page} items.
 - Stores a copy of the PDF in /static and returns an HTTP public URL for frontend/viewer loading.

# 🤖 Semantic Relevance Extraction (Standalone Script)

 - Uses Sentence Transformers to encode every page.
 - Ranks all pages by cosine similarity to the persona’s "job to be done".
 - Outputs full JSON file giving the 5 most relevant sections, their content, titles, extracted reasons for importance, and ranks.
 - No internet dependency — works offline with pre-downloaded BERT model.

# 🌏 Multilingual Handling

1. Language detector (langdetect) is used to switch between heading heuristics:
   - English: Title case, all caps, or numbered-section patterns.
   - Japanese: Kanji/Kana presence, short length.
   - Additional languages can be added easily by extending is_heading().

# 🐳 Offline & Docker Deployment

1. All code and models run fully offline.
2. Dockerized complete pipeline:
   - Backend (backend/) runs FastAPI and serves static files.
   - Frontend (frontend/) runs React app via nginx.
   - docker-compose.yml spins up both services with correct volumes and port mapping.
   - /static folder is mounted for PDF serving.

▶️ How to Run
1. Clone the project:
git clone <your-repo-url>
cd adobe-round1b

2. Build and run with Docker Compose:
docker-compose up --build

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

3. Usage:

- Open the app in browser.
- Upload a PDF via UI.
- Sidebar shows outline; click to jump to page in viewer.
- For semantic/batch ranking, drop PDFs in app/input/ and run python main.py (standalone).

# 🐞 Troubleshooting
1. Outline navigation does not work?
 - Make sure PDF is loaded from an HTTP URL given in pdf_url (not blob).
 - Use the exact client key registered for localhost as Adobe API key.

2. CORS errors or Adobe JWT/license errors?
 - Ensure you have registered your Adobe Developer Console client key.
 - Confirm the key is set in frontend/src/App.jsx.
 - Check that the Adobe Developer Console whitelist includes localhost (no protocol/port).

3. Docker errors on Windows:
    - Ensure Docker Desktop is set to use Linux containers.
    - If using WSL2, ensure it is properly configured and running.
    - If you encounter issues with file permissions, try running Docker with elevated privileges.

4. Semantic extractor (main.py) missing model error?
 - Ensure you have downloaded the all-MiniLM-L6-v2 model and placed it in adobe-round1b/app/model/all-MiniLM-L6-v2.
 - You can download it from Hugging Face or use the provided code snippet in the README to download it automatically.

# 👨‍💻 Authors
1. Tania
    📧 tania.24mca10149@vitbhopal.ac.in
    🔗 [GitHub](https://github.com/Tamri2701) | [LinkedIn](https://www.linkedin.com/in/tania-b95400255/)

2. Mohit Kumar
    📧 mohit.jnajadiya@gmail.com
    🔗 [GitHub](https://github.com/M0h1it) | [LinkedIn](https://www.linkedin.com/in/mohit-kumar-b2a80a20a/)

3. Sanket Kumar Das
    📧 Sanketlives@gmail.com
    🔗 [GitHub](https://github.com/Saanket-Das) | [LinkedIn](https://www.linkedin.com/in/sanket-kumar-das-598298229/).

# 📚 Hackathon Notes
1. Submission is offline-capable, Dockerized, metadata-rich, and persona-aware.
2. All UI/API logic respects Adobe India Hackathon 2025 official requirements (see hackathon PDF).
3. Easily extensible for new personas, jobs, or languages.