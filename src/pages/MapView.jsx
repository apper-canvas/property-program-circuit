import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import { propertiesService, favoritesService } from '../services';

const MapView = () => {
  const [properties, setProperties] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // NYC default
  
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    loadFavorites();
  }, []);

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
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="h-full bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="Map" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Error Loading Map</h3>
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
    <div className="h-full relative">
      {/* Map Container */}
      <div className="h-full bg-gradient-to-br from-blue-100 to-green-100 relative overflow-hidden">
        {/* Simulated Map Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(90deg, #e5e7eb 1px, transparent 1px),
              linear-gradient(#e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-30 space-y-2">
          <div className="bg-white rounded-lg shadow-lg p-2">
            <button className="block w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors">
              <ApperIcon name="Plus" className="w-4 h-4 mx-auto" />
            </button>
            <button className="block w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors mt-1">
              <ApperIcon name="Minus" className="w-4 h-4 mx-auto" />
            </button>
          </div>
          <button className="block w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-lg text-gray-600 hover:text-gray-800 transition-colors">
            <ApperIcon name="Locate" className="w-4 h-4 mx-auto" />
          </button>
        </div>

        {/* Property Markers */}
        {properties.map((property, index) => {
          const isFavorite = favorites.some(fav => fav.propertyId === property.id);
          
          // Simulate random positions based on property index
          const x = 100 + (index * 150) % (window.innerWidth - 300);
          const y = 100 + (index * 120) % (window.innerHeight - 300);
          
          return (
            <motion.div
              key={property.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute z-20"
              style={{ left: x, top: y }}
            >
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedProperty(property)}
                  className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg hover:bg-secondary/90 transition-colors border-2 border-white"
                >
                  {formatPrice(property.price)}
                </motion.button>
                
                {/* Marker Pin */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-secondary" />
              </div>
            </motion.div>
          );
        })}

        {/* Property Details Popup */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 z-30 max-w-sm mx-auto">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden"
            >
              <button
                onClick={() => setSelectedProperty(null)}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </button>
              
              <div className="relative h-48 overflow-hidden">
                <img
                  src={selectedProperty.images[0]}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 property-card-overlay" />
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(selectedProperty.price)}
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-primary text-lg mb-1 truncate">
                  {selectedProperty.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{selectedProperty.address}, {selectedProperty.city}</span>
                </p>
                
                <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
                  <span className="flex items-center">
                    <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                    {selectedProperty.bedrooms} bed
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                    {selectedProperty.bathrooms} bath
                  </span>
                  <span className="flex items-center">
                    <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                    {selectedProperty.squareFeet.toLocaleString()} ft²
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFavorite(selectedProperty.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      favorites.some(fav => fav.propertyId === selectedProperty.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
                    }`}
                  >
                    <ApperIcon 
                      name="Heart" 
                      className={`w-4 h-4 ${favorites.some(fav => fav.propertyId === selectedProperty.id) ? 'fill-current' : ''}`} 
                    />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/property/${selectedProperty.id}`)}
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium text-sm"
                  >
                    View Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute top-4 left-4 z-30">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <h3 className="font-semibold text-primary text-sm mb-2">Legend</h3>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-secondary rounded-full"></div>
              <span className="text-xs text-gray-600">Available Properties</span>
            </div>
          </div>
        </div>

        {/* Properties Count */}
        <div className="absolute bottom-4 right-4 z-30">
          <div className="bg-white rounded-lg shadow-lg px-3 py-2">
            <span className="text-sm font-medium text-primary">
              {properties.length} properties shown
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;