import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [list, setList] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [listening, setListening] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const API = "http://localhost:5000";

  // Fetch list
  const fetchList = async () => {
    const res = await axios.get(`${API}/api/list`);
    setList(res.data);
  };

  // Fetch recommendations
  const fetchRecommendations = async () => {
    const res = await axios.get(`${API}/api/recommend`);
    setRecommendations(res.data);
  };

  useEffect(() => {
    fetchList();
    fetchRecommendations();
  }, []);

  // Voice recognition
  const startListening = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setCommand(text);
      handleCommand(text);
    };

    recognition.start();
  };


// -------- INTENT PARSER --------
const parseCommand = (text) => {
  const lower = text.toLowerCase();

  const numberWords = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10
  };

  const brands = ["colgate", "dove", "amul"];

  let intent = null;
  let quantity = 1;
  let item = "";
  let brand = "";
  let maxPrice = null;
  let sort = null;

  // INTENT
  if (/\b(add|buy|need|get)\b/.test(lower)) {
    intent = "ADD";
  } else if (/\b(remove|delete)\b/.test(lower)) {
    intent = "REMOVE";
  } else if (/\b(find|search|cheapest)\b/.test(lower)) {
    intent = "SEARCH";
  }

  // QUANTITY
  const digitMatch = lower.match(/\b\d+\b/);
  if (digitMatch) {
    quantity = parseInt(digitMatch[0]);
  } else {
    for (let word in numberWords) {
      if (new RegExp(`\\b${word}\\b`).test(lower)) {
        quantity = numberWords[word];
        break;
      }
    }
  }

  // PRICE
  const priceMatch = lower.match(/\bunder\s+(?:rs\s*)?(\d+(?:\.\d+)?)\b/);
  if (priceMatch) {
    maxPrice = parseFloat(priceMatch[1]);
  }

  // SORT
  if (lower.includes("cheapest")) {
    sort = "PRICE_ASC";
  }

  // BRAND
  for (const b of brands) {
    if (new RegExp(`\\b${b}\\b`).test(lower)) {
      brand = b;
      break;
    }
  }

  // CLEAN ITEM
  let cleaned = lower
  .replace(/\b(add|buy|need|get|remove|delete|find|search|cheapest)\b/g, "")
  .replace(/\bunder\s+(?:rs\s*)?\d+(?:\.\d+)?\b/g, "")
  .replace(/\b(price|rupees|rs|dollars|dollar|please|some|a|an|the|to|my|list|for|i|me|want|need|of|in|on|at|is|are)\b/g, "")
  .replace(new RegExp(`\\b(?:${brands.join("|")})\\b`, "g"), "")
  .replace(/\b\d+\b/g, "");

// 🔥 REMOVE NUMBER WORDS
Object.keys(numberWords).forEach(word => {
  cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "g"), "");
});

cleaned = cleaned
  .replace(/\s+/g, " ")
  .trim();


  item = cleaned;

  return { intent, item, quantity, brand, maxPrice, sort };
};


// -------- CLEAN HANDLER --------
const handleCommand = async (text) => {
  setLoading(true);

  const parsed = parseCommand(text);

  try {
    switch (parsed.intent) {

      case "ADD":
        if (parsed.item) {
          await axios.post(`${API}/api/list`, {
            name: parsed.item,
            quantity: parsed.quantity
          });
        }
        break;

      case "REMOVE":
        if (parsed.item) {
          await axios.delete(`${API}/api/list/${parsed.item}`);
        }
        break;

      case "SEARCH":
        const params = {};
        if (parsed.item) params.item = parsed.item;
        if (parsed.brand) params.brand = parsed.brand;
        if (parsed.maxPrice !== null) params.maxPrice = parsed.maxPrice;

        const res = await axios.get(`${API}/api/search`, { params });

        let results = res.data;

        if (parsed.sort === "PRICE_ASC") {
          results = results.sort((a, b) => a.price - b.price);
        }

        setSearchResults(results);
        break;

      default:
        console.log("No valid intent detected.");
    }

    if (parsed.intent === "ADD" || parsed.intent === "REMOVE") {
      await fetchList();
      await fetchRecommendations();
    }

  } catch (err) {
    console.error("Command error:", err);
  }

  setLoading(false);
};


// 👇 ADD THIS RIGHT ABOVE return()

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
    display: "flex",
    justifyContent: "center",
    padding: "30px 15px",
    fontFamily: "'Segoe UI', sans-serif"
  },

  container: {
    width: "100%",
    maxWidth: "1100px"
  },

  title: {
    textAlign: "center",
    color: "#ffffff",
    marginBottom: "30px",
    fontSize: "2.2rem",
    fontWeight: "600",
    letterSpacing: "1px"
  },

  controlRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "20px"
  },

  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    fontSize: "0.95rem"
  },

  voiceButton: {
    padding: "12px 22px",
    borderRadius: "8px",
    border: "none",
    background: "#ff7a18",
    backgroundImage: "linear-gradient(45deg, #ff7a18, #ffb347)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "1rem",
    transition: "all 0.3s ease"
  },

  commandText: {
    textAlign: "center",
    color: "#ffffff",
    marginBottom: "10px",
    fontSize: "0.95rem"
  },

  loading: {
    textAlign: "center",
    color: "#ffdf6c",
    marginBottom: "15px"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px"
  },

  card: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "25px",
    color: "#ffffff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease"
  },

  cardFull: {
    gridColumn: "1 / -1",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    borderRadius: "16px",
    padding: "25px",
    color: "#ffffff",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
  },

  list: {
    listStyle: "none",
    padding: 0,
    marginTop: "15px"
  },

  listItem: {
    padding: "10px 0",
    borderBottom: "1px solid rgba(255,255,255,0.2)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.95rem"
  },

  meta: {
    fontSize: "0.85rem",
    opacity: 0.8
  },

  metaText: {
    fontSize: "0.9rem",
    marginBottom: "10px",
    opacity: 0.85
  }
};




return (
  <div style={styles.page}>
    <div style={styles.container}>
      
      <h1 style={styles.title}>Voice Shopping Assistant</h1>

      <div style={styles.controlRow}>

        <button
  onClick={startListening}
  style={styles.voiceButton}
  onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
  onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
>
  {listening ? "Listening..." : "🎤 Speak"}
</button>

      </div>

      <p style={styles.commandText}>
        <strong>Recognized:</strong> {command}
      </p>

      {loading && <p style={styles.loading}>Processing...</p>}

      <div style={styles.grid}>

        <div style={styles.card}>
          <h2>Shopping List</h2>
          <ul style={styles.list}>
            {list.map((item, index) => (
              <li key={index} style={styles.listItem}>
                {item.name}
                <span style={styles.meta}>
                  Qty: {item.quantity} • {item.category}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.card}>
          <h2>Smart Suggestions</h2>
          <ul style={styles.list}>
            {recommendations.map((rec, index) => (
              <li key={index} style={styles.listItem}>{rec}</li>
            ))}
          </ul>
        </div>

        <div style={styles.cardFull}>
          <h2>Search Results</h2>
          {searchResults.length > 0 && (
            <p style={styles.metaText}>
              {searchResults.length} products found
            </p>
          )}
          <ul style={styles.list}>
            {searchResults.map((product, index) => (
              <li key={index} style={styles.listItem}>
                {product.brand.toUpperCase()} - {product.name}
                <span style={styles.meta}>
                  ₹{Number(product.price).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  </div>
);

}

export default App;
