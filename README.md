# Crypto Market Screener

A full-stack web application that fetches and displays filtered cryptocurrency data.

- **Backend**: Python + [FastAPI](https://fastapi.tiangolo.com/) — proxies and filters data from the [CoinGecko API](https://www.coingecko.com/en/api)
- **Frontend**: React + [Material UI](https://mui.com/) — interactive screener with real-time filters

---

## Project Structure

```
crypto-market-screener/
├── backend/
│   ├── main.py                        # FastAPI application entry point
│   ├── requirements.txt
│   └── app/
│       ├── models.py                  # Pydantic models
│       ├── routes/
│       │   └── crypto.py              # /api/coins endpoint
│       └── services/
│           └── crypto_service.py      # CoinGecko fetch + filter logic
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/
        │   ├── FilterBar.jsx          # Filter controls
        │   └── CryptoTable.jsx        # Data table
        └── services/
            └── api.js                 # Axios API client
```

---

## Getting Started

### Backend

```bash
cd backend

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the development server (http://localhost:8000)
uvicorn main:app --reload
```

Interactive API docs are available at http://localhost:8000/docs.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev
```

> The Vite dev server proxies `/api` requests to `http://localhost:8000`, so both services can run simultaneously without CORS issues.

---

## API Reference

| Method | Path | Query Params | Description |
|--------|------|--------------|-------------|
| `GET` | `/api/coins` | `vs_currency`, `per_page`, `page`, `search`, `min_price`, `max_price`, `min_market_cap`, `min_change_24h`, `max_change_24h` | Returns filtered list of coins |

---

## Features

- 🔍 Search by coin name or ticker symbol
- 💰 Filter by price range (min / max)
- 📊 Filter by market cap
- 📈 Filter by 24-hour price change percentage
- Live data from CoinGecko public API
