from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query

from app.models import Coin
from app.services.crypto_service import apply_filters, apply_strict_rules, fetch_coins, fetch_coin_details

router = APIRouter()


@router.get("/coins", response_model=List[Coin])
async def get_coins(
    vs_currency: str = Query("usd", description="Currency for prices (e.g. usd, eur)"),
    per_page: int = Query(100, ge=1, le=250, description="Number of coins to fetch"),
    page: int = Query(1, ge=1, description="Page number"),
    order: str = Query("market_cap_desc", description="Sorting order (e.g. market_cap_desc, volume_desc)"),
    search: Optional[str] = Query(None, description="Filter by name or symbol"),
    max_fdv: Optional[float] = Query(None, description="Maximum Fully Diluted Valuation"),
):
    try:
        coins = await fetch_coins(
            vs_currency=vs_currency,
            per_page=per_page,
            page=page,
            order=order,
        )
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"CoinGecko error: {exc}") from exc

    # Strictly adhere to the coding task requirements first
    strict_coins = apply_strict_rules(coins)

    filtered = apply_filters(
        coins=strict_coins,
        search=search,
        max_fdv=max_fdv,
    )

    return [Coin(**c) for c in filtered]

@router.get("/coins/{coin_id}")
async def get_coin_details(coin_id: str):
    try:
        data = await fetch_coin_details(coin_id)
        return data
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"CoinGecko error: {exc}") from exc


