import React, { useState } from "react";
import { FOOD_DATABASE } from "../utils/foodDatabase";

const ALL_DIETS = [
  { key: "Vegetarian", name: "Vegetarian", icon: "🥦", category: "Lifestyle", rule: "No meat, poultry, or fish detected" },
  { key: "Vegan", name: "Vegan", icon: "🌱", category: "Lifestyle", rule: "No meat, dairy, eggs, or animal products" },
  { key: "Keto Friendly", name: "Keto Friendly", icon: "🥑", category: "Fitness", rule: "Carbs ≤ 15g & Healthy Fat ≥ 12g" },
  { key: "Low Carb", name: "Low Carb", icon: "🌾", category: "Fitness", rule: "Carbs ≤ 30g per serving" },
  { key: "Diabetic Friendly", name: "Diabetic Friendly", icon: "🩸", category: "Medical", rule: "Sugar ≤ 8g & High Fiber (Low GI)" },
  { key: "Gluten Free", name: "Gluten Free", icon: "🚫", category: "Medical", rule: "No wheat, barley, rye, or gluten" },
  { key: "Lactose Free", name: "Lactose Free", icon: "🥛", category: "Medical", rule: "No milk, cheese, or dairy ingredients" },
  { key: "High Protein", name: "High Protein", icon: "💪", category: "Fitness", rule: "Protein ≥ 18g per serving" },
  { key: "Low Fat", name: "Low Fat", icon: "🫀", category: "Fitness", rule: "Total Fat ≤ 8g per serving" },
  { key: "Low Sodium", name: "Low Sodium", icon: "🧂", category: "Medical", rule: "Sodium ≤ 400mg per serving" },
  { key: "Paleo", name: "Paleo Friendly", icon: "🥩", category: "Lifestyle", rule: "Whole foods, no grains/dairy/sugar" },
  { key: "Mediterranean", name: "Mediterranean", icon: "🥗", category: "Lifestyle", rule: "Olive oil, legumes, vegetables, lean protein" },
  { key: "Halal Friendly", name: "Halal Friendly", icon: "🌙", category: "Religious", rule: "No pork, lard, or alcohol ingredients" },
  { key: "Kosher Friendly", name: "Kosher Friendly", icon: "✡️", category: "Religious", rule: "No pork, shellfish, or meat-dairy mix" }
];

function DietMatrix({ dietCompatibility = [], foodName = "Vada Pav (Indian Special)", protein = 7.5, carbs = 42, fat = 10.5, sugar = 3.2, sodium = 380 }) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedFood, setSelectedFood] = useState(FOOD_DATABASE[0] || null);

  const activeFoodName = selectedFood ? selectedFood.name : foodName;
  const activeProtein = selectedFood ? selectedFood.protein : protein;
  const activeCarbs = selectedFood ? selectedFood.carbs : carbs;
  const activeFat = selectedFood ? selectedFood.fat : fat;
  const activeSugar = selectedFood ? (selectedFood.sugar || 3) : sugar;
  const activeSodium = selectedFood ? (selectedFood.sodium || 350) : sodium;

  // Dynamic compatibility evaluator based on nutritional macros
  const evalCompatibility = (dietKey) => {
    const key = dietKey.toLowerCase();

    if (key.includes("vegetarian")) {
      return !activeFoodName.toLowerCase().includes("chicken") &&
             !activeFoodName.toLowerCase().includes("fish") &&
             !activeFoodName.toLowerCase().includes("sushi") &&
             !activeFoodName.toLowerCase().includes("burger");
    }
    if (key.includes("vegan")) {
      return !activeFoodName.toLowerCase().includes("chicken") &&
             !activeFoodName.toLowerCase().includes("paneer") &&
             !activeFoodName.toLowerCase().includes("butter") &&
             !activeFoodName.toLowerCase().includes("dosa") &&
             !activeFoodName.toLowerCase().includes("sushi") &&
             !activeFoodName.toLowerCase().includes("burger") &&
             !activeFoodName.toLowerCase().includes("pizza");
    }
    if (key.includes("keto")) {
      return activeCarbs <= 18 && activeFat >= 10;
    }
    if (key.includes("low carb")) {
      return activeCarbs <= 25;
    }
    if (key.includes("diabetic")) {
      return activeSugar <= 6 && activeCarbs <= 35;
    }
    if (key.includes("gluten free")) {
      return !activeFoodName.toLowerCase().includes("pav") &&
             !activeFoodName.toLowerCase().includes("bhature") &&
             !activeFoodName.toLowerCase().includes("pizza") &&
             !activeFoodName.toLowerCase().includes("burger") &&
             !activeFoodName.toLowerCase().includes("samosa");
    }
    if (key.includes("lactose free")) {
      return !activeFoodName.toLowerCase().includes("paneer") &&
             !activeFoodName.toLowerCase().includes("butter") &&
             !activeFoodName.toLowerCase().includes("pizza");
    }
    if (key.includes("high protein")) {
      return activeProtein >= 12;
    }
    if (key.includes("low fat")) {
      return activeFat <= 8;
    }
    if (key.includes("low sodium")) {
      return activeSodium <= 400;
    }
    if (key.includes("halal") || key.includes("kosher")) {
      return !activeFoodName.toLowerCase().includes("pork");
    }
    return true;
  };

  const isCompatible = (dietKey) => {
    if (selectedFood) return evalCompatibility(dietKey);
    if (!dietCompatibility || dietCompatibility.length === 0) return evalCompatibility(dietKey);
    return dietCompatibility.some(d => d.toLowerCase().includes(dietKey.toLowerCase().replace(" friendly", "")));
  };

  const approvedCount = ALL_DIETS.filter(d => isCompatible(d.key)).length;
  const approvedPct = Math.round((approvedCount / ALL_DIETS.length) * 100);

  const filteredDiets = ALL_DIETS.filter(diet => {
    if (filterCategory === "Approved") return isCompatible(diet.key);
    if (filterCategory === "Restricted") return !isCompatible(diet.key);
    if (filterCategory !== "All") return diet.category === filterCategory;
    return true;
  });

  return (
    <div className="card glass-card diet-matrix-container" style={{ padding: 24 }}>
      <div className="section-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2>📊 14-Diet Compatibility Matrix</h2>
          <p>Real-time dietary matrix evaluation for <strong>{activeFoodName}</strong> based on macro ratios, allergens & ingredients.</p>
        </div>
        <div className="matrix-score-pill">
          <span className="score-label">Diet Compatibility</span>
          <span className="score-val">{approvedCount} / {ALL_DIETS.length} Approved ({approvedPct}%)</span>
        </div>
      </div>

      {/* Interactive Food Selection Pill Bar */}
      <div className="matrix-food-selector-row" style={{ margin: "16px 0", display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
        <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "var(--text-main)", display: "flex", alignItems: "center" }}>
          Select Food to Test:
        </span>
        {FOOD_DATABASE.map((food) => (
          <button
            key={food.id}
            onClick={() => setSelectedFood(food)}
            style={{
              background: selectedFood?.id === food.id ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" : "var(--pill-bg)",
              color: selectedFood?.id === food.id ? "#ffffff" : "var(--text-main)",
              border: "2px solid var(--card-border)",
              borderRadius: 20,
              padding: "6px 14px",
              fontSize: "0.82rem",
              fontWeight: 800,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease"
            }}
          >
            {food.name} (🔥 {food.calories} kcal)
          </button>
        ))}
      </div>

      {/* Versatility Progress Bar */}
      <div className="matrix-progress-bg" style={{ height: 10, background: "rgba(0,0,0,0.08)", borderRadius: 5, overflow: "hidden", marginBottom: 20 }}>
        <div className="matrix-progress-fill" style={{ width: `${approvedPct}%`, height: "100%", background: "linear-gradient(90deg, #2ec4b6, #ff6b35)", transition: "width 0.5s ease" }}></div>
      </div>

      {/* Filter Tabs */}
      <div className="matrix-filters" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        <button className={`filter-btn ${filterCategory === "All" ? "active" : ""}`} onClick={() => setFilterCategory("All")}>
          All 14 Diets
        </button>
        <button className={`filter-btn ${filterCategory === "Approved" ? "active" : ""}`} onClick={() => setFilterCategory("Approved")}>
          ✓ Approved ({approvedCount})
        </button>
        <button className={`filter-btn ${filterCategory === "Restricted" ? "active" : ""}`} onClick={() => setFilterCategory("Restricted")}>
          ✕ Restricted ({ALL_DIETS.length - approvedCount})
        </button>
        <button className={`filter-btn ${filterCategory === "Medical" ? "active" : ""}`} onClick={() => setFilterCategory("Medical")}>
          🏥 Medical / Health
        </button>
        <button className={`filter-btn ${filterCategory === "Fitness" ? "active" : ""}`} onClick={() => setFilterCategory("Fitness")}>
          💪 Fitness / Macros
        </button>
        <button className={`filter-btn ${filterCategory === "Religious" ? "active" : ""}`} onClick={() => setFilterCategory("Religious")}>
          🕊️ Halal & Kosher
        </button>
      </div>

      {/* Matrix Grid */}
      <div className="diet-matrix-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {filteredDiets.map((diet) => {
          const compatible = isCompatible(diet.key);
          return (
            <div
              key={diet.key}
              className={`diet-matrix-card ${compatible ? "status-approved" : "status-restricted"}`}
              style={{
                background: compatible ? "rgba(46, 196, 182, 0.08)" : "rgba(255, 89, 100, 0.08)",
                border: `2px solid ${compatible ? "#2ec4b6" : "#ff5964"}`,
                borderRadius: 20,
                padding: 16
              }}
            >
              <div className="diet-card-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span className="diet-icon" style={{ fontSize: "1.6rem" }}>{diet.icon}</span>
                <span
                  className={`status-badge ${compatible ? "badge-pass" : "badge-fail"}`}
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 900,
                    padding: "4px 8px",
                    borderRadius: 12,
                    background: compatible ? "#2ec4b6" : "#ff5964",
                    color: "#ffffff"
                  }}
                >
                  {compatible ? "✓ COMPATIBLE" : "✕ RESTRICTED"}
                </span>
              </div>
              <h4 className="diet-name" style={{ fontSize: "1rem", fontWeight: 800, margin: "4px 0" }}>{diet.name}</h4>
              <p className="diet-rule" style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>{diet.rule}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DietMatrix;
