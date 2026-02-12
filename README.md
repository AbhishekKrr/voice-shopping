# Voice Command Shopping Assistant

A full-stack Voice-Controlled Shopping Assistant that allows users to manage their shopping list using natural voice commands.

The application supports adding items with quantities, removing items, smart product search with filters, cheapest product detection, and recommendation logic through speech input.

---

## Live Demo

Frontend (Vercel):  
https://voice-shopping-blond.vercel.app/

Backend (Render):  
https://voice-shopping-backend-1ivl.onrender.com

GitHub Repository:  
https://github.com/AbhishekKrr/voice-shopping

---

## Project Overview

This application enables users to:

- Add items to a shopping list using voice
- Remove items using voice commands
- Search products by name
- Filter products by brand
- Filter products under a price limit
- Sort and retrieve the cheapest products
- Get smart product recommendations

The system uses rule-based NLP parsing to interpret voice commands and convert them into structured API requests.

---

## Architecture

User (Voice Input)  
        ↓  
Web Speech API (Browser)  
        ↓  
React Frontend (Intent Parsing)  
        ↓  
Express Backend (REST API)  
        ↓  
In-memory Data Store  

---

## Features Implemented

### Shopping List Management
- Add items with numeric or word quantities
- Remove items by name
- Automatic category tagging

### Smart Product Search
- Search by product name
- Filter by brand
- Filter by maximum price
- Retrieve cheapest products

### Recommendation Engine
- History-based recommendations
- Simple seasonal recommendations
- Substitute suggestions

### Voice Command Processing
- Natural language parsing
- Number word recognition (e.g., "three", "five")
- Filler word removal
- Dynamic query extraction

---

## Supported Voice Commands

### Add Items

- Add milk
- Add three apples
- Buy two bread
- I need milk
- Get three milk for me

---

### Remove Items

- Remove milk
- Remove apples

---

### Search Products

- Search shampoo
- Find toothpaste
- Find Dove soap
- Find shampoo under 10
- Cheapest shampoo under Rs 10
- Search Colgate toothpaste

---

## Tech Stack

Frontend:
- React
- Axios
- Web Speech API (SpeechRecognition)

Backend:
- Node.js
- Express.js
- REST APIs
- In-memory storage

Deployment:
- GitHub
- Render (Backend)
- Vercel (Frontend)

---

## Project Structure

voice-shopping/
│
├── backend/
│   ├── server.js
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   ├── package.json
│
├── .gitignore
└── README.md

---

## How To Run Locally

### Clone Repository

```bash
git clone https://github.com/AbhishekKrr/voice-shopping.git
cd voice-shopping
```

### Start Backend

```bash
cd backend
npm install
node server.js
```

Backend runs on:
http://localhost:5000

### Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on:
http://localhost:3000

---

## Assumptions

- Uses in-memory storage (data resets on server restart)
- Voice recognition works best in Chrome / Edge
- Price filtering assumes numeric input
- Brand detection uses predefined brand list

---

## Limitations

- No database persistence
- No authentication
- Rule-based NLP (not ML-based)
- Limited product dataset

---

## Future Enhancements

- Database integration (MongoDB / PostgreSQL)
- AI-based intent recognition (Rasa / OpenAI)
- User authentication (JWT)
- Shopping history dashboard
- Advanced recommendation engine
- Mobile PWA support

---

## Author

Abhishek Kumar Rai  
GitHub: https://github.com/AbhishekKrr  

---

## Submission Summary

This project demonstrates:

- Full-stack application development
- Voice command processing
- REST API design
- Frontend-backend integration
- Deployment to production
- Clean GitHub project structure
- Proper documentation

Production Ready  
Live Deployment  
Assignment Compliant  
