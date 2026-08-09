// Centralized Food Database & Verified Food Object Resolution System
// Strict Food Object Architecture: Name, Image, Description, Region, Country & Nutrition belong to ONE single object.

export const FOOD_DATABASE = [
  {
    id: "vada-pav",
    name: "Vada Pav",
    image: "/images/foods/vada-pav.jpg",
    description: "Mumbai-style spiced potato fritter (batata vada) served inside a soft buttered pav roll with garlic coconut chutney.",
    region: "Maharashtra",
    country: "India",
    category: "Indian Street Food",
    calories: 290,
    protein: 7.5,
    carbs: 42.0,
    fat: 10.5,
    fiber: 3.8,
    sugar: 3.2,
    sodium: 380,
    funSticker: "🥪 Mumbai Favorite!"
  },
  {
    id: "pav-bhaji",
    name: "Pav Bhaji",
    image: "/images/foods/pav-bhaji.jpg",
    description: "Mashed spiced vegetable curry (bhaji) cooked with Amul butter, served hot with toasted pav buns, raw onion & lemon.",
    region: "Maharashtra",
    country: "India",
    category: "Indian Street Food",
    calories: 380,
    protein: 9.0,
    carbs: 52.0,
    fat: 16.0,
    fiber: 5.2,
    sugar: 5.5,
    sodium: 620,
    funSticker: "🍛 Butter Loaded!"
  },
  {
    id: "chole-bhature",
    name: "Chole Bhature",
    image: "/images/foods/chole-bhature.jpg",
    description: "Spicy dark chickpea curry (chole) paired with deep-fried fluffy fermented flour balloon bread (bhatura).",
    region: "Punjab & Delhi",
    country: "India",
    category: "North Indian Main Dish",
    calories: 520,
    protein: 16.0,
    carbs: 68.0,
    fat: 22.0,
    fiber: 8.5,
    sugar: 4.5,
    sodium: 740,
    funSticker: "🍲 Punjabi Feast!"
  },
  {
    id: "masala-dosa",
    name: "Masala Dosa",
    image: "/images/foods/masala-dosa.jpg",
    description: "Crispy South Indian fermented rice-lentil crepe filled with spiced potato masala, served with coconut chutney & sambar.",
    region: "Karnataka & South India",
    country: "India",
    category: "South Indian Tiffin",
    calories: 310,
    protein: 6.5,
    carbs: 48.0,
    fat: 10.0,
    fiber: 4.0,
    sugar: 2.5,
    sodium: 410,
    funSticker: "🥞 Crispy & Golden!"
  },
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    image: "/images/foods/chicken-biryani.jpg",
    description: "Aromatic long-grain basmati rice dum-cooked with saffron, mint, biryani spices & tender marinated chicken pieces.",
    region: "Hyderabad, Telangana",
    country: "India",
    category: "Indian Rice Dish",
    calories: 480,
    protein: 26.0,
    carbs: 56.0,
    fat: 16.0,
    fiber: 3.5,
    sugar: 2.0,
    sodium: 540,
    funSticker: "👑 Royal Dum Rice!"
  },
  {
    id: "samosa",
    name: "Samosa",
    image: "/images/foods/samosa.jpg",
    description: "Crispy golden fried triangular flour pastry shell filled with spiced potatoes, green peas & spices.",
    region: "North & West India",
    country: "India",
    category: "Indian Snack",
    calories: 260,
    protein: 4.5,
    carbs: 28.0,
    fat: 14.0,
    fiber: 2.5,
    sugar: 2.0,
    sodium: 340,
    funSticker: "🔺 Triangle Delight!"
  },
  {
    id: "pani-puri",
    name: "Pani Puri",
    image: "/images/foods/pani-puri.jpg",
    description: "Hollow crisp semolina puris filled with spiced potato-ragda and chilled mint-coriander spiced water.",
    region: "All India",
    country: "India",
    category: "Indian Street Food",
    calories: 160,
    protein: 3.0,
    carbs: 26.0,
    fat: 5.0,
    fiber: 2.0,
    sugar: 3.5,
    sodium: 420,
    funSticker: "💥 Flavor Explosion!"
  },
  {
    id: "rajma-chawal",
    name: "Rajma Chawal",
    image: "/images/foods/rajma-chawal.jpg",
    description: "Hearty red kidney bean curry cooked in onion-tomato gravy served over warm steamed basmati rice.",
    region: "North India",
    country: "India",
    category: "North Indian Comfort Food",
    calories: 410,
    protein: 15.0,
    carbs: 65.0,
    fat: 9.0,
    fiber: 9.0,
    sugar: 3.0,
    sodium: 480,
    funSticker: "❤️ Ultimate Comfort!"
  },
  {
    id: "idli",
    name: "Idli Sambar",
    image: "/images/foods/idli.jpg",
    description: "Soft steamed white cakes made from fermented rice and black gram batter, served with spicy lentil sambar.",
    region: "South India",
    country: "India",
    category: "South Indian Tiffin",
    calories: 180,
    protein: 7.0,
    carbs: 34.0,
    fat: 2.0,
    fiber: 4.5,
    sugar: 2.0,
    sodium: 290,
    funSticker: "⚪ Soft & Healthy!"
  },
  {
    id: "poha",
    name: "Poha",
    image: "/images/foods/poha.jpg",
    description: "Light steamed flattened rice tempered with mustard seeds, turmeric, roasted peanuts, curry leaves & lemon.",
    region: "Maharashtra & MP",
    country: "India",
    category: "Indian Breakfast",
    calories: 220,
    protein: 4.5,
    carbs: 38.0,
    fat: 6.0,
    fiber: 3.0,
    sugar: 2.2,
    sodium: 310,
    funSticker: "🍋 Light & Zesty!"
  },
  {
    id: "pizza",
    name: "Margherita Pizza",
    image: "/images/foods/pizza.jpg",
    description: "Classic wood-fired Neapolitan pizza topped with San Marzano tomato sauce, fresh mozzarella cheese & basil.",
    region: "Naples",
    country: "Italy",
    category: "Pizza & Flatbread",
    calories: 285,
    protein: 12.0,
    carbs: 36.0,
    fat: 10.0,
    fiber: 2.5,
    sugar: 3.8,
    sodium: 520,
    funSticker: "🍕 Cheesy Classic!"
  },
  {
    id: "burger",
    name: "Cheeseburger",
    image: "/images/foods/burger.jpg",
    description: "Flame-grilled savory patty topped with melted cheddar cheese, lettuce, tomato & pickles in a toasted sesame bun.",
    region: "United States",
    country: "USA",
    category: "Burger & Sandwich",
    calories: 350,
    protein: 18.0,
    carbs: 32.0,
    fat: 16.0,
    fiber: 2.0,
    sugar: 5.0,
    sodium: 580,
    funSticker: "🍔 Juicy & Savory!"
  },
  {
    id: "sushi",
    name: "Sushi Platter",
    image: "/images/foods/sushi.jpg",
    description: "Handcrafted Japanese vinegared rice rolls with fresh salmon, tuna, nori seaweed, wasabi & pickled ginger.",
    region: "Tokyo",
    country: "Japan",
    category: "Japanese Specialty",
    calories: 200,
    protein: 9.0,
    carbs: 38.0,
    fat: 2.0,
    fiber: 1.8,
    sugar: 1.2,
    sodium: 420,
    funSticker: "🍣 Ocean Fresh!"
  }
];

export function getFoodById(id) {
  if (!id) return null;
  return FOOD_DATABASE.find(item => item.id === id) || null;
}

export function getFoodByName(foodName) {
  if (!foodName) return null;
  const lower = foodName.toLowerCase().trim();

  // 1. Exact name match
  const exact = FOOD_DATABASE.find(item => item.name.toLowerCase() === lower);
  if (exact) return exact;

  // 2. Substring match
  const substring = FOOD_DATABASE.find(item => lower.includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(lower));
  if (substring) return substring;

  return null;
}

export function getVerifiedFoodImage(foodName) {
  const food = getFoodByName(foodName);
  return food ? food.image : null;
}

export function getAllFoods() {
  return FOOD_DATABASE;
}
