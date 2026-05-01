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
  if (filters.maxFdv !== '' && filters.maxFdv != null) params.max_fdv = filters.maxFdv
  if (filters.sortBy && filters.sortOrder) {
    params.order = `${filters.sortBy}_${filters.sortOrder}`
  }
  if (filters.perPage) params.per_page = filters.perPage
  if (filters.page) params.page = filters.page

  const response = await axios.get(`${BASE_URL}/coins`, { params })
  return response.data
}

/**
 * Fetch detailed information for a specific coin.
 * @param {string} coinId 
 * @returns {Promise<Object>}
 */
export async function fetchCoinDetails(coinId) {
  const response = await axios.get(`${BASE_URL}/coins/${coinId}`)
  return response.data
}

