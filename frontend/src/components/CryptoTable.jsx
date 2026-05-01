import React from 'react'
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

function formatNumber(value, decimals = 2) {
  if (value == null) return '—'
  if (value >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(decimals)}K`
  return `$${value.toFixed(decimals)}`
}

function PriceChange({ value }) {
  if (value == null) return <Typography variant="body2">—</Typography>
  const positive = value >= 0
  return (
    <Chip
      icon={positive ? <TrendingUpIcon /> : <TrendingDownIcon />}
      label={`${positive ? '+' : ''}${value.toFixed(2)}%`}
      color={positive ? 'success' : 'error'}
      size="small"
      variant="outlined"
    />
  )
}

export default function CryptoTable({ coins, onRowClick }) {
  if (!coins || coins.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No coins match the current filters.
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', padding: 3 }}>
      <Table size="small" aria-label="crypto market table" sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ '& th': { fontWeight: '600', bgcolor: 'action.hover', whiteSpace: 'nowrap' } }}>
            <TableCell>#</TableCell>
            <TableCell>Coin</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">24h %</TableCell>
            <TableCell align="right">Market Cap</TableCell>
            <TableCell align="right">Volume (24h)</TableCell>
            <TableCell align="right">Circulating Supply</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {coins.map((coin) => (
            <TableRow
              key={coin.id}
              hover
              onClick={() => onRowClick && onRowClick(coin.id)}
              sx={{ '&:last-child td': { border: 0 }, '& td': { whiteSpace: 'nowrap' }, cursor: 'pointer' }}
            >
              <TableCell>{coin.market_cap_rank ?? '—'}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Avatar src={coin.image} alt={coin.name} sx={{ width: 28, height: 28 }} />
                  <Box>
                    <Typography variant="body2" fontWeight="600">
                      {coin.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {coin.symbol?.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell align="right">
                {coin.current_price != null
                  ? `$${coin.current_price.toLocaleString()}`
                  : '—'}
              </TableCell>
              <TableCell align="right">
                <PriceChange value={coin.price_change_percentage_24h} />
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 500 }}>{formatNumber(coin.market_cap)}</TableCell>
              <TableCell align="right">{formatNumber(coin.total_volume)}</TableCell>
              <TableCell align="right">
                {coin.circulating_supply != null
                  ? `${coin.circulating_supply.toLocaleString(undefined, { maximumFractionDigits: 0 })} ${coin.symbol?.toUpperCase()}`
                  : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
