import fitz 
import os
import json

input_dir = "/app/input"
output_dir = "/app/output"

def extract_outline(pdf_path):
    doc = fitz.open(pdf_path)
    headings = []
    max_font = 0
    title = ""
    
    for page_num, page in enumerate(doc):
        blocks = page.get_text("dict")["blocks"]
        for b in blocks:
            if "lines" not in b:
                continue
            for line in b["lines"]:
                for span in line["spans"]:
                    text = span["text"].strip()
                    font_size = span["size"]
                    is_bold = "bold" in span["font"].lower()
                    if page_num == 0 and font_size > max_font and len(text.split()) > 2:
                        max_font = font_size
                        title = text
                    
                    if len(text.split()) < 20 and font_size > 8:
                        level = None
                        if font_size > 16:
                            level = "H1"
                        elif font_size > 13:
                            level = "H2"
                        elif font_size > 11:
                            level = "H3"

                        if level:
                            headings.append({
                                "level": level,
                                "text": text,
                                "page": page_num + 1
                            })

    return {
        "title": title.strip(),
        "outline": headings
    }

for file in os.listdir(input_dir):
    if file.endswith(".pdf"):
        pdf_path = os.path.join(input_dir, file)
        output_path = os.path.join(output_dir, file.replace(".pdf", ".json"))

        print(f"📄 Processing: {file}")
        output_data = extract_outline(pdf_path)
        with open(output_path, "w") as f:
            json.dump(output_data, f, indent=2)
        print(f"✅ Output written to: {output_path}")
