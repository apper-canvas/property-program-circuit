import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';
import { propertiesService, filtersService, favoritesService } from '../services';

const Browse = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceMin: '',
    priceMax: '',
    propertyTypes: [],
    bedroomsMin: '',
    bathroomsMin: '',
    squareFeetMin: '',
    location: ''
  });

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    loadData();
    loadFavorites();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertiesService.getAll();
      setProperties(result);
    } catch (err) {
      setError(err.message || 'Failed to load properties');
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const result = await favoritesService.getAll();
      setFavorites(result);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query) ||
        property.city.toLowerCase().includes(query) ||
        property.state.toLowerCase().includes(query) ||
        property.propertyType.toLowerCase().includes(query)
      );
    }

    // Price range filter
    if (filters.priceMin) {
      filtered = filtered.filter(property => property.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter(property => property.price <= Number(filters.priceMax));
    }

    // Property types filter
    if (filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property =>
        filters.propertyTypes.includes(property.propertyType)
      );
    }

    // Bedrooms filter
    if (filters.bedroomsMin) {
      filtered = filtered.filter(property => property.bedrooms >= Number(filters.bedroomsMin));
    }

    // Bathrooms filter
    if (filters.bathroomsMin) {
      filtered = filtered.filter(property => property.bathrooms >= Number(filters.bathroomsMin));
    }

    // Square feet filter
    if (filters.squareFeetMin) {
      filtered = filtered.filter(property => property.squareFeet >= Number(filters.squareFeetMin));
    }

    // Location filter
    if (filters.location.trim()) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(property =>
        property.city.toLowerCase().includes(location) ||
        property.state.toLowerCase().includes(location) ||
        property.address.toLowerCase().includes(location)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const handlePropertyTypeToggle = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter(t => t !== type)
        : [...prev.propertyTypes, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      propertyTypes: [],
      bedroomsMin: '',
      bathroomsMin: '',
      squareFeetMin: '',
      location: ''
    });
    setSearchQuery('');
  };

  const toggleFavorite = async (propertyId) => {
    try {
      const isFavorite = favorites.some(fav => fav.propertyId === propertyId);
      
      if (isFavorite) {
        const favorite = favorites.find(fav => fav.propertyId === propertyId);
        await favoritesService.delete(favorite.id);
        setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId));
        toast.success('Removed from favorites');
      } else {
        const newFavorite = {
          propertyId,
          addedAt: new Date().toISOString()
        };
        const created = await favoritesService.create(newFavorite);
        setFavorites(prev => [...prev, created]);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error('Failed to update favorites');
    }
  };

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Loft'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg shadow-card overflow-hidden"
            >
              <div className="h-48 bg-gray-200 skeleton"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 skeleton"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Error Loading Properties</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Filter Sidebar */}
      <AnimatePresence>
        {showFilters && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 bg-white border-r border-gray-200 overflow-y-auto z-30"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold text-primary">Filters</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearFilters}
                    className="text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="md:hidden text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Location
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="City, state, or address..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    placeholder="Min Price"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    placeholder="Max Price"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  />
                </div>
              </div>

              {/* Property Types */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </label>
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.propertyTypes.includes(type)}
                        onChange={() => handlePropertyTypeToggle(type)}
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Bedrooms
                </label>
                <select
                  value={filters.bedroomsMin}
                  onChange={(e) => handleFilterChange('bedroomsMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>

              {/* Bathrooms */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Bathrooms
                </label>
                <select
                  value={filters.bathroomsMin}
                  onChange={(e) => handleFilterChange('bathroomsMin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                >
                  <option value="">Any</option>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                    <option key={num} value={num}>{num}+</option>
                  ))}
                </select>
              </div>

              {/* Square Feet */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Square Feet
                </label>
                <input
                  type="number"
                  value={filters.squareFeetMin}
                  onChange={(e) => handleFilterChange('squareFeetMin', e.target.value)}
                  placeholder="Min sq ft"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Controls */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <span className="text-sm text-gray-600">
                {filteredProperties.length} properties found
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-secondary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-secondary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name="List" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        <div className="p-6">
          <MainFeature
            properties={filteredProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            viewMode={viewMode}
            onPropertyClick={(id) => navigate(`/property/${id}`)}
          />
        </div>
      </main>
    </div>
  );
};

export default Browse;