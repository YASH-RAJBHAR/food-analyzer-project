import React, { useState, useEffect, useRef } from "react";
import DietMatrix from "./DietMatrix";
import { getVerifiedFoodImage } from "../utils/foodImageMap";
import { API_BASE_URL } from "../config";

function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [correcting, setCorrecting] = useState(false);
  const [displayScore, setDisplayScore] = useState(0);
  const [userReaction, setUserReaction] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [resultImgError, setResultImgError] = useState(false);
  const [isUserConfirmed, setIsUserConfirmed] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const scanProgressMessages = [
    "📸 Reading image...",
    "🔍 Detecting food & non-food objects...",
    "🍽️ Identifying dish taxonomy & region...",
    "🧠 Analyzing nutrition & 14-diet matrix...",
    "✨ Preparing your result report..."
  ];

  const indianSamplePresets = [
    { name: "Vada Pav (Mumbai)", filename: "vada_pav.jpg", url: "/images/foods/vada-pav.jpg" },
    { name: "Pav Bhaji (Maharashtra)", filename: "pav_bhaji.jpg", url: "/images/foods/pav-bhaji.jpg" },
    { name: "Masala Dosa (South India)", filename: "masala_dosa.jpg", url: "/images/foods/masala-dosa.jpg" },
    { name: "Chicken Biryani (Hyderabad)", filename: "chicken_biryani.jpg", url: "/images/foods/chicken-biryani.jpg" },
    { name: "Chole Bhature (Punjab)", filename: "chole_bhature.jpg", url: "/images/foods/chole-bhature.jpg" },
    { name: "Samosa (North India)", filename: "samosa.jpg", url: "/images/foods/samosa.jpg" }
  ];

  const popularSearchOptions = [
    "Vada Pav", "Batata Vada", "Pav Bhaji", "Misal Pav", "Masala Dosa", "Plain Dosa", "Idli Sambar", "Medu Vada",
    "Samosa", "Pani Puri", "Chole Bhature", "Rajma Chawal", "Dal Makhani", "Dal Tadka",
    "Aloo Paratha", "Paneer Tikka", "Butter Chicken", "Hyderabadi Biryani", "Chicken Biryani",
    "Poha", "Upma", "Dhokla", "Gulab Jamun", "Margherita Pizza", "Cheeseburger", "Sushi Platter"
  ];

  // Count up animation for Health Score when analysis finishes
  useEffect(() => {
    if (analysis && analysis.healthScore) {
      let current = 0;
      const target = analysis.healthScore;
      const timer = setInterval(() => {
        current += 2;
        if (current >= target) {
          setDisplayScore(target);
          clearInterval(timer);
        } else {
          setDisplayScore(current);
        }
      }, 25);
      return () => clearInterval(timer);
    }
  }, [analysis]);

  // Clean up camera stream on component unmount
  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  const startWebcam = async () => {
    setError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Could not access live camera. Please ensure camera permissions are granted or select an image file.");
      setIsCameraOpen(false);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const snapPhotoFromCamera = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const capturedFile = new File([blob], "camera_snap.jpg", { type: "image/jpeg" });
          setFile(capturedFile);
          setPreview(URL.createObjectURL(capturedFile));
          stopWebcam();
          analyzeImageFile(capturedFile);
        }
      },
      "image/jpeg",
      0.92
    );
  };

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    setError(null);
    setAnalysis(null);
    setUserReaction(null);
    setResultImgError(false);
    setIsUserConfirmed(null);
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handlePresetSelect = async (preset) => {
    try {
      setLoading(true);
      setError(null);
      setUserReaction(null);
      setResultImgError(false);
      setIsUserConfirmed(null);
      setPreview(preset.url);
      const res = await fetch(preset.url);
      const blob = await res.blob();
      const presetFile = new File([blob], preset.filename || "preset_food.jpg", { type: "image/jpeg" });
      setFile(presetFile);
      analyzeImageFile(presetFile);
    } catch (err) {
      setError("Failed to load sample image.");
      setLoading(false);
    }
  };

  const analyzeImageFile = async (imageFile) => {
    const targetFile = imageFile || file;
    if (!targetFile) {
      setError("Please select, take a photo with your camera, or drop a food image first.");
      return;
    }

    setLoading(true);
    setScanStep(0);
    setError(null);
    setAnalysis(null);
    setUserReaction(null);
    setResultImgError(false);
    setIsUserConfirmed(null);

    const stepTimer = setInterval(() => {
      setScanStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    const formData = new FormData();
    formData.append("image", targetFile);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/food/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image. Please ensure backend & AI services are running.");
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || "Upload failed. Check backend connection.");
    } finally {
      clearInterval(stepTimer);
      setLoading(false);
    }
  };

  const handleManualCorrection = async (selectedFoodName) => {
    if (!selectedFoodName) return;
    setCorrecting(true);
    setResultImgError(false);
    setIsUserConfirmed(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/food/correct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food_name: selectedFoodName }),
      });
      if (!response.ok) throw new Error("Correction failed");
      const data = await response.json();
      setAnalysis(data);
      setSearchQuery("");
    } catch (err) {
      setError("Failed to apply manual correction.");
    } finally {
      setCorrecting(false);
    }
  };

  const resultDishImage = analysis ? (preview || getVerifiedFoodImage(analysis.predictedFood)) : null;

  return (
    <div className="upload-container">
      {/* Hidden Canvas element for snapping webcam frames */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Central AI Scanner Focus Card */}
      <div className="cartoon-card scanner-main-card">
        <div className="scanner-header-row">
          <div className="scanner-icon-badge">🤖🍴</div>
          <div>
            <h2 className="scanner-title">What's on your plate? 🍽️</h2>
            <p className="scanner-subtitle">Snap it. Scan it. Understand it. Discover foods from every corner of the world.</p>
          </div>
        </div>

        {/* Live Camera Viewfinder Modal Container */}
        {isCameraOpen && (
          <div className="live-camera-modal" style={{ marginBottom: 20, textAlign: "center" }}>
            <div className="camera-viewfinder-box" style={{ position: "relative", display: "inline-block", border: "4px solid var(--primary-color)", borderRadius: 24, overflow: "hidden", background: "#000" }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: 640, maxHeight: 420, objectFit: "cover" }} />
              <div className="viewfinder-crosshair" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 160, height: 160, border: "3px dashed #2ec4b6", borderRadius: 24, pointerEvents: "none" }}></div>
              <div style={{ position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.75)", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: "0.85rem", fontWeight: 700 }}>
                🔍 Position food inside green target
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 14 }}>
              <button className="cartoon-primary-btn" onClick={snapPhotoFromCamera}>
                📸 Snap Photo & Analyze 🎉
              </button>
              <button className="cartoon-secondary-btn" onClick={stopWebcam}>
                ❌ Close Camera
              </button>
            </div>
          </div>
        )}

        {/* Dropzone Box */}
        <div className={`cartoon-dropzone ${loading ? "is-scanning" : ""}`}>
          {loading && <div className="scanning-laser-beam"></div>}

          {preview ? (
            <div className="preview-wrap">
              <img src={preview} alt="Selected food" className="preview-img-cartoon" />
              {loading && <div className="laser-line-anim"></div>}
            </div>
          ) : (
            <div className="dropzone-empty-content">
              <span className="dropzone-icon">📸</span>
              <h3>Drag & Drop Image Here</h3>
              <p>or take a live camera photo / choose device file</p>
            </div>
          )}

          <div className="dropzone-actions">
            <button className="cartoon-primary-btn" onClick={startWebcam}>
              📷 Take Photo (Live Camera)
            </button>
            <input
              type="file"
              accept="image/*"
              className="file-input"
              id="food-file-input"
              onChange={handleFileChange}
            />
            <label htmlFor="food-file-input" className="cartoon-outline-btn">
              📁 Choose Photo File
            </label>
            <button className="cartoon-action-btn" onClick={() => analyzeImageFile()} disabled={loading}>
              {loading ? "⚡ Scanning Image..." : "⚡ Analyze Food Photo 🎉"}
            </button>
          </div>

          {/* Sample Preset Buttons */}
          <div className="presets-row">
            <small style={{ fontWeight: 700, color: "var(--text-muted)", alignSelf: "center" }}>Sample Dishes: </small>
            {indianSamplePresets.map((preset, idx) => (
              <button key={idx} className="preset-cartoon-chip" onClick={() => handlePresetSelect(preset)}>
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Step Animated AI Scanning Feedback */}
        {loading && (
          <div className="scanning-feedback-box">
            <div className="scanning-robot-spin">🤖</div>
            <p className="scanning-step-msg">{scanProgressMessages[scanStep]}</p>
            <div className="step-dots">
              <span className={scanStep >= 0 ? "active" : ""}></span>
              <span className={scanStep >= 1 ? "active" : ""}></span>
              <span className={scanStep >= 2 ? "active" : ""}></span>
              <span className={scanStep >= 3 ? "active" : ""}></span>
            </div>
          </div>
        )}

        {error && (
          <div className="cartoon-error-banner">
            <span>😕 Oops! {error}</span>
            <button className="cartoon-chip" onClick={() => setError(null)}>Try Again</button>
          </div>
        )}
      </div>

      {/* Analysis Results Display */}
      {analysis && (
        <div className="analysis-results-grid">
          {/* Non-Food Item Detected Error State */}
          {(analysis.isNonFood || analysis.is_food === false) ? (
            <div className="cartoon-card non-food-card" style={{ gridColumn: "1 / -1", textAlign: "center", background: "rgba(255, 89, 100, 0.12)", borderColor: "var(--danger-color)" }}>
              <div style={{ fontSize: "3.5rem", marginBottom: 8 }}>🍽️❓</div>
              <h2 style={{ fontSize: "1.6rem", color: "var(--danger-color)", fontWeight: 800 }}>No Food Detected 🍽️</h2>
              <p style={{ color: "var(--text-main)", fontSize: "1rem", margin: "8px 0 16px", fontWeight: 600 }}>
                {analysis.error_message || "We couldn't identify a food item in this image. Please take a clear photo of a food or meal."}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button className="cartoon-primary-btn" onClick={startWebcam}>
                  📷 Open Camera & Try Again
                </button>
                <button className="cartoon-secondary-btn" onClick={() => setAnalysis(null)}>
                  🔄 Reset Scanner
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Celebratory Success Banner */}
              <div className="celebration-cartoon-banner" style={{ gridColumn: "1 / -1" }}>
                <span className="party-pop">🎉</span>
                <div>
                  <h3>FOOD IDENTIFIED! 🥳</h3>
                  <p>Matched <strong>{analysis.predictedFood}</strong> ({analysis.cuisine || "Indian Cuisine"}) with <strong>{Math.round(analysis.confidence)}% precision!</strong></p>
                </div>
              </div>

              {/* Hero Result Banner Card with User's Uploaded Image */}
              <div className="cartoon-card hero-result-cartoon-card" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                      <span className="cartoon-sticker-badge">{analysis.fun_sticker || "😋 Yum!"}</span>
                      <span className="badge badge-cuisine">🇮🇳 {analysis.cuisine || "Indian"}</span>
                      <span className="badge badge-region">📍 {analysis.region || "India"}</span>
                    </div>

                    <h1 className="dish-main-title" style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: 8 }}>
                      ✨ {analysis.predictedFood} ✨
                    </h1>

                    <div className="confidence-cartoon-badge" style={{ marginBottom: 12 }}>
                      <span className="conf-num">AI Confidence: {Math.round(analysis.confidence)}%</span>
                      <div style={{ background: "rgba(0,0,0,0.1)", height: 10, borderRadius: 5, overflow: "hidden", marginTop: 4, width: 220 }}>
                        <div style={{ background: "var(--success-color)", height: "100%", width: `${Math.min(100, Math.max(10, analysis.confidence))}%`, transition: "width 0.6s ease" }}></div>
                      </div>
                    </div>

                    {analysis.differentiator && (
                      <div style={{ background: "var(--card-bg)", padding: "10px 14px", borderRadius: 16, border: "2px solid var(--card-border)", fontSize: "0.88rem", color: "var(--text-main)" }}>
                        💡 <strong>Visual Differentiator:</strong> {analysis.differentiator}
                      </div>
                    )}

                    {/* Requirement #9: "Is this correct?" Confirmation Box */}
                    <div style={{ marginTop: 14, background: "var(--pill-bg)", padding: "12px 16px", borderRadius: 16, border: "2px solid var(--card-border)", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, color: "var(--text-main)", fontSize: "0.95rem" }}>Is this prediction correct?</span>
                      {isUserConfirmed === true ? (
                        <span className="cartoon-chip success" style={{ background: "var(--success-color)", color: "#fff", padding: "6px 14px", borderRadius: 12, fontWeight: 700 }}>
                          ✓ Confirmed Correct!
                        </span>
                      ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className="cartoon-primary-btn"
                            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                            onClick={() => setIsUserConfirmed(true)}
                          >
                            YES 👍
                          </button>
                          <button
                            className="cartoon-secondary-btn"
                            style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                            onClick={() => setIsUserConfirmed(false)}
                          >
                            NO 👎
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Image Display: User's Uploaded / Captured Photo */}
                  <div style={{ textAlign: "center" }}>
                    {resultDishImage && !resultImgError ? (
                      <div style={{ borderRadius: 20, overflow: "hidden", border: "4px solid var(--primary-color)", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", height: 180, position: "relative" }}>
                        <img
                          src={resultDishImage}
                          alt={analysis.predictedFood}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          onError={() => setResultImgError(true)}
                        />
                        <span style={{ position: "absolute", bottom: 6, right: 6, background: "rgba(0,0,0,0.75)", color: "#fff", padding: "2px 8px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 700 }}>
                          Your Photo 📸
                        </span>
                      </div>
                    ) : (
                      <div style={{ borderRadius: 20, border: "3px dashed var(--card-border)", padding: "24px 16px", background: "var(--pill-bg)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <span style={{ fontSize: "3rem" }}>🍽️</span>
                        <strong style={{ color: "var(--text-main)", fontSize: "0.95rem", marginTop: 4 }}>Food Image Unavailable</strong>
                        <small style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 2 }}>Verified nutrition report displayed below</small>
                      </div>
                    )}
                  </div>
                </div>

                {/* Portion & Method Metadata */}
                <div className="meta-pills-row" style={{ marginTop: 16 }}>
                  <span className="meta-cartoon-pill">⚖️ Portion: <strong>{analysis.portionSize || analysis.portion_estimate || "1 Serving"}</strong></span>
                  <span className="meta-cartoon-pill">📦 Weight: <strong>{analysis.estimatedWeight || "300g"}</strong></span>
                  <span className="meta-cartoon-pill">🔥 Method: <strong>{analysis.cookingMethod || "Fresh Prepared"}</strong></span>
                </div>

                {/* Manual Correction Search Bar (Visible if user clicks NO or wants to search) */}
                {(isUserConfirmed === false || !isUserConfirmed) && (
                  <div className="manual-search-box" style={{ marginTop: 16 }}>
                    <label className="manual-lbl">Search & correct dish manually:</label>
                    <div className="search-input-row">
                      <input
                        type="text"
                        className="cartoon-text-input"
                        placeholder="e.g. Vada Pav, Batata Vada, Pav Bhaji, Misal Pav, Dosa, Idli..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <button
                        className="cartoon-secondary-btn"
                        onClick={() => handleManualCorrection(searchQuery)}
                        disabled={correcting || !searchQuery.trim()}
                      >
                        {correcting ? "Updating..." : "Correct Dish ⚡"}
                      </button>
                    </div>

                    <div className="quick-fixes-row">
                      <small style={{ color: "var(--text-muted)", alignSelf: "center" }}>Quick Fix: </small>
                      {popularSearchOptions.slice(0, 9).map((item, idx) => (
                        <span key={idx} className="quick-chip" onClick={() => handleManualCorrection(item)}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Transparent AI Health Score Card */}
              <div className="cartoon-card health-score-cartoon-card">
                <h3>🥗 AI HEALTH SCORE</h3>
                <div className="animated-score-box">
                  <div className="animated-score-num">{displayScore}</div>
                  <div className="score-denom-text">/ 100</div>
                  <div className={`score-badge-pill score-${(analysis.healthScoreRating || "Good").toLowerCase()}`}>
                    {analysis.healthScoreRating || "Good"} ({analysis.processingLevel || "Minimal Processing"})
                  </div>
                </div>

                <div className="health-checks-list">
                  <h4 style={{ color: "var(--success-color)", marginBottom: 4, fontSize: "0.85rem" }}>Positive Checks:</h4>
                  {analysis.healthPositiveChecks && analysis.healthPositiveChecks.map((item, idx) => (
                    <div key={idx} className="check-item positive">{item}</div>
                  ))}

                  <h4 style={{ color: "var(--warning-color)", marginTop: 10, marginBottom: 4, fontSize: "0.85rem" }}>Needs Attention:</h4>
                  {analysis.healthAttentionWarnings && analysis.healthAttentionWarnings.map((item, idx) => (
                    <div key={idx} className="check-item warning">{item}</div>
                  ))}
                </div>

                <p className="disclaimer-note">
                  ⚠️ Disclaimer: Informational estimates only. This application does not provide a medical diagnosis.
                </p>
              </div>

              {/* Cartoon Nutrition Cards */}
              <div className="cartoon-card">
                <h3>📊 Macronutrients Breakdown</h3>
                <div className="cartoon-macro-grid">
                  <div className="cartoon-macro-item">
                    <span className="macro-cartoon-icon">🔥</span>
                    <span className="macro-cartoon-val">{analysis.calories}</span>
                    <span className="macro-cartoon-lbl">Calories (kcal)</span>
                  </div>
                  <div className="cartoon-macro-item">
                    <span className="macro-cartoon-icon">💪</span>
                    <span className="macro-cartoon-val">{analysis.protein}g</span>
                    <span className="macro-cartoon-lbl">Protein</span>
                  </div>
                  <div className="cartoon-macro-item">
                    <span className="macro-cartoon-icon">🍚</span>
                    <span className="macro-cartoon-val">{analysis.carbs}g</span>
                    <span className="macro-cartoon-lbl">Carbohydrates</span>
                  </div>
                  <div className="cartoon-macro-item">
                    <span className="macro-cartoon-icon">🥑</span>
                    <span className="macro-cartoon-val">{analysis.fat}g</span>
                    <span className="macro-cartoon-lbl">Healthy Fat</span>
                  </div>
                  <div className="cartoon-macro-item">
                    <span className="macro-cartoon-icon">🌾</span>
                    <span className="macro-cartoon-val">{analysis.fiber || 3.8}g</span>
                    <span className="macro-cartoon-lbl">Dietary Fiber</span>
                  </div>
                  <div className="cartoon-macro-item">
                    <span className="macro-cartoon-icon">🍬</span>
                    <span className="macro-cartoon-val">{analysis.sugar || 3.2}g</span>
                    <span className="macro-cartoon-lbl">Sugars</span>
                  </div>
                </div>
              </div>

              {/* Cartoon Micronutrients */}
              <div className="cartoon-card">
                <h3>🧪 Micronutrients & Minerals</h3>
                <div className="cartoon-micro-grid">
                  <div className="micro-cartoon-item"><span>Vitamin A</span> <strong>{analysis.vitaminA || 140} IU</strong></div>
                  <div className="micro-cartoon-item"><span>Vitamin C</span> <strong>{analysis.vitaminC || 18} mg</strong></div>
                  <div className="micro-cartoon-item"><span>Vitamin D</span> <strong>{analysis.vitaminD || 2.5} mcg</strong></div>
                  <div className="micro-cartoon-item"><span>Iron</span> <strong>{analysis.iron || 2.6} mg</strong></div>
                  <div className="micro-cartoon-item"><span>Calcium</span> <strong>{analysis.calcium || 70} mg</strong></div>
                  <div className="micro-cartoon-item"><span>Potassium</span> <strong>{analysis.potassium || 360} mg</strong></div>
                  <div className="micro-cartoon-item"><span>Sodium</span> <strong>{analysis.sodium || 340} mg</strong></div>
                  <div className="micro-cartoon-item"><span>Zinc</span> <strong>{analysis.zinc || 1.9} mg</strong></div>
                </div>
              </div>

              {/* 14-Diet Compatibility Matrix UI */}
              <div style={{ gridColumn: "1 / -1" }}>
                <DietMatrix
                  dietCompatibility={analysis.dietCompatibility || []}
                  foodName={analysis.predictedFood}
                  protein={analysis.protein}
                  carbs={analysis.carbs}
                  fat={analysis.fat}
                  sugar={analysis.sugar}
                  sodium={analysis.sodium}
                />
              </div>

              {/* Ingredients & Allergen Warnings */}
              <div className="cartoon-card">
                <h3>🥘 Ingredients & 13+ Allergen Warnings</h3>
                <div className="ingredients-box">
                  <h4>Known / Detected Ingredients:</h4>
                  <div className="cartoon-pill-tags">
                    {analysis.ingredients && analysis.ingredients.map((ing, idx) => (
                      <span key={idx} className="cartoon-pill-tag">🥔 {ing}</span>
                    ))}
                  </div>

                  <h4 style={{ marginTop: 14 }}>Possible Allergens:</h4>
                  <div className="cartoon-pill-tags">
                    {analysis.allergens && analysis.allergens.length > 0 ? (
                      analysis.allergens.map((alg, idx) => (
                        <span key={idx} className="cartoon-pill-tag allergen">⚠️ {alg}</span>
                      ))
                    ) : (
                      <span className="cartoon-pill-tag success">✓ No Major Allergens Detected</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recipe Recommendations */}
              <div className="cartoon-card">
                <h3>🍳 Recipe & Cooking Instructions</h3>
                <div className="recipe-links">
                  {analysis.recipeSuggestions && analysis.recipeSuggestions.map((rec, idx) => (
                    <span key={idx} className="recipe-chip-item">📖 {rec}</span>
                  ))}
                </div>
                {analysis.sourceUrl && (
                  <a href={analysis.sourceUrl} target="_blank" rel="noreferrer" className="cartoon-primary-btn" style={{ display: "inline-block", marginTop: 12 }}>
                    View Recipe Instructions 📖
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Upload;
