import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const MapPropertyPopup = ({ property, isFavorite, onToggleFavorite, onViewDetails, onClose, formatPrice }) => {
  if (!property) return null;

  const displayPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price);

  return (
    <div className="absolute bottom-4 left-4 right-4 z-30 max-w-sm mx-auto">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <Button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </Button>

        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 property-card-overlay" />
          <div className="absolute bottom-3 left-3 text-white">
            <Text as="div" className="text-xl font-bold">{displayPrice}</Text>
          </div>
        </div>

        <div className="p-4">
          <Text as="h3" className="font-semibold text-primary text-lg mb-1 truncate">
            {property.title}
          </Text>
          <Text className="text-gray-600 text-sm mb-3 flex items-center">
            <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </Text>

          <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
            <span className="flex items-center">
              <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
              {property.bedrooms} bed
            </span>
            <span className="flex items-center">
              <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
              {property.bathrooms} bath
            </span>
            <span className="flex items-center">
              <ApperIcon name="Square" className="w-4 h-4 mr-1" />
              {property.squareFeet.toLocaleString()} ft²
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-2 rounded-full border transition-colors ${
                isFavorite
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
              }`}
              as="motion.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon
                name="Heart"
                className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`}
              />
            </Button>

            <Button
              onClick={() => onViewDetails(property.id)}
              className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium text-sm"
              as="motion.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Details
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MapPropertyPopup;