import React, { useState } from "react";

function FoodCard({ food, onSelect }) {
  const [imgError, setImgError] = useState(false);

  if (!food) return null;

  return (
    <div className="cartoon-dish-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Food Card Header Image */}
      <div style={{ position: "relative", height: 160, overflow: "hidden", background: "var(--pill-bg)" }}>
        {food.image && !imgError ? (
          <img
            src={food.image}
            alt={food.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: 12, textAlign: "center" }}>
            <span style={{ fontSize: "2.5rem" }}>🍽️</span>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-main)", marginTop: 4 }}>Food Image Unavailable</strong>
            <small style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{food.name}</small>
          </div>
        )}

        {food.funSticker && (
          <span className="cartoon-sticker-badge" style={{ position: "absolute", top: 10, left: 10, margin: 0 }}>
            {food.funSticker}
          </span>
        )}
      </div>

      {/* Food Card Body */}
      <div className="dish-card-body" style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
        <span className="dish-region-tag">{food.region || food.country || "Global"}</span>
        <h3 className="dish-card-title" style={{ fontSize: "1.2rem", fontWeight: 800, margin: "4px 0" }}>{food.name}</h3>
        <p className="dish-card-desc" style={{ fontSize: "0.85rem", color: "var(--text-muted)", flex: 1, marginBottom: 12 }}>
          {food.description}
        </p>

        <div className="dish-card-stats" style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontWeight: 700 }}>
          <span>🔥 {food.calories} kcal</span>
          <span>💪 {food.protein}g protein</span>
        </div>

        <button
          className="cartoon-primary-btn"
          style={{ width: "100%", padding: "10px 14px", fontSize: "0.88rem" }}
          onClick={() => onSelect && onSelect(food.name)}
        >
          ⚡ Scan & Analyze {food.name} 🎉
        </button>
      </div>
    </div>
  );
}

export default FoodCard;
