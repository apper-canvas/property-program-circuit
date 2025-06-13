import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { propertiesService, favoritesService } from '../services';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProperty();
    loadFavorites();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await propertiesService.getById(id);
      if (!result) {
        setError('Property not found');
        return;
      }
      setProperty(result);
    } catch (err) {
      setError(err.message || 'Failed to load property');
      toast.error('Failed to load property details');
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

  const toggleFavorite = async () => {
    if (!property) return;
    
    try {
      const isFavorite = favorites.some(fav => fav.propertyId === property.id);
      
      if (isFavorite) {
        const favorite = favorites.find(fav => fav.propertyId === property.id);
        await favoritesService.delete(favorite.id);
        setFavorites(prev => prev.filter(fav => fav.propertyId !== property.id));
        toast.success('Removed from favorites');
      } else {
        const newFavorite = {
          propertyId: property.id,
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

  const nextImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-gray-200 rounded-lg skeleton mb-6"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded skeleton"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 skeleton"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 skeleton"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Property Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The property you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.propertyId === property.id);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/browse')}
        className="flex items-center space-x-2 text-gray-600 hover:text-secondary mb-6 transition-colors"
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        <span>Back to Browse</span>
      </button>

      {/* Image Gallery */}
      <div className="relative mb-8">
        <div className="h-96 rounded-lg overflow-hidden gallery-container">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowGallery(true)}
          />
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
              >
                <ApperIcon name="ChevronLeft" className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
              >
                <ApperIcon name="ChevronRight" className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        
        {/* Image Thumbnails */}
        {property.images.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex ? 'border-secondary' : 'border-gray-200'
                }`}
              >
                <img
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Property Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">{property.title}</h1>
          <p className="text-gray-600 flex items-center mb-2">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
          <div className="text-2xl font-bold text-secondary">
            {formatPrice(property.price)}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFavorite}
            className={`p-3 rounded-full border-2 transition-colors ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
            }`}
          >
            <ApperIcon name="Heart" className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
          >
            Contact Agent
          </motion.button>
        </div>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="text-center p-4 bg-white rounded-lg shadow-card">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
            <ApperIcon name="Bed" className="w-6 h-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-primary">{property.bedrooms}</div>
          <div className="text-sm text-gray-600">Bedrooms</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-card">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
            <ApperIcon name="Bath" className="w-6 h-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-primary">{property.bathrooms}</div>
          <div className="text-sm text-gray-600">Bathrooms</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-card">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
            <ApperIcon name="Square" className="w-6 h-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-primary">{property.squareFeet.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Sq Ft</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-card">
          <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
            <ApperIcon name="Calendar" className="w-6 h-6 text-accent" />
          </div>
          <div className="text-2xl font-bold text-primary">{property.yearBuilt}</div>
          <div className="text-sm text-gray-600">Year Built</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: 'Info' },
              { id: 'features', label: 'Features', icon: 'List' },
              { id: 'location', label: 'Location', icon: 'MapPin' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-card p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="overview"
            >
              <h3 className="text-xl font-heading font-semibold text-primary mb-4">Property Description</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{property.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-primary mb-3">Property Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium capitalize">{property.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed:</span>
                      <span className="font-medium">{formatDate(property.listingDate)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-3">Property Size</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bedrooms:</span>
                      <span className="font-medium">{property.bedrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bathrooms:</span>
                      <span className="font-medium">{property.bathrooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Square Feet:</span>
                      <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="features"
            >
              <h3 className="text-xl font-heading font-semibold text-primary mb-4">Property Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {property.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                  >
                    <ApperIcon name="Check" className="w-4 h-4 text-success" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'location' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="location"
            >
              <h3 className="text-xl font-heading font-semibold text-primary mb-4">Location Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="MapPin" className="w-5 h-5 text-secondary mt-1" />
                  <div>
                    <div className="font-medium text-primary">Address</div>
                    <div className="text-gray-700">
                      {property.address}<br />
                      {property.city}, {property.state} {property.zipCode}
                    </div>
                  </div>
                </div>
                
                {/* Placeholder for map */}
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ApperIcon name="Map" className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive map would be displayed here</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowGallery(false)}
          >
            <button
              onClick={() => setShowGallery(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <ApperIcon name="X" className="w-8 h-8" />
            </button>
            
            <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className="max-w-full max-h-full object-contain"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                  >
                    <ApperIcon name="ChevronLeft" className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                  >
                    <ApperIcon name="ChevronRight" className="w-6 h-6" />
                  </button>
                </>
              )}
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                {currentImageIndex + 1} of {property.images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetails;