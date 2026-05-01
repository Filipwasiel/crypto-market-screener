import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { fetchCoinDetails } from '../services/api'

function formatNumber(value) {
  if (value == null) return '—'
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
}

export default function CoinDetailsModal({ open, onClose, coinId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open && coinId) {
      setLoading(true)
      setError(null)
      fetchCoinDetails(coinId)
        .then((res) => setData(res))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false))
    } else {
      setData(null)
    }
  }, [open, coinId])

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {data ? `${data.name} (${data.symbol.toUpperCase()}) Details` : 'Loading...'}
      </DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Typography color="error" align="center" sx={{ p: 4 }}>
            Error: {error}
          </Typography>
        )}
        {!loading && !error && data && (
          <Grid container spacing={3}>
            {/* Description */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="h6" gutterBottom>About {data.name}</Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                dangerouslySetInnerHTML={{ __html: data.description?.en || 'No description available.' }} 
                sx={{ 
                  '& a': { color: 'primary.main', textDecoration: 'none' },
                  '& a:hover': { textDecoration: 'underline' }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}><Divider /></Grid>

            {/* Business/Market Stats */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">All-Time High (ATH)</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatNumber(data.market_data?.ath?.usd)}
              </Typography>
              <Typography variant="caption" color={data.market_data?.ath_change_percentage?.usd >= 0 ? 'success.main' : 'error.main'}>
                {data.market_data?.ath_change_percentage?.usd?.toFixed(2)}%
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">All-Time Low (ATL)</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatNumber(data.market_data?.atl?.usd)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">Total Supply</Typography>
              <Typography variant="body1" fontWeight="bold">
                {data.market_data?.total_supply?.toLocaleString() || '—'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">Max Supply</Typography>
              <Typography variant="body1" fontWeight="bold">
                {data.market_data?.max_supply?.toLocaleString() || '—'}
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">Fully Diluted Valuation</Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatNumber(data.market_data?.fully_diluted_valuation?.usd)}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle2" color="text.secondary">Genesis Date</Typography>
              <Typography variant="body1" fontWeight="bold">
                {data.genesis_date || 'Unknown'}
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}><Divider /></Grid>

            {/* Links and Tags */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Links</Typography>
              {data.links?.homepage?.filter(Boolean).map((link, idx) => {
                try {
                  const url = new URL(link)
                  return (
                    <Link key={idx} href={link} target="_blank" rel="noreferrer" sx={{ display: 'inline-flex', alignItems: 'center', mr: 2, mb: 1 }}>
                      {url.hostname} <OpenInNewIcon sx={{ fontSize: 16, ml: 0.5 }} />
                    </Link>
                  )
                } catch { return null }
              })}
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Categories</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {data.categories?.filter(Boolean).map((cat, idx) => (
                  <Chip key={idx} label={cat} size="small" variant="outlined" />
                ))}
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  )
}
