import React from "react";

function Footer({ activeTab, setActiveTab }) {
  const navItems = [
    { id: "home", label: "Home & Scan", icon: "🏠" },
    { id: "indian", label: "Indian Special", icon: "🇮🇳" },
    { id: "world", label: "World Food", icon: "🌐" },
    { id: "diary", label: "Food Diary", icon: "📓" },
    { id: "matrix", label: "14-Diet Matrix", icon: "🥗" },
    { id: "barcode", label: "Barcode / OCR", icon: "📷" },
    { id: "goals", label: "Goals & Water", icon: "🎯" },
    { id: "chat", label: "AI Coach", icon: "🤖" },
    { id: "analytics", label: "Analytics", icon: "📈" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="cartoon-footer-wrapper">
      {/* Top Banner: Mascot Quote & Status */}
      <div className="footer-top-banner">
        <div className="footer-status-pill">
          <span className="status-dot"></span>
          <span>AI Systems 100% Operational & Cloud Synced</span>
        </div>
        <div className="footer-mascot-quote">
          <span>🤖 <strong>Chef Bot says:</strong> "Snap any dish (Vada Pav, Dosa, Pizza) to unlock transparent calories & health scoring!"</span>
        </div>
        <button className="footer-top-btn" onClick={scrollToTop} title="Scroll to top">
          ⬆️ Back to Top
        </button>
      </div>

      <div className="cartoon-footer-container">
        {/* Column 1: Brand & Mascot */}
        <div className="footer-brand-col">
          <div className="footer-logo-row">
            <img src="/favicon.svg" alt="NutriSnap AI Logo" style={{ width: 44, height: 44, objectFit: "contain" }} />
            <span className="footer-logo-title">NutriSnap AI</span>
          </div>
          <p className="footer-tagline">
            Snap Your Food. Understand Your Nutrition. AI-powered food recognition & nutrition insights for global & regional cuisine.
          </p>
          <div className="footer-badge-pill" style={{ marginBottom: 12 }}>
            🇮🇳 Fine-tuned for Indian & Global Regional Cuisine
          </div>
          <div className="footer-mini-stats">
            <span className="mini-stat">🍲 200+ Dishes</span>
            <span className="mini-stat">✨ 98% Vision AI</span>
            <span className="mini-stat">🥗 14-Diet Matrix</span>
          </div>
        </div>

        {/* Column 2: Quick Navigation */}
        <div className="footer-links-col">
          <h4 className="footer-col-header">Quick Navigation 🧭</h4>
          <ul className="footer-nav-list">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`footer-nav-btn ${activeTab === item.id ? "active" : ""}`}
                  onClick={() => {
                    if (setActiveTab) setActiveTab(item.id);
                    scrollToTop();
                  }}
                >
                  <span style={{ marginRight: 6 }}>{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Core Features */}
        <div className="footer-links-col">
          <h4 className="footer-col-header">Key Features ✨</h4>
          <ul className="footer-feature-list">
            <li>⚡ Vision AI Dish Recognition</li>
            <li>🥗 14-Diet Compatibility Engine</li>
            <li>📸 Live Camera Viewfinder</li>
            <li>🏷️ Barcode & Label OCR Scan</li>
            <li>💧 Hydration & Goal Tracker</li>
            <li>🧠 Smart AI Nutrition Coach</li>
            <li>🛡️ Strict Dish Image Matching</li>
          </ul>
        </div>

        {/* Column 4: Developer Profile & Contact */}
        <div className="footer-links-col">
          <h4 className="footer-col-header">Developer & Contact 👨‍💻</h4>
          <div className="footer-dev-card">
            <div className="dev-header">
              <span className="dev-avatar">👨‍💻</span>
              <div>
                <h5 className="dev-name">Yash Rajbhar</h5>
                <span className="dev-role">Full-Stack & AI Developer</span>
              </div>
            </div>

            <div className="dev-actions">
              <a href="mailto:yashrajbhar316@gmail.com" className="dev-btn dev-btn-email">
                ✉️ yashrajbhar316@gmail.com
              </a>
              <a
                href="https://github.com/YASH-RAJBHAR/food-analyzer-project"
                target="_blank"
                rel="noopener noreferrer"
                className="dev-btn dev-btn-github"
              >
                🐙 GitHub Repository
              </a>
            </div>
          </div>

          <div className="footer-tech-stack" style={{ marginTop: 14 }}>
            <span className="tech-chip">🚀 Spring Boot 3</span>
            <span className="tech-chip">🐍 Python PyTorch AI</span>
            <span className="tech-chip">⚛️ React 18 SaaS</span>
            <span className="tech-chip">🤖 Gemini 1.5 Agent</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-disclaimer">
          ⚠️ <strong>Disclaimer:</strong> NutriSnap AI provides informational nutrition estimates only and is not intended to provide medical advice.
        </div>
        <div className="footer-copyright">
          NutriSnap AI © {new Date().getFullYear()} • Developed by <strong>Yash Rajbhar</strong> (yashrajbhar316@gmail.com) • AI-Powered Food Recognition & Nutrition Insights 🎉
        </div>
      </div>
    </footer>
  );
}

export default Footer;
