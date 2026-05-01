from pydantic import BaseModel
from typing import Optional


class Coin(BaseModel):
    id: str
    symbol: str
    name: str
    image: str
    current_price: Optional[float] = None
    market_cap: Optional[float] = None
    market_cap_rank: Optional[int] = None
    total_volume: Optional[float] = None
    price_change_percentage_24h: Optional[float] = None
    circulating_supply: Optional[float] = None
