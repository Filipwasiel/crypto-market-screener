import axios from 'axios'

const BASE_URL = '/api'

/**
 * Fetch filtered coins from the backend.
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
export async function fetchCoins(filters = {}) {
  const params = {}

  if (filters.search) params.search = filters.search
  if (filters.minPrice !== '' && filters.minPrice != null) params.min_price = filters.minPrice
  if (filters.maxPrice !== '' && filters.maxPrice != null) params.max_price = filters.maxPrice
  if (filters.minMarketCap !== '' && filters.minMarketCap != null)
    params.min_market_cap = filters.minMarketCap
  if (filters.minChange24h !== '' && filters.minChange24h != null)
    params.min_change_24h = filters.minChange24h
  if (filters.maxChange24h !== '' && filters.maxChange24h != null)
    params.max_change_24h = filters.maxChange24h
  if (filters.perPage) params.per_page = filters.perPage
  if (filters.page) params.page = filters.page

  const response = await axios.get(`${BASE_URL}/coins`, { params })
  return response.data
}
