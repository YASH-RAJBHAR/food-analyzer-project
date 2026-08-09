import React, { useState } from "react";

function GoalTrackerView() {
  const [selectedGoal, setSelectedGoal] = useState("Weight Management");
  const [waterCount, setWaterCount] = useState(2.1);

  const goalProfiles = {
    "Weight Management": { icon: "🎯", calTarget: 1800, calCurrent: 1250, protTarget: 140, protCurrent: 98, carbsTarget: 160, carbsCurrent: 110, fatTarget: 55, fatCurrent: 38, desc: "Maintain steady calorie deficit for fat loss." },
    "Muscle Building": { icon: "💪", calTarget: 2700, calCurrent: 2150, protTarget: 185, protCurrent: 145, carbsTarget: 310, carbsCurrent: 240, fatTarget: 75, fatCurrent: 60, desc: "High protein target to maximize muscle hypertrophy." },
    "Healthy Eating": { icon: "🥗", calTarget: 2000, calCurrent: 1540, protTarget: 130, protCurrent: 110, carbsTarget: 220, carbsCurrent: 160, fatTarget: 65, fatCurrent: 48, desc: "Balanced nutrient density, fiber & gut health." },
    "Clean Eating": { icon: "🌱", calTarget: 1900, calCurrent: 1380, protTarget: 125, protCurrent: 92, carbsTarget: 180, carbsCurrent: 120, fatTarget: 60, fatCurrent: 44, desc: "Low sugar, low sodium & zero ultra-processed foods." },
  };

  const current = goalProfiles[selectedGoal];
  const calcPct = (curr, target) => Math.min(100, Math.round((curr / target) * 100));

  return (
    <div className="cartoon-card">
      <div className="section-title-row">
        <div>
          <h2>🎯 AI Health Goals & Hydration Tracker</h2>
          <p>Choose your target wellness profile and monitor daily macros & water intake in real-time.</p>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="showcase-grid" style={{ marginBottom: 24 }}>
        {Object.keys(goalProfiles).map((goalName) => {
          const profile = goalProfiles[goalName];
          const isSelected = selectedGoal === goalName;
          return (
            <div
              key={goalName}
              className={`cartoon-dish-card ${isSelected ? "selected-goal" : ""}`}
              onClick={() => setSelectedGoal(goalName)}
              style={{
                borderColor: isSelected ? "var(--primary-color)" : "var(--card-border)",
                background: isSelected ? "linear-gradient(135deg, rgba(255, 122, 41, 0.12) 0%, rgba(255, 202, 58, 0.12) 100%)" : "var(--pill-bg)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "2rem" }}>{profile.icon}</span>
                {isSelected && <span className="cartoon-sticker-badge">✓ ACTIVE</span>}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginTop: 8 }}>{goalName}</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "6px 0 12px" }}>{profile.desc}</p>
              <button className="cartoon-primary-btn" style={{ fontSize: "0.78rem", padding: "6px 12px" }}>
                {isSelected ? "Current Goal ✓" : "Select Goal"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Macro Goal Dashboard Cards */}
      <div className="goal-grid">
        {/* Calories Progress */}
        <div className="cartoon-meal-card">
          <div className="meal-card-header">
            <span>🔥 Daily Calories</span>
            <strong>{current.calCurrent} / {current.calTarget} kcal</strong>
          </div>
          <div className="diary-progress-bg">
            <div className="diary-progress-fill" style={{ width: `${calcPct(current.calCurrent, current.calTarget)}%` }}></div>
          </div>
          <small style={{ color: "var(--text-muted)" }}>{current.calTarget - current.calCurrent} kcal remaining today</small>
        </div>

        {/* Protein Progress */}
        <div className="cartoon-meal-card">
          <div className="meal-card-header">
            <span>💪 Protein Target</span>
            <strong>{current.protCurrent} / {current.protTarget} g</strong>
          </div>
          <div className="diary-progress-bg">
            <div className="diary-progress-fill" style={{ width: `${calcPct(current.protCurrent, current.protTarget)}%` }}></div>
          </div>
          <small style={{ color: "var(--text-muted)" }}>{calcPct(current.protCurrent, current.protTarget)}% achieved</small>
        </div>

        {/* Carbs Progress */}
        <div className="cartoon-meal-card">
          <div className="meal-card-header">
            <span>🍚 Carbohydrates</span>
            <strong>{current.carbsCurrent} / {current.carbsTarget} g</strong>
          </div>
          <div className="diary-progress-bg">
            <div className="diary-progress-fill" style={{ width: `${calcPct(current.carbsCurrent, current.carbsTarget)}%` }}></div>
          </div>
          <small style={{ color: "var(--text-muted)" }}>{current.carbsTarget - current.carbsCurrent}g allowance left</small>
        </div>

        {/* Fat Progress */}
        <div className="cartoon-meal-card">
          <div className="meal-card-header">
            <span>🥑 Healthy Fats</span>
            <strong>{current.fatCurrent} / {current.fatTarget} g</strong>
          </div>
          <div className="diary-progress-bg">
            <div className="diary-progress-fill" style={{ width: `${calcPct(current.fatCurrent, current.fatTarget)}%` }}></div>
          </div>
          <small style={{ color: "var(--text-muted)" }}>{calcPct(current.fatCurrent, current.fatTarget)}% used</small>
        </div>
      </div>

      {/* Cartoon Water Hydration Tracker */}
      <div className="cartoon-dropzone" style={{ marginTop: 24, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>💧 Water Hydration Tracker</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Current intake: <strong style={{ color: "var(--primary-color)", fontSize: "1.1rem" }}>{waterCount.toFixed(1)} / 3.0 Liters</strong></p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="cartoon-secondary-btn" onClick={() => setWaterCount(Math.min(4.0, waterCount + 0.25))}>
            + 250ml Glass 🥛
          </button>
          <button className="cartoon-primary-btn" onClick={() => setWaterCount(Math.min(4.0, waterCount + 0.5))}>
            + 500ml Bottle 🍾
          </button>
        </div>
      </div>
    </div>
  );
}

export default GoalTrackerView;
