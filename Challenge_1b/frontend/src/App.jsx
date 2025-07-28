import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import logoImage from "./logo1.png";

const ADOBE_EMBED_API_KEY = "dc2ee2584cd749968ac40eed314ef207";
const ADOBE_EMBED_API_SCRIPT = "https://documentcloud.adobe.com/view-sdk/viewer.js";

function App() {
  const viewerRef = useRef(null);
  const previewRef = useRef(null);

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfURL, setPdfURL] = useState(null);
  const [outline, setOutline] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [pdfReady, setPdfReady] = useState(false);
  const [totalPages, setTotalPages] = useState(null);

  // Load Adobe Embed API once
  useEffect(() => {
    if (!window.AdobeDC) {
      const script = document.createElement("script");
      script.src = ADOBE_EMBED_API_SCRIPT;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Load PDF in Adobe viewer when pdfURL or pdfFile changes
  useEffect(() => {
    if (viewerRef.current) viewerRef.current.innerHTML = "";
    setPdfReady(false);
    setTotalPages(null);

    if (pdfURL && window.AdobeDC && viewerRef.current) {
      const adobeDCView = new window.AdobeDC.View({
        clientId: ADOBE_EMBED_API_KEY,
        divId: "adobe-dc-view",
      });

      adobeDCView
        .previewFile(
          {
            content: { location: { url: pdfURL } },
            metaData: { fileName: pdfFile?.name || "Document.pdf" },
          },
          {}
        )
        .then(async (viewer) => {
          previewRef.current = viewer;
          setPdfReady(true);

          // Attempt to retrieve the total number of pages
          try {
            const apis = await viewer.getAPIs();
            const props = await apis.getPDFProperties();
            if (props && typeof props.numPages === "number") {
              setTotalPages(props.numPages);
            }
          } catch (e) {
            setTotalPages(null);
            console.warn("Unable to get total pages:", e);
          }
        })
        .catch((err) => {
          setErrorMsg("Failed to load PDF preview.");
          console.error(err);
        });
    } else {
      previewRef.current = null;
    }
  }, [pdfURL, pdfFile]);

  // Handle file input, upload to backend and get outline + PDF URL
  const handleFileChange = async (e) => {
    setErrorMsg("");
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setPdfFile(file);
    setOutline(null);
    setTotalPages(null);

    const formData = new FormData();
    formData.append("pdf_file", file);

    try {
      const response = await fetch("http://localhost:8000/extract-outline", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to extract outline");

      const data = await response.json();

      // Convert outline pages consistently to numbers
      if (data.outline) {
        data.outline = data.outline.map((item) => ({
          ...item,
          page: Number(item.page),
        }));
      }

      setOutline(data.outline);
      setPdfURL(data.pdf_url);
    } catch (error) {
      setErrorMsg(error.message || "Error extracting outline.");
      setPdfFile(null);
      setPdfURL(null);
      setOutline(null);
    } finally {
      setLoading(false);
    }
  };

  // Remove uploaded PDF and reset all state
  const handleRemove = () => {
    setPdfFile(null);
    setOutline(null);
    setPdfURL(null);
    setPdfReady(false);
    setErrorMsg("");
    setTotalPages(null);
    if (viewerRef.current) viewerRef.current.innerHTML = "";
    previewRef.current = null;
  };

  // Navigate to outline page with sanitization and validation for Adobe API
  const handleOutlineClick = (page) => {
    const rawPage = page;
    let validPageNumber = Number(rawPage);

    // Validate page number is a positive integer
    if (!Number.isInteger(validPageNumber) || validPageNumber < 1) {
      setErrorMsg("Invalid page number for navigation.");
      return;
    }
    // Validate against totalPages from Adobe API if known
    if (totalPages && validPageNumber > totalPages) {
      setErrorMsg(`Page number ${validPageNumber} exceeds total pages (${totalPages}).`);
      return;
    }
    if (!previewRef.current || !pdfReady) {
      setErrorMsg("PDF not ready for navigation.");
      return;
    }

    setErrorMsg(""); // Clear any previous errors

    previewRef.current
      .getAPIs()
      .then((apis) => {
        apis.gotoLocation({ pageNumber: validPageNumber }).catch((err) => {
          setErrorMsg("Failed to navigate to page.");
          console.error("Adobe gotoLocation error:", err.message || err);
        });
      })
      .catch((err) => {
        setErrorMsg("Failed to access PDF APIs.");
        console.error(err);
      });

    setHoverIdx(-1);
  };

  return (
    <>
      <header className="header">
        <img src={logoImage} alt="Logo" className="logo" />
        Document Insight Viewer
      </header>
      <main
        className="main-container"
        style={{ display: "flex", height: "100vh", backgroundColor: "#f5f7fa" }}
      >
        <nav
          className="sidebar"
          style={{
            width: 320,
            borderRight: "1px solid #ddd",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          <h2>Upload PDF</h2>
          <div style={{ position: "relative" }}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={pdfFile !== null || loading}
              style={{
                width: "100%",
                padding: "8px 30px 8px 10px",
                fontSize: "1rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                boxSizing: "border-box",
                cursor: pdfFile || loading ? "not-allowed" : "pointer",
              }}
              title={pdfFile ? pdfFile.name : ""}
            />
            {(pdfFile || loading) && (
              <button
                aria-label="Remove uploaded PDF"
                title="Remove"
                onClick={handleRemove}
                style={{
                  position: "absolute",
                  right: 6,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "#eee",
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  fontSize: 18,
                  cursor: "pointer",
                  lineHeight: 1,
                  padding: 0,
                  color: "#555",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#ccc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#eee")}
              >
                &times;
              </button>
            )}
          </div>

          {pdfFile && (
            <p
              style={{
                marginTop: 8,
                fontSize: "0.9rem",
                color: "#555",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              title={pdfFile.name}
            >
              Selected: {pdfFile.name}
            </p>
          )}
          {loading && (
            <p style={{ marginTop: 12, color: "#0275d8", fontWeight: "bold" }}>Processing PDF...</p>
          )}
          {errorMsg && <p style={{ marginTop: 12, color: "#d9534f" }}>{errorMsg}</p>}

          {outline && (
            <>
              <h3 style={{ marginTop: 20 }}>
                Outline{" "}
                {totalPages && (
                  <span style={{ color: "#888", fontSize: "0.8em" }}> (Total pages: {totalPages})</span>
                )}
              </h3>
              <ul
                className="outline-list"
                style={{
                  overflowY: "auto",
                  flexGrow: 1,
                  paddingLeft: 0,
                  listStyle: "none",
                  marginTop: 8,
                  marginBottom: 0,
                }}
                aria-label="Document outline"
              >
                {outline
                  .slice()
                  .sort((a, b) => a.page - b.page)
                  .map(({ text, level, page }, idx) => {
                    const pageNum = Number(page);
                    const isPageValid =
                      Number.isInteger(pageNum) && pageNum >= 1 && (!totalPages || pageNum <= totalPages);
                    return (
                      <li
                        key={idx}
                        className={`outline-item outline-item-${level.toLowerCase()}`}
                        style={{
                          cursor: isPageValid ? "pointer" : "not-allowed",
                          padding: "6px 10px",
                          borderRadius: 4,
                          marginLeft: level === "H2" ? 16 : level === "H3" ? 32 : 0,
                          backgroundColor: hoverIdx === idx ? "#f0f0f0" : "transparent",
                          userSelect: "none",
                          color: isPageValid ? "inherit" : "#aaa",
                          textDecoration: isPageValid ? "none" : "line-through",
                        }}
                        onClick={() => isPageValid && handleOutlineClick(page)}
                        onMouseEnter={() => isPageValid && setHoverIdx(idx)}
                        onMouseLeave={() => isPageValid && setHoverIdx(-1)}
                        title={isPageValid ? `Jump to page ${page}` : "Invalid page number"}
                        tabIndex={isPageValid ? 0 : -1}
                        onKeyDown={(e) => {
                          if ((e.key === "Enter" || e.key === " ") && isPageValid) {
                            handleOutlineClick(page);
                          }
                        }}
                      >
                        {text}
                        <span style={{ fontSize: 12, color: "#888" }}> ({page})</span>
                      </li>
                    );
                  })}
              </ul>
            </>
          )}
        </nav>

        <section
          className="pdf-viewer"
          style={{
            flexGrow: 1,
            padding: "1rem",
            backgroundColor: "#f5f7fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <div
            id="adobe-dc-view"
            ref={viewerRef}
            style={{
              width: "100%",
              maxWidth: 1100,
              height: "90vh",
              backgroundColor: "#fff",
              borderRadius: 8,
              boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            }}
            aria-label="PDF viewer"
          />
        </section>
      </main>
    </>
  );
}

export default App;
