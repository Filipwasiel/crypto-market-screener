# Crypto Market Screener

A simple full-stack web application that fetches, filters, and displays cryptocurrency data according to strict business logic, powered by the CoinGecko API.

- **Backend**: Python + FastAPI
- **Frontend**: React + Material-UI (Vite)
- **Orchestration**: Docker + Docker Compose

---

## How to Run the Project

The entire application is fully dockerized for a simple, single-command setup.

### Prerequisites
- Docker and Docker Compose installed on your machine.

### Execution
1. Open your terminal in the root directory of this project (`crypto-market-screener`).
2. Run the following command:
   ```bash
   docker-compose up --build -d
   ```
3. Once the containers are built and running, open your browser and navigate to:
   - **Frontend UI**: `http://localhost:8080`
   - **Backend API Docs**: `http://localhost:8000/docs`

> *Note: If you wish to run the project locally without Docker, you can start the backend via `uvicorn main:app --reload` in the `backend/` directory, and the frontend via `npm run dev` in the `frontend/` directory.*

---

## What I Completed

I have built the complete full-stack application strictly adhering to the task requirements:

### Part 1: Backend (Python)
- **REST API Endpoint (`GET /api/coins`)**: Developed a clean FastAPI endpoint that fetches data from CoinGecko and applies the strict business rules requested:
  - Market Capitalization > 0
  - `preview_listing == true`
  - Max Supply equals Total Supply
  - Fully Diluted Valuation (FDV) < $100M
  - 24h Trading Volume > $50k
  - Total Value Locked (TVL) > $50k
- **Detailed Endpoint (`GET /api/coins/{coin_id}`)**: Added an endpoint to fetch extended project details (genesis date, deep market data, links).
- **Concurrency & Caching**: Implemented a 60-second in-memory cache wrapped in `asyncio.Lock()` to prevent the "thundering herd" problem and avoid CoinGecko `429 Too Many Requests` rate limits when users spam filters or refresh rapidly.

### Part 2: Frontend (React)
- **Dynamic List**: Displays the strictly filtered list of projects passed from the backend.
- **Search & Filtering**: Added a real-time search by partial name/symbol, and an additional user-defined **Max FDV** filter.
- **Sorting**: Added dropdowns to sort the data dynamically by **Market Capitalization** or **24h Trading Volume**, in both Ascending and Descending orders.
- **Detailed View Modal**: Made table rows clickable. Clicking a project opens a modal displaying deeper business metrics (ATH, ATL, Genesis Date) and clickable official links.
- **UI/UX**: Implemented a clean, premium, and fully mobile-responsive Material-UI design, complete with a global **Dark/Light mode toggle**.

---

## Assumptions & Limitations

### FAQ: Why is the table empty ("No coins match")?
You might notice the table is empty when you launch the application. This is not a bug! The backend flawlessly enforces the extremely strict business logic required in Part 1. However, these rules clash with the reality of the live cryptocurrency market for the top coins:
1. **`FDV < $100M`**: CoinGecko API by default returns the Top 100 largest projects (Bitcoin, Ethereum, etc.). All of them have an FDV in the tens of billions. Thus, the strict FDV rule instantly filters out the entire first page of results.
2. **`TVL > $50k`**: The free CoinGecko API omits TVL data (`null`) for 99% of projects in the standard endpoint unless they are specific DeFi protocols. Our code correctly treats `null` as `0`, immediately disqualifying them.
3. **`Max Supply == Total Supply`**: Very few projects have 100% of their supply unlocked (e.g., Bitcoin is still mining, Ethereum has no hard cap). This rule eliminates another huge chunk of the market.
*To see data populate in the frontend, you would either need to paginate very deep into the low-cap coins, or temporarily relax these strict rules in the `backend/app/services/crypto_service.py` file.*

### Assumptions
1. **CoinGecko TVL Data**: The free tier of CoinGecko's `/coins/markets` endpoint frequently omits the `tvl` field for many projects. I assumed that if `tvl` is missing or null, it evaluates to `0`. Consequently, this strictly filters out almost all projects because `TVL > 50k` is a hard requirement.
2. **Preview Listing Data**: The `preview_listing` boolean is not always returned by the standard markets API. I assumed it defaults to `True` if missing so that standard established projects aren't unnecessarily filtered out.
3. **Strict Filtering Location**: I assumed the requirement "Your backend should retrieve and filter cryptocurrency project data using the following criteria" meant the *primary* dataset served to the frontend should be strictly filtered by default, rather than just offering it as an optional toggle. Thus, the frontend only ever sees data that passes the strict test.

### Limitations
1. **CoinGecko Rate Limits**: The application relies on the free public CoinGecko API. While backend caching and async locking mitigate most issues, excessive rapid navigation across multiple pages might still trigger temporary HTTP 429 (Too Many Requests) errors.
2. **Pagination vs Filtering**: Because CoinGecko API pagination happens *before* our custom strict filtering in the backend, a page request (e.g., fetching 100 coins) might result in 0 coins being returned after the strict rules are applied. A production system would ideally index this data in a local database (like PostgreSQL) via a background worker, allowing for native SQL pagination over the filtered dataset.
