import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import PropertyFilterSidebar from '@/components/organisms/PropertyFilterSidebar';
import PropertyList from '@/components/organisms/PropertyList';
import { propertiesService, favoritesService } from '@/services';

const BrowsePage = () => {
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
  const [searchParams] = useSearchParams(); // Use for initial search query from URL

  useEffect(() => {
    const urlSearchQuery = searchParams.get('search');
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery);
    }
  }, [searchParams]);

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

    // Search query filter (combining with location filter)
    const currentSearchQuery = searchQuery.trim().toLowerCase();
    if (currentSearchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(currentSearchQuery) ||
        property.address.toLowerCase().includes(currentSearchQuery) ||
        property.city.toLowerCase().includes(currentSearchQuery) ||
        property.state.toLowerCase().includes(currentSearchQuery) ||
        property.propertyType.toLowerCase().includes(currentSearchQuery)
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

    // Location filter (if separate from general search query)
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
          <Text as="h3" className="text-lg font-semibold text-primary mb-2">Error Loading Properties</Text>
          <Text as="p" className="text-gray-600 mb-4">{error}</Text>
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Filter Sidebar */}
      <PropertyFilterSidebar
        showFilters={showFilters}
        filters={filters}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        propertyTypes={propertyTypes}
        onPropertyTypeToggle={handlePropertyTypeToggle}
        onClearFilters={clearFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header Controls */}
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              <Text as="span" className="text-sm text-gray-600">
                {filteredProperties.length} properties found
              </Text>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-secondary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name="Grid3X3" className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-secondary text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ApperIcon name="List" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        <div className="p-6">
          <PropertyList
            properties={filteredProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            viewMode={viewMode}
            onPropertyClick={(id) => navigate(`/property/${id}`)}
            formatPrice={formatPrice}
          />
        </div>
      </main>
    </div>
  );
};

export default BrowsePage;