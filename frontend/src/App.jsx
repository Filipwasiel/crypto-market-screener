import React, { useCallback, useEffect, useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'

import CryptoTable from './components/CryptoTable'
import FilterBar from './components/FilterBar'
import { fetchCoins } from './services/api'

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#f57c00' },
  },
})

export default function App() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCoins = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCoins(filters)
      setCoins(data)
    } catch (err) {
      setError(
        err?.response?.data?.detail ?? err.message ?? 'Failed to fetch coins.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCoins()
  }, [loadCoins])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <CurrencyBitcoinIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold">
              Crypto Market Screener
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time cryptocurrency data powered by CoinGecko
            </Typography>
          </Box>
        </Box>

        {/* Filters */}
        <FilterBar onSearch={loadCoins} loading={loading} />

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Results */}
        {!loading && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {coins.length} coin{coins.length !== 1 ? 's' : ''} found
            </Typography>
            <CryptoTable coins={coins} />
          </>
        )}
      </Container>
    </ThemeProvider>
  )
}
