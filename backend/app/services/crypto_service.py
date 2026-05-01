from typing import List, Optional, Tuple, Dict
import httpx
import time
import asyncio

from app.models import Coin

COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"

# Cache structure: { cache_key: (data, timestamp) }
_CACHE: Dict[Tuple[str, int, int], Tuple[List[dict], float]] = {}
_DETAILS_CACHE: Dict[str, Tuple[dict, float]] = {}
CACHE_TTL = 60  # seconds

# Lock to prevent concurrent fetches for the same data
_FETCH_LOCK = asyncio.Lock()

async def fetch_coins(
    vs_currency: str = "usd",
    per_page: int = 100,
    page: int = 1,
    order: str = "market_cap_desc",
) -> List[dict]:
    """Fetch coin market data from CoinGecko."""
    cache_key = (vs_currency, per_page, page, order)

    # First check without lock (fast path)
    if cache_key in _CACHE:
        cached_data, timestamp = _CACHE[cache_key]
        if time.time() - timestamp < CACHE_TTL:
            return cached_data

    # Acquire lock to prevent concurrent requests hitting the API
    async with _FETCH_LOCK:
        # Double-check inside the lock
        if cache_key in _CACHE:
            cached_data, timestamp = _CACHE[cache_key]
            if time.time() - timestamp < CACHE_TTL:
                return cached_data

        url = f"{COINGECKO_BASE_URL}/coins/markets"
        params = {
            "vs_currency": vs_currency,
            "order": order,
            "per_page": per_page,
            "page": page,
            "sparkline": "false",
            "price_change_percentage": "24h",
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            _CACHE[cache_key] = (data, time.time())
            return data

async def fetch_coin_details(coin_id: str) -> dict:
    """Fetch detailed coin data from CoinGecko, with caching."""
    now = time.time()
    
    if coin_id in _DETAILS_CACHE:
        cached_data, timestamp = _DETAILS_CACHE[coin_id]
        if now - timestamp < CACHE_TTL:
            return cached_data

    async with _FETCH_LOCK:
        if coin_id in _DETAILS_CACHE:
            cached_data, timestamp = _DETAILS_CACHE[coin_id]
            if time.time() - timestamp < CACHE_TTL:
                return cached_data

        url = f"{COINGECKO_BASE_URL}/coins/{coin_id}"
        params = {
            "localization": "false",
            "tickers": "false",
            "market_data": "true",
            "community_data": "false",
            "developer_data": "false",
            "sparkline": "false"
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            _DETAILS_CACHE[coin_id] = (data, time.time())
            return data



def apply_filters(
    coins: List[dict],
    search: Optional[str],
    max_fdv: Optional[float] = None,
) -> List[dict]:
    """Apply user-defined filters to the coin list."""
    result = coins

    if search:
        search_lower = search.lower()
        result = [
            c for c in result
            if search_lower in c.get("name", "").lower()
            or search_lower in c.get("symbol", "").lower()
        ]

    if max_fdv is not None:
        result = [c for c in result if (c.get("fully_diluted_valuation") or 0) <= max_fdv]

    return result


def apply_strict_rules(coins: List[dict]) -> List[dict]:
    """
    Apply strict project filtering criteria:
    - Market Capitalization (mcap) > 0
    - preview_listing == true
    - Max Supply equals Total Supply
    - Fully Diluted Valuation (FDV) < $100M
    - 24h Trading Volume > $50k
    - Total Value Locked (TVL) > $50k
    """
    result = []
    for c in coins:
        mcap = c.get("market_cap") or 0
        preview_listing = c.get("preview_listing", True) # Default to True if missing from CoinGecko standard API
        max_supply = c.get("max_supply")
        total_supply = c.get("total_supply")
        fdv = c.get("fully_diluted_valuation") or 0
        volume_24h = c.get("total_volume") or 0
        tvl = c.get("tvl") or c.get("total_value_locked") or 0 # TVL is often not returned

        if mcap <= 0:
            continue
        if not preview_listing:
            continue
        if max_supply is None or total_supply is None or max_supply != total_supply:
            continue
        if fdv >= 100_000_000:
            continue
        if volume_24h <= 50_000:
            continue
        if tvl <= 50_000:
            continue
        
        result.append(c)
        
    return result

