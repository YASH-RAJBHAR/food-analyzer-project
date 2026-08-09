import React, { useState } from "react";

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

function DietMatrix({ dietCompatibility = [], foodName = "Analyzed Food", protein = 12, carbs = 30, fat = 9, sugar = 4, sodium = 280 }) {
  const [filterCategory, setFilterCategory] = useState("All");

  const isCompatible = (dietKey) => {
    if (!dietCompatibility || dietCompatibility.length === 0) return true;
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
    <div className="card glass-card diet-matrix-container">
      <div className="section-title-row">
        <div>
          <h2>📊 14-Diet Compatibility Matrix</h2>
          <p>Real-time dietary matrix evaluation for <strong>{foodName}</strong> based on macro ratios, allergens & ingredients.</p>
        </div>
        <div className="matrix-score-pill">
          <span className="score-label">Diet Compatibility</span>
          <span className="score-val">{approvedCount} / {ALL_DIETS.length} Approved ({approvedPct}%)</span>
        </div>
      </div>

      {/* Versatility Progress Bar */}
      <div className="matrix-progress-bg">
        <div className="matrix-progress-fill" style={{ width: `${approvedPct}%` }}></div>
      </div>

      {/* Filter Tabs */}
      <div className="matrix-filters">
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
      <div className="diet-matrix-grid">
        {filteredDiets.map((diet) => {
          const compatible = isCompatible(diet.key);
          return (
            <div key={diet.key} className={`diet-matrix-card ${compatible ? "status-approved" : "status-restricted"}`}>
              <div className="diet-card-top">
                <span className="diet-icon">{diet.icon}</span>
                <span className={`status-badge ${compatible ? "badge-pass" : "badge-fail"}`}>
                  {compatible ? "✓ COMPATIBLE" : "✕ RESTRICTED"}
                </span>
              </div>
              <h4 className="diet-name">{diet.name}</h4>
              <p className="diet-rule">{diet.rule}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DietMatrix;
