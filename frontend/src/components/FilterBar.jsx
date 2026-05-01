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
    <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, fontWeight: 600 }}>
        <FilterListIcon /> Filters
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <TextField
              fullWidth
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleChange}
              placeholder="Name or symbol…"
              slotProps={{
                inputLabel: { shrink: true },
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
              label="Min Price ($)"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleChange}
              inputProps={{ min: 0, step: 'any' }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 3, md: 2 }}>
            <TextField
              fullWidth
              label="Max Price ($)"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleChange}
              inputProps={{ min: 0, step: 'any' }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, md: 2 }}>
            <TextField
              fullWidth
              label="Min Cap ($)"
              name="minMarketCap"
              type="number"
              value={filters.minMarketCap}
              onChange={handleChange}
              inputProps={{ min: 0, step: 'any' }}
              slotProps={{ inputLabel: { shrink: true } }}
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
              slotProps={{ inputLabel: { shrink: true } }}
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
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Button type="submit" variant="contained" disabled={loading} size="large" sx={{ flex: 1 }}>
            Apply Filters
          </Button>
          <Button type="button" variant="outlined" onClick={handleReset} disabled={loading} size="large" sx={{ flex: 1 }}>
            Reset
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
