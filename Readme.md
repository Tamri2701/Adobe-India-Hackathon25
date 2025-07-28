🚀 Adobe India Hackathon 2025 – Connecting the Dots
Rethink Reading. Rediscover Knowledge.

What if every time you opened a PDF, it didn’t just sit there — it spoke to you, connected ideas, and narrated meaning across your entire library?

Welcome to the future we’re building — and you're invited to shape it.

📖 The Challenge
Connecting the Dots is about transforming the humble PDF into an intelligent, interactive companion. We're on a mission to reinvent reading — making PDFs come alive with structure, insights, and semantic understanding.

This project is split into two core parts:

🧠 Round 1: Building the Brains
Goal: Extract structured outlines from raw PDFs using blazing-fast, accurate on-device intelligence.

🔹 Challenge 1A – PDF Processing with Docker
Objective: Efficiently extract hierarchical outlines (Title, H1, H2, H3...) from raw PDF files.

Tech Stack: Python, PyMuPDF, Docker

Key Features:

Offline and containerized PDF structure extraction.

Output includes a clean JSON format representing the document's structure.

🔹 Challenge 1B – Multi-Collection Persona-Based Analysis
Objective: Analyze PDFs based on personas (e.g., Student, Researcher, Business Analyst) and extract relevant content sections accordingly.

Tech Stack: Python, NLTK / Custom heuristics, Persona mapping logic

Key Features:

Intelligent section filtering based on persona needs.

Output relevance reasoning along with extracted section titles.

Works seamlessly across multiple document collections.

💡 Round 2: Bringing It to Life
Goal: Build a beautiful, futuristic webapp powered by your Round 1 logic.

🔹 PDF Reading WebApp
Objective: Create a responsive reading interface that surfaces insights using Round 1 outputs.

Tech Stack: React (Vite), FastAPI, Tailwind CSS, Adobe PDF Embed API

Key Features:

Interactive PDF viewer with smart section highlighting.

Persona selection to personalize content experience.

Upload multiple documents and unify insights across them.

Offline processing — no external APIs required.

🌟 Why It Matters
In today’s information-dense world, context is king. Our solution doesn't just read — it understands. Whether you're a researcher finding the right section or a student skimming chapters, our tool adapts the document to you.

You're not just building tools — you're shaping how the world reads, learns, and connects.

🧩 Tech Stack Summary
Module	Technology
PDF Parsing	Python, PyMuPDF
Containerization	Docker
Web Frontend	React + Vite, Tailwind CSS
Backend	FastAPI
PDF Rendering	Adobe PDF Embed API
State Management	React Hooks, Context API
Data Format	JSON (structured outlines, analysis results)

📂 Repository Structure

├── round1a-solution/
│   ├── Dockerfile
│   ├── input/                # PDF input directory
│   ├── output/               # JSON output directory
│   └── extract.py            # Main logic for outline extraction

├── round1b-solution/
│   ├── persona_config.json   # Persona configuration
│   ├── analyze.py            # Persona-based section filtering

├── frontend/
│   ├── components/
│   ├── pages/
│   └── main.jsx              # React frontend with PDF Embed integration

├── backend/
│   └── main.py               # FastAPI backend serving persona logic

└── README.md                 # This file
🛠️ How to Run (Locally & with Docker)
Detailed instructions are provided in each challenge folder's README:

round1a-solution/README.md — Run offline PDF outline extraction using Docker.

round1b-solution/README.md — Analyze PDFs with persona filters.

frontend/README.md — Launch the web frontend.

backend/README.md — Start the FastAPI server.

🔮 Future Improvements
✨ Integrate semantic search across uploaded PDFs.

📌 Highlight relevant sections inside the viewer based on persona.

🔍 Add keyword search & summarization features.

🤖 Optional GenAI integration for question answering.

🙌 Authors & Credits
Built with passion for the Adobe India Hackathon 2025 by [Team Mavricks].

Let’s connect the dots. Let’s build the future of reading.

