import React from "react";

function WorldFoodShowcase({ onSelectCuisine }) {
  const worldCuisines = [
    { country: "India", flag: "🇮🇳", icon: "🍛", dishes: "Vada Pav, Dosa, Biryani, Pav Bhaji, Chole" },
    { country: "Japan", flag: "🇯🇵", icon: "🍱", dishes: "Sushi, Ramen, Gyoza, Tempura, Teriyaki" },
    { country: "Italy", flag: "🇮🇹", icon: "🍕", dishes: "Margherita Pizza, Pasta, Risotto, Gnocchi" },
    { country: "Mexico", flag: "🇲🇽", icon: "🌮", dishes: "Tacos, Burritos, Quesadillas, Guacamole" },
    { country: "China", flag: "🇨🇳", icon: "🥟", dishes: "Dim Sum, Chow Mein, Kung Pao, Fried Rice" },
    { country: "Thailand", flag: "🇹🇭", icon: "🍜", dishes: "Pad Thai, Tom Yum, Green Curry, Som Tum" },
    { country: "Korea", flag: "🇰🇷", icon: "🍲", dishes: "Bibimbap, Kimchi Stew, Bulgogi, Tteokbokki" },
    { country: "Turkey", flag: "🇹🇷", icon: "🥙", dishes: "Doner Kebab, Baklava, Pide, Lahmacun" },
    { country: "France", flag: "🇫🇷", icon: "🥐", dishes: "Croissant, Ratatouille, Quiche, Baguette" },
    { country: "Morocco", flag: "🇲🇦", icon: "🫕", dishes: "Tagine, Couscous, Harira, Pastilla" },
  ];

  return (
    <div className="cartoon-card showcase-container">
      <div className="section-title-row">
        <div>
          <h2>Foods from Around the World 🌎</h2>
          <p>Global multi-modal AI vision supports thousands of dishes from all 195 countries.</p>
        </div>
      </div>

      <div className="world-grid">
        {worldCuisines.map((item, idx) => (
          <div key={idx} className="cartoon-world-card" onClick={() => onSelectCuisine && onSelectCuisine(item.country)}>
            <div className="world-card-top">
              <span className="world-flag">{item.flag}</span>
              <span className="world-icon">{item.icon}</span>
            </div>
            <h3 className="world-country-name">{item.country}</h3>
            <p className="world-dishes-text">{item.dishes}</p>
            <span className="world-explore-lbl">Explore Cuisines →</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorldFoodShowcase;
