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

  return (
    <footer className="cartoon-footer-wrapper">
      <div className="cartoon-footer-container">
        {/* Column 1: Brand & Mascot */}
        <div className="footer-brand-col">
          <div className="footer-logo-row">
            <span className="footer-logo-icon">🤖🍴</span>
            <span className="footer-logo-title">FoodAI Buddy</span>
          </div>
          <p className="footer-tagline">
            Your Playful AI Food Analyzer & Smart Nutrition Assistant. Snap any meal to unlock instant calories, macros, diet compatibility & recipes!
          </p>
          <div className="footer-badge-pill">
            🇮🇳 Fine-tuned for Indian & Global Regional Cuisine
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
                    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <li>🛡️ 100% Strict Object Matching</li>
          </ul>
        </div>

        {/* Column 4: Tech Stack */}
        <div className="footer-links-col">
          <h4 className="footer-col-header">Tech Architecture ⚙️</h4>
          <div className="footer-tech-stack">
            <span className="tech-chip">🚀 Spring Boot 3</span>
            <span className="tech-chip">🐍 Python PyTorch AI</span>
            <span className="tech-chip">⚛️ React 18 SaaS UI</span>
            <span className="tech-chip">🗄️ H2 Database</span>
            <span className="tech-chip">👁️ OpenCV & Tesseract</span>
            <span className="tech-chip">🎨 Playful 3D SaaS Design</span>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-disclaimer">
          ⚠️ <strong>Disclaimer:</strong> FoodAI Buddy provides informational nutrition estimates only and is not intended to provide medical advice.
        </div>
        <div className="footer-copyright">
          © {new Date().getFullYear()} <strong>FoodAI Buddy</strong> • Built with ❤️ for Foodies & Health Enthusiasts Worldwide 🎉
        </div>
      </div>
    </footer>
  );
}

export default Footer;
