# PDF Outline Extractor - Adobe Hackathon Round 1A

## 📌 Objective
Extracts hierarchical outlines (Title, H1, H2, H3) from PDF documents based on font size and styling using PyMuPDF.

## 🛠 Approach
- Largest text from page 1 = Document Title
- Font-size-based detection of headings:
  - H1: size > 16
  - H2: size > 13
  - H3: size > 11
- Outputs a JSON file matching the required format

## 🐳 How to Build & Run (for documentation only)
```bash
docker build --platform linux/amd64 -t mysolution:abc123 .
docker run --rm -v $(pwd)/input:/app/input -v $(pwd)/output:/app/output -network none mysolution:abc123

```
## Output Format
{
  "title": "Understanding AI",
  "outline": [
    { "level": "H1", "text": "Introduction", "page": 1 },
    { "level": "H2", "text": "What is AI?", "page": 2 },
    { "level": "H3", "text": "History of AI", "page": 3 }
  ]
}

📦 Dependencies
- PyMuPDF (fitz)
