from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.models import Coin
from app.services.crypto_service import apply_filters, apply_strict_rules, fetch_coins

router = APIRouter()


@router.get("/coins", response_model=List[Coin])
async def get_coins(
    vs_currency: str = Query("usd", description="Currency for prices (e.g. usd, eur)"),
    per_page: int = Query(100, ge=1, le=250, description="Number of coins to fetch"),
    page: int = Query(1, ge=1, description="Page number"),
    search: Optional[str] = Query(None, description="Filter by name or symbol"),
    min_price: Optional[float] = Query(None, description="Minimum current price"),
    max_price: Optional[float] = Query(None, description="Maximum current price"),
    min_market_cap: Optional[float] = Query(None, description="Minimum market cap"),
    min_change_24h: Optional[float] = Query(None, description="Minimum 24h % change"),
    max_change_24h: Optional[float] = Query(None, description="Maximum 24h % change"),
):
    try:
        coins = await fetch_coins(
            vs_currency=vs_currency,
            per_page=per_page,
            page=page,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"CoinGecko error: {exc}") from exc

    filtered = apply_filters(
        coins=coins,
        search=search,
        min_price=min_price,
        max_price=max_price,
        min_market_cap=min_market_cap,
        min_change_24h=min_change_24h,
        max_change_24h=max_change_24h,
    )

    return [Coin(**c) for c in filtered]
