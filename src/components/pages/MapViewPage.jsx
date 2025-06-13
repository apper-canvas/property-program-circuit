import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import MapControls from '@/components/organisms/MapControls';
import PropertyMarker from '@/components/organisms/PropertyMarker';
import MapPropertyPopup from '@/components/organisms/MapPropertyPopup';
import { propertiesService, favoritesService } from '@/services';

const MapViewPage = () => {
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
      const isFavorite = favorites.some(fav => (fav.property_id || fav.propertyId) === propertyId);

      if (isFavorite) {
        const favorite = favorites.find(fav => (fav.property_id || fav.propertyId) === propertyId);
        await favoritesService.delete(favorite.Id || favorite.id);
        setFavorites(prev => prev.filter(fav => (fav.property_id || fav.propertyId) !== propertyId));
        toast.success('Removed from favorites');
      } else {
        const newFavorite = {
          property_id: propertyId,
          added_at: new Date().toISOString()
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
          <Text as="p" className="text-gray-500">Loading map...</Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <Text as="h3" className="text-lg font-semibold text-primary mb-2">Error Loading Map</Text>
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
        <MapControls
          onZoomIn={() => console.log('Zoom In')}
          onZoomOut={() => console.log('Zoom Out')}
          onLocate={() => console.log('Locate Me')}
        />

        {/* Property Markers */}
        {properties.map((property, index) => (
          <PropertyMarker
            key={property.id}
            property={property}
            onClick={setSelectedProperty}
            formatPrice={formatPrice}
            index={index}
          />
        ))}

        {/* Property Details Popup */}
        <MapPropertyPopup
          property={selectedProperty}
          isFavorite={selectedProperty ? favorites.some(fav => fav.propertyId === selectedProperty.id) : false}
          onToggleFavorite={toggleFavorite}
          onViewDetails={(id) => navigate(`/property/${id}`)}
          onClose={() => setSelectedProperty(null)}
          formatPrice={formatPrice}
        />

        {/* Map Legend */}
        <div className="absolute top-4 left-4 z-30">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <Text as="h3" className="font-semibold text-primary text-sm mb-2">Legend</Text>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-secondary rounded-full"></div>
              <Text as="span" className="text-xs text-gray-600">Available Properties</Text>
            </div>
          </div>
        </div>

        {/* Properties Count */}
        <div className="absolute bottom-4 right-4 z-30">
          <div className="bg-white rounded-lg shadow-lg px-3 py-2">
            <Text as="span" className="text-sm font-medium text-primary">
              {properties.length} properties shown
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewPage;