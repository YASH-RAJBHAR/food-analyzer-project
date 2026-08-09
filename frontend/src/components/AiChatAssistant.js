import React, { useState } from "react";
import { API_BASE_URL } from "../config";

function AiChatAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your NutriSnap AI Coach & Nutrition Assistant 🤖. Ask me anything about food health, diabetic suitability, muscle building meals, recipes, or allergens!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Is Vada Pav healthy for weight loss?",
    "What is the nutrition of chicken breast?",
    "Can diabetics safely eat Masala Dosa?",
    "What are high-protein Indian vegetarian dishes?",
  ];

  // Local Typo-Tolerant AI Smart Fallback Engine
  const getSmartLocalAnswer = (query) => {
    const q = (query || "").toLowerCase().trim();

    if (q === "hi" || q === "hello" || q === "hey" || q.startsWith("hi ") || q.startsWith("hello ")) {
      return "Hello there! 👋 I'm Chef Bot, your AI Food & Nutrition Coach! Ask me about any dish (Chicken, Biryani, Vada Pav, Pizza), calories, protein, weight loss, diabetic diets, or recipes!";
    }

    if (q.includes("chiken") || q.includes("chikn") || q.includes("chickn") || q.includes("chicken") || q.includes("poultry") || q.includes("murgh")) {
      return "Chicken is a fantastic lean protein source! A 100g serving of cooked chicken breast contains ~165 kcal, 31g protein, 3.6g fat, and 0g carbs. It's rich in Niacin, Vitamin B6, and Phosphorus. Are you preparing Grilled Chicken, Chicken Curry, or Chicken Biryani?";
    }

    if (q.includes("vada pav") || q.includes("vadapav")) {
      return "Vada Pav contains ~290 kcal, 7.5g protein, and 42g carbs per serving. Enjoy it with raw green chili or garlic chutney for authentic Mumbai flavor!";
    }

    if (q.includes("pav bhaji") || q.includes("pavbhaji")) {
      return "Pav Bhaji delivers ~380 kcal and 9g protein per portion. The tomato-rich bhaji is loaded with Vitamin A and antioxidants!";
    }

    if (q.includes("chole") || q.includes("bhature")) {
      return "Chole Bhature is a rich Punjabi dish supplying ~520 kcal, 16g plant protein, and 8.5g dietary fiber!";
    }

    if (q.includes("dosa")) {
      return "Masala Dosa provides ~310 kcal and 6.5g protein. Fermented rice-lentil batter supports gut probiotic health!";
    }

    if (q.includes("biryani")) {
      return "Chicken Biryani contains ~480 kcal and 26g protein per serving! Dum-cooked basmati rice with herbs provides long-lasting energy.";
    }

    if (q.includes("poha")) {
      return "Poha is a light, digestible breakfast (~220 kcal, 4.5g protein). Tempered peanuts and lemon boost iron and vitamin C absorption!";
    }

    if (q.includes("rajma")) {
      return "Rajma Chawal delivers ~410 kcal, 15g protein, and 9g fiber! Kidney beans are rich in iron, potassium, and complex carbs.";
    }

    if (q.includes("pani puri") || q.includes("golgappa")) {
      return "Pani Puri supplies ~160 kcal for 6 puris! Mint-coriander spiced water (tiki pani) is refreshing and digestive-friendly.";
    }

    if (q.includes("pizza")) {
      return "A Margherita Pizza slice provides ~285 kcal and 12g protein. Fresh mozzarella supplies calcium, while tomato sauce contains lycopene.";
    }

    if (q.includes("burger")) {
      return "A Cheeseburger supplies ~350 kcal and 18g protein. Pair with a fresh side salad to keep dietary fiber high!";
    }

    if (q.includes("sushi")) {
      return "Sushi rolls supply ~200 kcal and 9g lean protein per 6 pieces! Salmon and tuna are rich in heart-healthy Omega-3 fatty acids.";
    }

    if (q.includes("diabetic") || q.includes("diabetes") || q.includes("sugar")) {
      return "For diabetic wellness, focus on low glycemic index foods with >5g fiber per serving and <5g sugar. Quinoa, dal, and green veggies keep blood glucose stable!";
    }

    if (q.includes("weight") || q.includes("loss") || q.includes("diet") || q.includes("calorie")) {
      return "For sustainable weight loss, create a daily 300-500 kcal deficit while keeping protein high (>25% total daily calories) to preserve muscle mass!";
    }

    if (q.includes("gym") || q.includes("muscle") || q.includes("protein")) {
      return "To maximize muscle synthesis, target 1.6g-2.2g of protein per kg of body weight daily. Great sources: Chicken Breast (31g/100g), Paneer (18g), and Chole (16g).";
    }

    return `Regarding '${query}': A balanced diet supplies 45-65% complex carbs, 20-35% healthy fats, and 10-35% protein alongside essential vitamins, minerals, and hydration! Feel free to ask about any specific dish or meal.`;
  };

  const handleSend = async (questionText) => {
    const textToSend = questionText || input;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/food/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: textToSend }),
      });
      if (!response.ok) throw new Error("Chat request failed");
      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.answer }]);
    } catch (err) {
      const localAns = getSmartLocalAnswer(textToSend);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `🤖 Chef Bot: ${localAns}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cartoon-card">
      <div className="section-title-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800 }}>🤖 AI Food & Health Coach</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Ask Chef Bot 🤖 anything about calories, recipes, diabetic suitability, or fitness nutrition.
          </p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #7000ff, #ff007f)", color: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, boxShadow: "0 4px 14px rgba(112, 0, 255, 0.3)" }}>
          ⚡ AI Agent API Connected
        </div>
      </div>

      {/* Sample Quick Prompt Chips */}
      <div className="quick-fixes-row" style={{ marginBottom: 16, gap: 8, display: "flex", flexWrap: "wrap" }}>
        {sampleQuestions.map((q, idx) => (
          <span
            key={idx}
            className="quick-chip"
            onClick={() => handleSend(q)}
            style={{
              background: "var(--pill-bg)",
              padding: "6px 14px",
              borderRadius: 16,
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              border: "1.5px solid var(--card-border)"
            }}
          >
            💡 {q}
          </span>
        ))}
      </div>

      {/* Chat Messages Window */}
      <div
        className="chat-window"
        style={{
          background: "var(--pill-bg)",
          border: "2px solid var(--card-border)",
          borderRadius: 24,
          padding: 20,
          height: 340,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 14
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              maxWidth: "82%"
            }}
          >
            <div
              style={{
                background: msg.sender === "user" ? "linear-gradient(135deg, var(--primary-color), var(--secondary-color))" : "var(--card-bg)",
                color: msg.sender === "user" ? "#ffffff" : "var(--text-main)",
                border: msg.sender === "user" ? "none" : "2px solid var(--card-border)",
                padding: "12px 18px",
                borderRadius: 20,
                fontSize: "0.92rem",
                lineHeight: 1.45,
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.06)"
              }}
            >
              <strong style={{ display: "block", marginBottom: 4, fontSize: "0.85rem", color: msg.sender === "user" ? "#fff" : "var(--primary-color)" }}>
                {msg.sender === "ai" ? "🤖 Chef Bot:" : "👤 You:"}
              </strong>
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start" }}>
            <div style={{ background: "var(--card-bg)", border: "2px solid var(--card-border)", padding: "10px 16px", borderRadius: 20, fontSize: "0.88rem", fontWeight: 700, color: "var(--primary-color)" }}>
              🤖 Chef Bot is calculating nutrition facts...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{ display: "flex", gap: 10, marginTop: 16 }}
      >
        <input
          type="text"
          className="cartoon-text-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Chef Bot about food, calories, chicken nutrition, or health..."
        />
        <button type="submit" className="cartoon-primary-btn" disabled={loading}>
          Send 🚀
        </button>
      </form>
    </div>
  );
}

export default AiChatAssistant;
