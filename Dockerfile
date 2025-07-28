FROM --platform=linux/amd64 python:3.10-slim

WORKDIR /app

COPY ./app /app

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir pymupdf

ENTRYPOINT ["python", "main.py"]
