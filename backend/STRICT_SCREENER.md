# Strict Crypto Screener

This document explains the implementation of the new Strict Crypto Screener endpoint which filters cryptocurrency projects using specific, rigorous criteria.

## 1. REST API Endpoint

A new endpoint has been added to the backend:

- **Endpoint:** `GET /api/strict-screener`
- **Description:** Retrieves and returns a list of cryptocurrencies strictly filtered by the required criteria.
- **Parameters:**
  - `vs_currency` (string, default: `usd`)
  - `per_page` (integer, default: 100)
  - `page` (integer, default: 1)

## 2. Filtering Criteria

The backend (`crypto_service.py`) processes the raw data from CoinGecko through the `apply_strict_rules()` function to enforce these exact rules:
- Market Capitalization (`mcap`) > 0
- `preview_listing == true`
- Max Supply equals Total Supply
- Fully Diluted Valuation (FDV) < $100M
- 24h Trading Volume > $50k
- Total Value Locked (TVL) > $50k

## 3. Assumptions Made

The underlying data provider for this application is the **CoinGecko `/coins/markets`** API. Due to the structure of data returned by this specific API, the following assumptions were made to enforce the filters without breaking functionality:

1. **`preview_listing`**: The CoinGecko `/coins/markets` endpoint does not natively return a `preview_listing` boolean. 
   * *Assumption*: If this field is completely missing from the API response, it defaults to `True` to allow projects to be evaluated on the remaining criteria. If it is explicitly set to `False`, the project is rejected.
2. **Total Value Locked (`tvl`)**: The `/coins/markets` endpoint does not consistently return TVL for standard coins (it is mostly provided in specific DeFi endpoints or individual coin requests). 
   * *Assumption*: If the TVL value is missing (`None`), it is treated as `0`. This means that **any coin without TVL data returned by CoinGecko will fail the `TVL > $50k` check** and be filtered out.
3. **Max Supply and Total Supply**: Handled missing supply fields by enforcing that both fields must exist and be strictly equal.

## 4. Setup Instructions

The new endpoint works out-of-the-box with the current backend setup. You can test it by running the backend:

1. In the project root, start the application via Docker:
   ```bash
   docker-compose up -d
   ```
2. Navigate to the FastAPI Swagger UI to test the endpoint interactively:
   [http://localhost:8000/docs](http://localhost:8000/docs)
3. You will see a new endpoint listed as `GET /api/strict-screener`. Click "Try it out" and then "Execute" to view the filtered list of coins.
