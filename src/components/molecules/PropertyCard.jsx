import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const PropertyCard = ({
  property,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  showPropertyTypeBadge = true,
  showRemoveButton = false, // For favorites page remove
  formatPrice,
  formatDate, // For favorites page addedAt
  motionProps,
}) => {
  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    onToggleFavorite(property.id, property.title, property.favoriteId);
  };

  const handleViewDetails = () => {
    onViewDetails(property.id);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-card overflow-hidden property-card"
      {...motionProps}
    >
      <div className="relative h-48 overflow-hidden gallery-container">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={handleViewDetails}
        />
        <div className="absolute inset-0 property-card-overlay" />

        {showRemoveButton ? (
          <Button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-red-600 hover:text-red-700 transition-colors"
            as="motion.button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="X" className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleToggleFavorite}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isFavorite
                ? 'bg-red-500 text-white'
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            as="motion.button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="Heart" className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        )}

        <div className="absolute bottom-3 left-3 text-white">
          <Text as="div" className="text-xl font-bold">{formatPrice(property.price)}</Text>
        </div>

        {showPropertyTypeBadge && (
          <div className="absolute top-3 left-3 bg-secondary text-white text-xs px-2 py-1 rounded">
            {property.propertyType}
          </div>
        )}

        {formatDate && property.addedAt && (
          <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Added {formatDate(property.addedAt)}
          </div>
        )}
      </div>

      <div className="p-4">
        <Text
          as="h3"
          className="font-semibold text-primary text-lg mb-1 cursor-pointer hover:text-secondary transition-colors truncate"
          onClick={handleViewDetails}
        >
          {property.title}
        </Text>
        <Text className="text-gray-600 text-sm mb-3 flex items-center">
          <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{property.address}, {property.city}</span>
        </Text>

        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
          <span className="flex items-center">
            <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
            {property.bedrooms}
          </span>
          <span className="flex items-center">
            <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
            {property.bathrooms}
          </span>
          <span className="flex items-center">
            <ApperIcon name="Square" className="w-4 h-4 mr-1" />
            {property.squareFeet.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={handleViewDetails}
            className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            as="motion.button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </Button>
          {/* Keep contact button on browse page, remove from favorites page */}
          {!showRemoveButton && (
            <Button
              className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              as="motion.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Phone" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;