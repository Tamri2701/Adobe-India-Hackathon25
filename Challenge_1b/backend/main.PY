from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import fitz  # PyMuPDF
import os
import re
import time
from langdetect import detect, DetectorFactory
from uuid import uuid4

DetectorFactory.seed = 0

app = FastAPI()

# Serve static files from ./static
static_dir = "./static"
os.makedirs(static_dir, exist_ok=True)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

persona = {
    "role": "Investment Analyst",
    "focus": "Revenue trends, R&D investments, market positioning",
}

job = "Analyze revenue trends, R&D investments and market positioning strategies"

H1_MIN_SIZE = 15
H2_MIN_SIZE = 12


def is_heading(text: str, lang="en") -> bool:
    text = text.strip()
    if not text or len(text) < 4 or len(text) > 120:
        return False
    if text.isdigit():
        return False
    if lang == "ja":
        if re.search(r"[\u4E00-\u9FFF\u3040-\u30FF]", text) and len(text) <= 20:
            return True
        return False
    if text.isupper() or text.istitle() or re.match(r"^\d+\.?\s+[A-Z]", text):
        return True
    if text[0].isupper() and not text.islower():
        return True
    return False


def extract_main_headings_and_subheadings(pdf_path: str):
    doc = fitz.open(pdf_path)
    try:
        first_page_text = doc[0].get_text()
        lang = detect(first_page_text) if first_page_text.strip() else "en"
    except Exception:
        lang = "en"

    outline = []
    seen_headings = set()

    for page_num, page in enumerate(doc, start=1):
        blocks = page.get_text("dict")["blocks"]
        for block in blocks:
            if block["type"] != 0:
                continue
            for line in block["lines"]:
                for span in line["spans"]:
                    text = span["text"].strip()
                    fontsize = span["size"]
                    if not is_heading(text, lang):
                        continue

                    if fontsize >= H1_MIN_SIZE:
                        level = "H1"
                    elif fontsize >= H2_MIN_SIZE:
                        level = "H2"
                    else:
                        continue

                    if text in seen_headings:
                        continue
                    seen_headings.add(text)

                    outline.append({
                        "level": level,
                        "fontsize": fontsize,
                        "text": text,
                        "page": page_num,
                    })

    # Sort by page, then H1 before H2
    outline.sort(key=lambda x: (x["page"], 0 if x["level"] == "H1" else 1))
    return outline


def extract_title_from_outline(outline: list, fallback="Unknown Document") -> str:
    for item in outline:
        if item["level"] == "H1":
            return item["text"]
    if outline:
        return outline[0]["text"]
    return fallback


@app.post("/extract-outline")
async def extract_outline(pdf_file: UploadFile = File(...)):
    start_time = time.time()

    # Make filename unique to avoid collisions
    original_name = os.path.splitext(pdf_file.filename)[0]
    unique_filename = f"{original_name}_{uuid4().hex}.pdf"
    save_path = os.path.join(static_dir, unique_filename)

    # Save uploaded file
    with open(save_path, "wb") as f_out:
        while chunk := await pdf_file.read(1024 * 1024):
            f_out.write(chunk)

    try:
        outline = extract_main_headings_and_subheadings(save_path)
        title = extract_title_from_outline(outline, original_name)
        elapsed = time.time() - start_time
        pdf_url = f"http://localhost:8000/static/{unique_filename}"

        response = {
            "title": title,
            "outline": outline,
            "pdf_url": pdf_url,
            "metadata": {
                "input_document": unique_filename,
                "persona": persona,
                "job": job,
                "processing_time_seconds": round(elapsed, 3),
                "processing_timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
            },
        }
        return response

    except Exception as e:
        # Log or handle error properly
        raise e
