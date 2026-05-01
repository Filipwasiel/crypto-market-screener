import React, { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'

const defaultFilters = {
  search: '',
  minPrice: '',
  maxPrice: '',
  minMarketCap: '',
  minChange24h: '',
  maxChange24h: '',
}

export default function FilterBar({ onSearch, loading }) {
  const [filters, setFilters] = useState(defaultFilters)

  function handleChange(e) {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSearch(filters)
  }

  function handleReset() {
    setFilters(defaultFilters)
    onSearch(defaultFilters)
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FilterListIcon /> Filters
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Name or symbol…"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <TextField
              fullWidth
              label="Min Price (USD)"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleChange}
              inputProps={{ min: 0, step: 'any' }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <TextField
              fullWidth
              label="Max Price (USD)"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleChange}
              inputProps={{ min: 0, step: 'any' }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <TextField
              fullWidth
              label="Min Market Cap"
              name="minMarketCap"
              type="number"
              value={filters.minMarketCap}
              onChange={handleChange}
              inputProps={{ min: 0, step: 'any' }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 1 }}>
            <TextField
              fullWidth
              label="Min 24h %"
              name="minChange24h"
              type="number"
              value={filters.minChange24h}
              onChange={handleChange}
              inputProps={{ step: 'any' }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 4, md: 1 }}>
            <TextField
              fullWidth
              label="Max 24h %"
              name="maxChange24h"
              type="number"
              value={filters.maxChange24h}
              onChange={handleChange}
              inputProps={{ step: 'any' }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={loading}>
            Apply Filters
          </Button>
          <Button type="button" variant="outlined" onClick={handleReset} disabled={loading}>
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
