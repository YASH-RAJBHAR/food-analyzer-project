import React, { useState } from "react";
import HeroSection from "./components/HeroSection";
import Upload from "./components/Upload";
import IndianFoodShowcase from "./components/IndianFoodShowcase";
import WorldFoodShowcase from "./components/WorldFoodShowcase";
import FoodDiaryView from "./components/FoodDiaryView";
import DietMatrix from "./components/DietMatrix";
import BarcodeOcrScanner from "./components/BarcodeOcrScanner";
import GoalTrackerView from "./components/GoalTrackerView";
import AiChatAssistant from "./components/AiChatAssistant";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDishForScan, setSelectedDishForScan] = useState(null);

  const handleSelectDish = (dishName) => {
    setSelectedDishForScan(dishName);
    setActiveTab("home");
    setTimeout(() => {
      const el = document.querySelector(".scanner-main-card");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <div className={`app-shell ${darkMode ? "dark-theme" : "light-theme"}`}>
      {/* NutriSnap AI Header Navbar */}
      <header className="cartoon-header">
        <div className="header-brand" onClick={() => setActiveTab("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/favicon.svg" alt="NutriSnap AI Logo" className="brand-logo-img" style={{ width: 46, height: 46, objectFit: "contain" }} />
          <div>
            <h1 className="brand-title">NutriSnap AI</h1>
            <p className="brand-tagline">Snap Your Food. Understand Your Nutrition.</p>
          </div>
        </div>

        {/* Global Dark Navy / Light Theme Toggle Pill */}
        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Light / Dark Navy Theme"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Navy"}
        </button>
      </header>

      {/* Playful Top Category Navigation Bar */}
      <nav className="cartoon-nav">
        <button
          className={`nav-tab-chip ${activeTab === "home" ? "active" : ""}`}
          onClick={() => setActiveTab("home")}
        >
          🏠 Home & Scan 📸
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "indian" ? "active" : ""}`}
          onClick={() => setActiveTab("indian")}
        >
          🇮🇳 Indian Special
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "world" ? "active" : ""}`}
          onClick={() => setActiveTab("world")}
        >
          🌐 World Food
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "diary" ? "active" : ""}`}
          onClick={() => setActiveTab("diary")}
        >
          📓 Food Diary
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "matrix" ? "active" : ""}`}
          onClick={() => setActiveTab("matrix")}
        >
          🥗 14-Diet Matrix
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "barcode" ? "active" : ""}`}
          onClick={() => setActiveTab("barcode")}
        >
          📷 Barcode / OCR
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "goals" ? "active" : ""}`}
          onClick={() => setActiveTab("goals")}
        >
          🎯 Goals & Water
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "chat" ? "active" : ""}`}
          onClick={() => setActiveTab("chat")}
        >
          🤖 AI Coach
        </button>
        <button
          className={`nav-tab-chip ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          📈 Analytics
        </button>
      </nav>

      {/* Main Container Viewport */}
      <main className="cartoon-main-content">
        {activeTab === "home" && (
          <>
            <HeroSection
              onScanClick={() => {
                const el = document.querySelector(".scanner-main-card");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              onExploreClick={() => setActiveTab("indian")}
            />
            <Upload selectedDish={selectedDishForScan} />
            <IndianFoodShowcase onSelectDish={handleSelectDish} />
            <WorldFoodShowcase onSelectDish={handleSelectDish} />
          </>
        )}

        {activeTab === "indian" && (
          <IndianFoodShowcase onSelectDish={handleSelectDish} />
        )}
        {activeTab === "world" && (
          <WorldFoodShowcase onSelectDish={handleSelectDish} />
        )}
        {activeTab === "diary" && <FoodDiaryView />}
        {activeTab === "matrix" && (
          <DietMatrix
            dietCompatibility={[
              "Vegan",
              "Keto Friendly",
              "Low Carb",
              "Diabetic Friendly",
              "Gluten Free",
              "Lactose Free",
              "High Protein",
              "Halal Friendly",
              "Kosher Friendly"
            ]}
            foodName="Vada Pav (Indian Special)"
          />
        )}
        {activeTab === "barcode" && <BarcodeOcrScanner />}
        {activeTab === "goals" && <GoalTrackerView />}
        {activeTab === "chat" && <AiChatAssistant />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
      </main>

      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;
