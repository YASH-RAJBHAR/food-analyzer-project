import React, { useState } from "react";
import { API_BASE_URL } from "../config";

function BarcodeOcrScanner({ onScanResult }) {
  const [barcodeInput, setBarcodeInput] = useState("8901058852319");
  const [ocrFile, setOcrFile] = useState(null);
  const [loadingBarcode, setLoadingBarcode] = useState(false);
  const [loadingOcr, setLoadingOcr] = useState(false);
  const [ocrStep, setOcrStep] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const ocrProgressMsgs = [
    "📄 Reading ingredients...",
    "🧪 Checking allergens...",
    "📊 Analyzing nutrition panel...",
    "🎉 Extraction Complete!"
  ];

  const handleBarcodeSubmit = async (e) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    setLoadingBarcode(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/food/barcode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barcode: barcodeInput.trim() }),
      });
      if (!response.ok) throw new Error("Barcode lookup failed");
      const data = await response.json();
      setResult(data);
      if (onScanResult) onScanResult(data);
    } catch (err) {
      setError(err.message || "Failed to scan barcode.");
    } finally {
      setLoadingBarcode(false);
    }
  };

  const handleOcrSubmit = async () => {
    if (!ocrFile) {
      setError("Please select a nutrition label image first.");
      return;
    }
    setLoadingOcr(true);
    setOcrStep(0);
    setError(null);

    const stepInterval = setInterval(() => {
      setOcrStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    const formData = new FormData();
    formData.append("image", ocrFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/food/ocr`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("OCR label scan failed");
      const data = await response.json();
      setResult(data);
      if (onScanResult) onScanResult(data);
    } catch (err) {
      setError(err.message || "OCR scan failed.");
    } finally {
      clearInterval(stepInterval);
      setLoadingOcr(false);
    }
  };

  return (
    <div className="cartoon-card">
      <div className="section-title-row">
        <div>
          <h2>📦 Barcode & OCR Label Scanner</h2>
          <p>Scan UPC/EAN packaged food barcodes or upload nutrition label photos for instant analysis.</p>
        </div>
      </div>

      <div className="scanner-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
        {/* Barcode Scanner Card */}
        <div className="cartoon-dropzone" style={{ padding: 24, textAlign: "left" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "2rem" }}>📦</span>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Scan Packaged Food</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Enter 12/13-digit UPC/EAN barcode:</p>
            </div>
          </div>

          <form onSubmit={handleBarcodeSubmit} style={{ display: "flex", gap: 8, margin: "14px 0" }}>
            <input
              type="text"
              className="cartoon-text-input"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="e.g. 8901058852319"
            />
            <button type="submit" className="cartoon-primary-btn" disabled={loadingBarcode}>
              {loadingBarcode ? "Looking up..." : "Scan Barcode 📦"}
            </button>
          </form>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <small style={{ fontWeight: 700, color: "var(--text-muted)" }}>Try Barcodes: </small>
            <span className="quick-chip" onClick={() => setBarcodeInput("8901058852319")}>Amul Dark Chocolate</span>
            <span className="quick-chip" onClick={() => setBarcodeInput("737628064502")}>Thai Rice Noodle</span>
            <span className="quick-chip" onClick={() => setBarcodeInput("5449000000996")}>Coca-Cola Zero</span>
          </div>
        </div>

        {/* OCR Label Reader Card */}
        <div className="cartoon-dropzone" style={{ padding: 24, textAlign: "left" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "2rem" }}>📄</span>
            <div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Scan Food Label</h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Upload nutrition facts label photo:</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "14px 0" }}>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              id="ocr-file-input"
              onChange={(e) => setOcrFile(e.target.files[0])}
            />
            <label htmlFor="ocr-file-input" className="cartoon-outline-btn" style={{ textAlign: "center" }}>
              📁 Choose Label Image / Take Photo
            </label>
            <button className="cartoon-action-btn" onClick={handleOcrSubmit} disabled={loadingOcr || !ocrFile}>
              {loadingOcr ? "Reading Label..." : "Scan Food Label 📄"}
            </button>
          </div>

          {loadingOcr && (
            <div style={{ textAlign: "center", marginTop: 10, color: "var(--primary-color)", fontWeight: 700, fontSize: "0.9rem" }}>
              {ocrProgressMsgs[ocrStep]}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="cartoon-error-banner" style={{ marginTop: 16 }}>
          <span>😕 {error}</span>
          <button className="quick-chip" onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Product Information Result Card */}
      {result && (
        <div className="cartoon-card hero-result-cartoon-card" style={{ marginTop: 24 }}>
          <div className="hero-result-top">
            <div>
              <span className="cartoon-sticker-badge">📦 Product Scanned</span>
              <h3 className="dish-main-title">{result.predictedFood || result.productName}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Brand: <strong>{result.brand || "Global Brand"}</strong> | Category: {result.categories || "Packaged Product"}</p>
            </div>
            <div className="confidence-cartoon-badge">
              <span className="conf-num">⭐ {result.healthScore || 78}/100</span>
              <span className="conf-lbl">Health Score</span>
            </div>
          </div>

          <div className="cartoon-macro-grid" style={{ marginTop: 16 }}>
            <div className="cartoon-macro-item"><span className="macro-cartoon-icon">🔥</span><span className="macro-cartoon-val">{result.calories}</span><span className="macro-cartoon-lbl">Calories (kcal)</span></div>
            <div className="cartoon-macro-item"><span className="macro-cartoon-icon">💪</span><span className="macro-cartoon-val">{result.protein}g</span><span className="macro-cartoon-lbl">Protein</span></div>
            <div className="cartoon-macro-item"><span className="macro-cartoon-icon">🍚</span><span className="macro-cartoon-val">{result.carbs}g</span><span className="macro-cartoon-lbl">Carbs</span></div>
            <div className="cartoon-macro-item"><span className="macro-cartoon-icon">🥑</span><span className="macro-cartoon-val">{result.fat}g</span><span className="macro-cartoon-lbl">Fat</span></div>
            <div className="cartoon-macro-item"><span className="macro-cartoon-icon">🍬</span><span className="macro-cartoon-val">{result.sugar || 5.0}g</span><span className="macro-cartoon-lbl">Sugars</span></div>
            <div className="cartoon-macro-item"><span className="macro-cartoon-icon">🧂</span><span className="macro-cartoon-val">{result.sodium || 240}mg</span><span className="macro-cartoon-lbl">Sodium</span></div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700 }}>Ingredients & Allergens:</h4>
            <div className="cartoon-pill-tags">
              {result.ingredients && result.ingredients.map((ing, idx) => (
                <span key={idx} className="cartoon-pill-tag">🥔 {ing}</span>
              ))}
              {result.allergens && result.allergens.map((alg, idx) => (
                <span key={idx} className="cartoon-pill-tag allergen">⚠️ {alg}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BarcodeOcrScanner;
