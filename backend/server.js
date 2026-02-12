const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "*"
}));
app.use(express.json());

let shoppingList = [];
let purchaseHistory = [];
const products = [
  { name: "toothpaste", brand: "Colgate", price: 4.5 },
  { name: "toothpaste", brand: "Dove", price: 5.5 },
  { name: "soap", brand: "Dove", price: 3.0 },
  { name: "milk", brand: "Amul", price: 2.8 },
  { name: "butter", brand: "Amul", price: 6.0 },
  { name: "shampoo", brand: "Dove", price: 9.5 },
  { name: "curd", brand: "Amul", price: 3.5 },
  { name: "toothbrush", brand: "Colgate", price: 2.5 }
];

const capitalizeFirst = (value = "") =>
  value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : value;

// CATEGORY MAP
const categories = {
  milk: "Dairy",
  bread: "Bakery",
  apple: "Produce",
  banana: "Produce",
  toothpaste: "Personal Care",
  shampoo: "Personal Care",
  chips: "Snacks",
  rice: "Grains"
};

// GET LIST
app.get("/api/list", (req, res) => {
  res.json(shoppingList);
});

// ADD ITEM
app.post("/api/list", (req, res) => {
  const { name, quantity } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Item name required" });
  }

  const item = {
    name,
    quantity: quantity || 1,
    category: categories[name.toLowerCase()] || "Other"
  };

  shoppingList.push(item);
  purchaseHistory.push(name.toLowerCase());

  res.json(shoppingList);
});

// REMOVE ITEM
app.delete("/api/list/:name", (req, res) => {
  const name = req.params.name.toLowerCase();

  shoppingList = shoppingList.filter(
    item => item.name.toLowerCase() !== name
  );

  res.json(shoppingList);
});

// SEARCH PRODUCTS
app.get("/api/search", (req, res) => {
  const { item, brand, maxPrice } = req.query;

  let results = [...products];

  if (item) {
    const itemLower = item.toLowerCase();
    results = results.filter((product) =>
      product.name.toLowerCase().includes(itemLower)
    );
  }

  if (brand) {
    const brandLower = brand.toLowerCase();
    results = results.filter(
      (product) => product.brand.toLowerCase() === brandLower
    );
  }

  if (maxPrice !== undefined) {
    const limit = parseFloat(maxPrice);
    if (!Number.isNaN(limit)) {
      results = results.filter((product) => product.price <= limit);
    }
  }

  res.json(
    results.map((product) => ({
      ...product,
      brand: capitalizeFirst(product.brand)
    }))
  );
});

// RECOMMENDATIONS
app.get("/api/recommend", (req, res) => {
  let recommendations = [];

  // History-based recommendation
  if (purchaseHistory.includes("milk")) {
    recommendations.push("bread");
  }

  // Seasonal recommendation (simple demo logic)
  const month = new Date().getMonth();
  if (month >= 5 && month <= 7) {
    recommendations.push("mango");
  }

  // Substitutes
  if (shoppingList.some(item => item.name === "milk")) {
    recommendations.push("almond milk");
  }

  res.json([...new Set(recommendations)]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

