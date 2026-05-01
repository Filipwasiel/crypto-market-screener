import React, { useCallback, useEffect, useState, useMemo } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  Typography,
  Pagination,
  IconButton,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'

import CryptoTable from './components/CryptoTable'
import FilterBar from './components/FilterBar'
import { fetchCoins } from './services/api'

export default function App() {
  const [mode, setMode] = useState('dark')

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === 'light' ? '#2563eb' : '#3b82f6' }, // Modern blues
          secondary: { main: '#f59e0b' }, // Amber
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
        },
        shape: {
          borderRadius: 16,
        },
        typography: {
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          h4: { fontWeight: 800, letterSpacing: '-0.03em' },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: { textTransform: 'none', fontWeight: 600 },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: { backgroundImage: 'none' },
            },
          },
        },
      }),
    [mode],
  )

  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentFilters, setCurrentFilters] = useState({})
  const [page, setPage] = useState(1)

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

  const handleSearch = useCallback((filters) => {
    setCurrentFilters(filters)
    setPage(1)
    loadCoins({ ...filters, page: 1 })
  }, [loadCoins])

  const handlePageChange = useCallback((event, value) => {
    setPage(value)
    loadCoins({ ...currentFilters, page: value })
  }, [currentFilters, loadCoins])

  useEffect(() => {
    loadCoins({ page: 1 })
  }, [loadCoins])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', p: 1, borderRadius: 3, 
              bgcolor: mode === 'light' ? 'primary.50' : 'rgba(59, 130, 246, 0.1)',
              color: 'primary.main' 
            }}>
              <CurrencyBitcoinIcon sx={{ fontSize: 36 }} />
            </Box>
            <Box>
              <Typography variant="h4">
                Crypto Screener
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time market data powered by CoinGecko
              </Typography>
            </Box>
          </Box>
          <IconButton 
            sx={{ ml: 1, bgcolor: mode === 'light' ? 'grey.100' : 'rgba(255, 255, 255, 0.05)' }} 
            onClick={() => setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))} 
            color="inherit"
          >
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>

        {/* Filters */}
        <FilterBar onSearch={handleSearch} loading={loading} />

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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={100} 
                page={page} 
                onChange={handlePageChange} 
                color="primary" 
                disabled={loading}
              />
            </Box>
          </>
        )}
      </Container>
    </ThemeProvider>
  )
}
