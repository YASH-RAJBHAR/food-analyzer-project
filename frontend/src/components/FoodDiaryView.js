import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../config";

function FoodDiaryView() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/food/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sampleMeals = {
    breakfast: { title: "Breakfast 🌅", items: [{ name: "Masala Dosa with Sambar", cal: 310, prot: "6.5g", time: "8:30 AM" }] },
    lunch: { title: "Lunch ☀️", items: [{ name: "Rajma Chawal Bowl", cal: 410, prot: "15.0g", time: "1:15 PM" }] },
    snacks: { title: "Snacks 🍪", items: [{ name: "Vada Pav & Cutting Chai", cal: 290, prot: "7.5g", time: "5:00 PM" }] },
    dinner: { title: "Dinner 🌙", items: [{ name: "Paneer Tikka & Roti", cal: 380, prot: "18.0g", time: "8:45 PM" }] }
  };

  const totalCalories = 310 + 410 + 290 + 380;
  const targetCalories = 2000;
  const calPct = Math.min(100, Math.round((totalCalories / targetCalories) * 100));

  return (
    <div className="cartoon-card diary-container">
      <div className="section-title-row">
        <div>
          <h2>My Food Diary 📓</h2>
          <p>Cartoon food journal tracking your meals, daily calorie budget & macro totals.</p>
        </div>
        <div className="diary-budget-pill">
          <span>Today's Total: <strong>{totalCalories} / {targetCalories} kcal</strong></span>
        </div>
      </div>

      {/* Daily Budget Progress Bar */}
      <div className="diary-progress-bg">
        <div className="diary-progress-fill" style={{ width: `${calPct}%` }}></div>
      </div>

      {/* Meal Group Cards */}
      <div className="diary-meals-grid">
        {Object.keys(sampleMeals).map((key) => {
          const meal = sampleMeals[key];
          return (
            <div key={key} className="cartoon-meal-card">
              <div className="meal-card-header">
                <h3>{meal.title}</h3>
                <button className="meal-add-btn">+ Add Meal</button>
              </div>

              <div className="meal-items-list">
                {meal.items.map((item, idx) => (
                  <div key={idx} className="meal-item-row">
                    <div>
                      <h4 className="meal-item-name">{item.name}</h4>
                      <small className="meal-item-time">🕒 {item.time}</small>
                    </div>
                    <div className="meal-item-stats">
                      <span className="meal-cal-badge">🔥 {item.cal} kcal</span>
                      <span className="meal-prot-badge">💪 {item.prot}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Logged History Entries Table */}
      <div className="recent-log-box" style={{ marginTop: 24 }}>
        <h3>📜 Recent History Log</h3>
        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p>No logged items yet. Scan a food image to populate!</p>
        ) : (
          <div className="history-chips-row">
            {history.map((h) => (
              <div key={h.id} className="history-chip">
                <span>🍽️ <strong>{h.foodName}</strong> ({h.cuisine || "Global"})</span>
                <span className="history-cal">🔥 {h.calories} kcal</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FoodDiaryView;
