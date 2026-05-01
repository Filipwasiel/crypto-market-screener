import React, { useState } from 'react'
import {
  Box,
  Button,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'

const defaultFilters = {
  search: '',
  maxFdv: '',
  sortBy: 'market_cap',
  sortOrder: 'desc',
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
        <FilterListIcon /> Filters & Sorting
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
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              fullWidth
              label="Max FDV ($)"
              name="maxFdv"
              type="number"
              value={filters.maxFdv}
              onChange={handleChange}
              inputProps={{ min: 0, step: 'any' }}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Sort By"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleChange}
            >
              <MenuItem value="market_cap">Market Cap</MenuItem>
              <MenuItem value="volume">24h Volume</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 6, sm: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              label="Order"
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleChange}
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </TextField>
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
