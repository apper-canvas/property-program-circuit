import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import PropertyDetailsTabs from '@/components/organisms/PropertyDetailsTabs';
import PropertyStats from '@/components/organisms/PropertyStats';
import ImageGalleryModal from '@/components/organisms/ImageGalleryModal';
import { propertiesService, favoritesService } from '@/services';

const PropertyDetailsPage = () => {
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

  const handleImageChange = (direction) => {
    if (property && property.images.length > 0) {
      setCurrentImageIndex((prev) => {
        if (direction === 'next') {
          return prev === property.images.length - 1 ? 0 : prev + 1;
        } else {
          return prev === 0 ? property.images.length - 1 : prev - 1;
        }
      });
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
          <Text as="h3" className="text-lg font-semibold text-primary mb-2">Property Not Found</Text>
          <Text as="p" className="text-gray-600 mb-4">{error || 'The property you\'re looking for doesn\'t exist.'}</Text>
          <Button
            onClick={() => navigate('/browse')}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(fav => fav.propertyId === property.id);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Back Button */}
      <Button
        onClick={() => navigate('/browse')}
        className="flex items-center space-x-2 text-gray-600 hover:text-secondary mb-6 transition-colors"
      >
        <ApperIcon name="ArrowLeft" className="w-4 h-4" />
        <span>Back to Browse</span>
      </Button>

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
              <Button
                onClick={() => handleImageChange('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
              >
                <ApperIcon name="ChevronLeft" className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => handleImageChange('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 shadow-lg transition-colors"
              >
                <ApperIcon name="ChevronRight" className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Image Thumbnails */}
        {property.images.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto">
            {property.images.map((image, index) => (
              <Button
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
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Property Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Text as="h1" className="text-3xl font-heading font-bold text-primary mb-2">{property.title}</Text>
          <Text className="text-gray-600 flex items-center mb-2">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </Text>
          <Text as="div" className="text-2xl font-bold text-secondary">
            {formatPrice(property.price)}
          </Text>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={toggleFavorite}
            className={`p-3 rounded-full border-2 transition-colors ${
              isFavorite
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
            }`}
            as="motion.button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Heart" className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
          <Button
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            as="motion.button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Agent
          </Button>
        </div>
      </div>

      {/* Property Stats */}
      <PropertyStats property={property} />

      {/* Tabs */}
      <PropertyDetailsTabs
        property={property}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        formatDate={formatDate}
      />

      {/* Fullscreen Gallery Modal */}
      {showGallery && (
        <ImageGalleryModal
          images={property.images}
          currentImageIndex={currentImageIndex}
          onImageChange={handleImageChange}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetailsPage;