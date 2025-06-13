import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import PropertyList from '@/components/organisms/PropertyList';
import { favoritesService, propertiesService } from '@/services';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, price-high, price-low

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [favoritesResult, propertiesResult] = await Promise.all([
        favoritesService.getAll(),
        propertiesService.getAll()
      ]);
      setFavorites(favoritesResult);
      setProperties(propertiesResult);
    } catch (err) {
      setError(err.message || 'Failed to load favorites');
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };
const removeFavorite = async (propertyId, propertyTitle, favoriteIdToRemove) => {
    try {
      await favoritesService.delete(favoriteIdToRemove);
      setFavorites(prev => prev.filter(fav => (fav.Id || fav.id) !== favoriteIdToRemove));
      toast.success(`Removed "${propertyTitle}" from favorites`);
    } catch (err) {
      toast.error('Failed to remove from favorites');
    }
  };

const clearAllFavorites = async () => {
    if (!window.confirm('Are you sure you want to remove all favorites?')) return;

    try {
      await Promise.all(favorites.map(fav => favoritesService.delete(fav.Id || fav.id)));
      setFavorites([]);
      toast.success('All favorites cleared');
    } catch (err) {
      toast.error('Failed to clear favorites');
    }
  };
const getFavoriteProperties = () => {
    const favoriteProperties = favorites
      .map(fav => {
        const property = properties.find(p => (p.Id || p.id) === (fav.property_id || fav.propertyId));
        return property ? { 
          ...property, 
          addedAt: fav.added_at || fav.addedAt, 
          favoriteId: fav.Id || fav.id 
        } : null;
      })
      .filter(Boolean);

    return favoriteProperties.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'oldest':
          return new Date(a.addedAt) - new Date(b.addedAt);
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        default:
          return 0;
      }
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 skeleton"></div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <Text as="h3" className="text-lg font-semibold text-primary mb-2">Error Loading Favorites</Text>
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

  const favoriteProperties = getFavoriteProperties();

  if (favoriteProperties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-6"
          >
            <ApperIcon name="Heart" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <Text as="h3" className="text-xl font-heading font-semibold text-primary mb-2">No Favorites Yet</Text>
          <Text as="p" className="text-gray-600 mb-6">
            Start exploring properties and save your favorites to see them here.
          </Text>
          <Button
            onClick={() => navigate('/browse')}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            as="motion.button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Browse Properties
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Text as="h1" className="text-2xl font-heading font-bold text-primary mb-1">My Favorites</Text>
            <Text as="p" className="text-gray-600">{favoriteProperties.length} saved properties</Text>
          </div>
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>

            {/* Clear All Button */}
            <Button
              onClick={clearAllFavorites}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
              <span>Clear All</span>
            </Button>
          </div>
        </div>

        {/* Favorites Grid */}
        <PropertyList
          properties={favoriteProperties}
          favorites={favorites}
          onToggleFavorite={removeFavorite} // Use removeFavorite specifically
          onPropertyClick={(id) => navigate(`/property/${id}`)}
          viewMode="grid" // Ensure grid view
          showPropertyTypeBadge={false} // Don't need type badge
          showRemoveButton={true} // Show 'X' remove button
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      </div>
    </div>
  );
};

export default FavoritesPage;