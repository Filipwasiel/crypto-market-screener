from typing import List, Optional
import httpx

from app.models import Coin

COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3"


async def fetch_coins(
    vs_currency: str = "usd",
    per_page: int = 100,
    page: int = 1,
) -> List[dict]:
    """Fetch coin market data from CoinGecko."""
    url = f"{COINGECKO_BASE_URL}/coins/markets"
    params = {
        "vs_currency": vs_currency,
        "order": "market_cap_desc",
        "per_page": per_page,
        "page": page,
        "sparkline": "false",
        "price_change_percentage": "24h",
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        return response.json()


def apply_filters(
    coins: List[dict],
    search: Optional[str],
    min_price: Optional[float],
    max_price: Optional[float],
    min_market_cap: Optional[float],
    min_change_24h: Optional[float],
    max_change_24h: Optional[float],
) -> List[dict]:
    """Apply in-memory filters to the coin list."""
    result = coins

    if search:
        search_lower = search.lower()
        result = [
            c for c in result
            if search_lower in c.get("name", "").lower()
            or search_lower in c.get("symbol", "").lower()
        ]

    if min_price is not None:
        result = [c for c in result if (c.get("current_price") or 0) >= min_price]

    if max_price is not None:
        result = [c for c in result if (c.get("current_price") or 0) <= max_price]

    if min_market_cap is not None:
        result = [c for c in result if (c.get("market_cap") or 0) >= min_market_cap]

    if min_change_24h is not None:
        result = [
            c for c in result
            if (c.get("price_change_percentage_24h") or 0) >= min_change_24h
        ]

    if max_change_24h is not None:
        result = [
            c for c in result
            if (c.get("price_change_percentage_24h") or 0) <= max_change_24h
        ]

    return result
