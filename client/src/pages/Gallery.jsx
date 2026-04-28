import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getArtworks } from '../services/api';
import ArtworkCard from '../components/ArtworkCard';
import './Gallery.css';

const CATEGORIES = ['All', 'Painting', 'Sculpture', 'Photography', 'Digital Art', 'Sketch', 'Mixed Media', 'Other'];
const STATUSES = ['All', 'available', 'auction'];

const Gallery = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    status: 'All',
    sort: 'newest',
    search: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    let active = true;
    const params = {};
    if (filters.category !== 'All') params.category = filters.category;
    if (filters.status !== 'All') params.status = filters.status;
    if (filters.sort) params.sort = filters.sort;
    if (filters.search) params.search = filters.search;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    getArtworks(params)
      .then(({ data }) => active && setArtworks(data.data))
      .catch(() => active && setArtworks([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [filters]);

  const updateFilter = (key, val) => {
    setLoading(true);
    setFilters(f => ({ ...f, [key]: val }));
  };

  const resetFilters = () => {
    setLoading(true);
    setFilters({ category: 'All', status: 'All', sort: 'newest', search: '', minPrice: '', maxPrice: '' });
  };

  return (
    <div className="gallery-page">
      <div className="container">
        <div className="page-header" style={{ paddingTop: '100px' }}>
          <h1>Art Gallery</h1>
          <p>Discover {artworks.length} unique artworks from talented artists worldwide</p>
        </div>

        {/* Search bar */}
        <div className="gallery-search">
          <input
            type="text"
            className="form-input gallery-search-input"
            placeholder="🔍 Search artworks by title..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
          />
        </div>

        <div className="gallery-layout">
          {/* Sidebar Filters */}
          <aside className="gallery-sidebar">
            <div className="filter-section">
              <h4 className="filter-title">Category</h4>
              {CATEGORIES.map(cat => (
                <button key={cat} className={`filter-btn ${filters.category === cat ? 'active' : ''}`} onClick={() => updateFilter('category', cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="filter-section">
              <h4 className="filter-title">Status</h4>
              {STATUSES.map(s => (
                <button key={s} className={`filter-btn ${filters.status === s ? 'active' : ''}`} onClick={() => updateFilter('status', s)}>
                  {s === 'All' ? 'All' : s === 'available' ? 'For Sale' : 'On Auction'}
                </button>
              ))}
            </div>
            <div className="filter-section">
              <h4 className="filter-title">Sort By</h4>
              <select className="form-input" value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            <div className="filter-section">
              <h4 className="filter-title">Price Range (₹)</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="number" className="form-input" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} />
                <input type="number" className="form-input" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} />
              </div>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={resetFilters}>
              Reset Filters
            </button>
          </aside>

          {/* Grid */}
          <div className="gallery-grid-wrap">
            {loading ? (
              <div className="loading-spinner"><div className="spinner" /><p>Loading artworks...</p></div>
            ) : artworks.length > 0 ? (
              <div className="gallery-grid">
                {artworks.map(a => <ArtworkCard key={a._id} artwork={a} />)}
              </div>
            ) : (
              <div className="empty-state">
                <p style={{ fontSize: '3rem' }}>🖼️</p>
                <h3>No Artworks Found</h3>
                <p>Try adjusting your filters to discover more art.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
