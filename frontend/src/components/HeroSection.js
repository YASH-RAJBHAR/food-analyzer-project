import React, { useState } from "react";

function HeroSection({ onScanClick, onExploreClick }) {
  const [mascotQuote, setMascotQuote] = useState("Hi there! I'm Chef Bot 🤖! Snap any dish with NutriSnap AI to get instant calories, macros & diet insights! 🎉");

  const floatingFoods = [
    { emoji: "🍕", style: { top: "10%", left: "5%", animationDelay: "0s" } },
    { emoji: "🍔", style: { top: "65%", left: "8%", animationDelay: "1.2s" } },
    { emoji: "🥗", style: { top: "15%", right: "6%", animationDelay: "0.6s" } },
    { emoji: "🥞", style: { top: "70%", right: "8%", animationDelay: "1.8s" } },
    { emoji: "🥪", style: { top: "40%", left: "2%", animationDelay: "2.4s" } },
    { emoji: "🍛", style: { top: "45%", right: "3%", animationDelay: "3.0s" } },
    { emoji: "🥟", style: { top: "85%", left: "25%", animationDelay: "1.5s" } },
    { emoji: "🥑", style: { top: "85%", right: "25%", animationDelay: "2.1s" } },
  ];

  const mascotQuotes = [
    "Hi there! I'm Chef Bot 🤖! Snap any dish with NutriSnap AI to get instant calories, macros & diet insights! 🎉",
    "NutriSnap AI recognizes 200+ global & Indian regional dishes with high precision! 🥪",
    "I can check 14 dietary rules like Vegan, Keto, Gluten-Free & Diabetic Friendly! 🥑",
    "Scan a barcode or nutrition panel anytime! NutriSnap AI reads packaged labels too! 📦"
  ];

  const cycleQuote = () => {
    const nextIdx = (mascotQuotes.indexOf(mascotQuote) + 1) % mascotQuotes.length;
    setMascotQuote(mascotQuotes[nextIdx]);
  };

  return (
    <div className="hero-cartoon-container">
      {/* Floating background food emojis */}
      {floatingFoods.map((item, idx) => (
        <span key={idx} className="floating-food-item" style={item.style}>
          {item.emoji}
        </span>
      ))}

      <div className="hero-cartoon-content">
        <div className="hero-text-side">
          <div className="hero-mini-badge">✨ AI-Powered Food Recognition</div>
          <h1 className="hero-main-title">What's on your plate? 🍽️</h1>
          <h3 className="hero-main-subtitle" style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--primary-color)", marginBottom: 8 }}>
            Snap it. Scan it. Understand it.
          </h3>
          <p className="hero-supporting-text" style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
            NutriSnap AI uses artificial intelligence to recognize food from around the world and provide nutrition, ingredients, allergens, diet compatibility and health insights.
          </p>

          <div className="hero-action-row">
            <button className="cartoon-primary-btn" onClick={onScanClick}>
              📷 Scan Food Now 🍴
            </button>
            <button className="cartoon-secondary-btn" onClick={onExploreClick}>
              🇮🇳 Explore Indian Food
            </button>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat-chip">
              <span className="stat-num">200+</span>
              <span className="stat-lbl">Global & Indian Dishes</span>
            </div>
            <div className="hero-stat-chip">
              <span className="stat-num">98%</span>
              <span className="stat-lbl">AI Vision Precision</span>
            </div>
            <div className="hero-stat-chip">
              <span className="stat-num">14</span>
              <span className="stat-lbl">Diet Matrix Checks</span>
            </div>
          </div>
        </div>

        {/* Animated AI Mascot Chef Bot with Speech Bubble */}
        <div className="hero-mascot-side">
          <div className="mascot-speech-bubble" onClick={cycleQuote} title="Click mascot for nutrition tips!">
            <p>{mascotQuote}</p>
            <span className="bubble-tail"></span>
          </div>

          <div className="mascot-avatar-box" onClick={cycleQuote} style={{ cursor: "pointer" }}>
            <div className="mascot-hat">🍳</div>
            <div className="mascot-body">
              <div className="mascot-face">🤖</div>
              <div className="mascot-sparkle">✨</div>
            </div>
            <div className="mascot-plate">
              <span>🥪 Vada Pav AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
