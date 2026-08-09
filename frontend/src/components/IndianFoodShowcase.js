import React from "react";
import FoodCard from "./FoodCard";
import { FOOD_DATABASE } from "../utils/foodDatabase";

function IndianFoodShowcase({ onSelectDish }) {
  // Filter Indian dishes from centralized FOOD_DATABASE
  const indianFoods = FOOD_DATABASE.filter(food => food.country === "India");

  return (
    <div className="cartoon-card showcase-container">
      <div className="section-title-row">
        <div>
          <span className="cartoon-mini-badge">🇮🇳 Special Regional AI Recognition</span>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginTop: 4 }}>Explore Indian Food 🇮🇳</h2>
          <p style={{ color: "var(--text-muted)" }}>Our vision AI is specifically fine-tuned for Indian street foods & authentic regional dishes.</p>
        </div>
      </div>

      <div className="showcase-grid">
        {indianFoods.map((food) => (
          <FoodCard key={food.id} food={food} onSelect={onSelectDish} />
        ))}
      </div>
    </div>
  );
}

export default IndianFoodShowcase;
