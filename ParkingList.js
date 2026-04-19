import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getParkingAreas } from '../services/api';
import ParkingCard from '../components/ParkingCard';
import './ParkingList.css';

const ParkingList = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    city: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'default',
  });

  const fetchAreas = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.city) params.city = filters.city;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const { data } = await getParkingAreas(params);
      let sorted = [...data];
      if (filters.sortBy === 'price_asc') sorted.sort((a, b) => a.pricePerHour - b.pricePerHour);
      else if (filters.sortBy === 'price_desc') sorted.sort((a, b) => b.pricePerHour - a.pricePerHour);
      else if (filters.sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
      else if (filters.sortBy === 'available') sorted.sort((a, b) => b.availableSlots - a.availableSlots);
      setAreas(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAreas(); }, [filters]);

  const updateFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const clearFilters = () => setFilters({ search: '', city: '', minPrice: '', maxPrice: '', sortBy: 'default' });

  return (
    <div className="parking-list-page">
      <div className="page-header">
        <div className="container">
          <h1>Find Parking</h1>
          <p>Browse {areas.length} parking areas available near you</p>
        </div>
      </div>

      <div className="container parking-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filters-card">
            <div className="filters-header">
              <h3>🔍 Filters</h3>
              <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            </div>

            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                className="form-control"
                placeholder="Area, landmark..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>City</label>
              <select className="form-control" value={filters.city} onChange={e => updateFilter('city', e.target.value)}>
                <option value="">All Cities</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nashik">Nashik</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range (₹/hr)</label>
              <div className="price-range">
                <input type="number" className="form-control" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
                <span>—</span>
                <input type="number" className="form-control" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
              </div>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select className="form-control" value={filters.sortBy} onChange={e => updateFilter('sortBy', e.target.value)}>
                <option value="default">Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="available">Most Available</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="parking-results">
          <div className="results-header">
            <p className="results-count">
              {loading ? 'Loading...' : `${areas.length} parking area${areas.length !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {loading ? (
            <div className="page-loader"><div className="spinner"></div><p>Finding parking areas...</p></div>
          ) : areas.length === 0 ? (
            <div className="empty-state">
              <div style={{ fontSize: 64, marginBottom: 16 }}>🅿️</div>
              <h3>No Parking Found</h3>
              <p>Try adjusting your filters or search for a different area.</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="results-grid">
              {areas.map(area => <ParkingCard key={area._id} area={area} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ParkingList;
