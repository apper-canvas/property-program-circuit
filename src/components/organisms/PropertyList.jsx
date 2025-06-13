import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import PropertyCard from '@/components/molecules/PropertyCard';

const PropertyList = ({
  properties,
  favorites,
  onToggleFavorite,
  onPropertyClick,
  viewMode = 'grid', // 'grid' or 'list'
  showPropertyTypeBadge = true,
  showRemoveButton = false, // For favorites page
  formatPrice,
  formatDate, // For favorites page 'addedAt'
}) => {
  if (properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-6"
          >
            <ApperIcon name="Search" className="w-16 h-16 text-gray-300 mx-auto" />
          </motion.div>
          <Text as="h3" className="text-xl font-heading font-semibold text-primary mb-2">No Properties Found</Text>
          <Text className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more properties.
          </Text>
          <Button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            as="motion.button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset Search
          </Button>
        </motion.div>
      </div>
    );
  }

  const commonProps = {
    favorites,
    onToggleFavorite,
    onViewDetails: onPropertyClick,
    showPropertyTypeBadge,
    formatPrice,
    formatDate,
  };

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <AnimatePresence>
{properties.map((property, index) => {
            const isFavorite = favorites.some(fav => (fav.property_id || fav.propertyId) === (property.Id || property.id));
            return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-card overflow-hidden property-card"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-80 h-48 md:h-auto overflow-hidden gallery-container">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => onPropertyClick(property.id)}
                    />
                    <div className="absolute inset-0 property-card-overlay md:opacity-50" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <Text as="div" className="text-xl font-bold">{formatPrice(property.price)}</Text>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Text
                          as="h3"
                          className="font-semibold text-primary text-xl mb-2 cursor-pointer hover:text-secondary transition-colors"
                          onClick={() => onPropertyClick(property.id)}
                        >
                          {property.title}
                        </Text>
                        <Text className="text-gray-600 mb-3 flex items-center">
                          <ApperIcon name="MapPin" className="w-4 h-4 mr-2 flex-shrink-0" />
                          {property.address}, {property.city}, {property.state}
                        </Text>

                        <div className="flex items-center text-sm text-gray-600 mb-4 space-x-6">
                          <span className="flex items-center">
                            <ApperIcon name="Bed" className="w-4 h-4 mr-1" />
                            {property.bedrooms} beds
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Bath" className="w-4 h-4 mr-1" />
                            {property.bathrooms} baths
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Square" className="w-4 h-4 mr-1" />
                            {property.squareFeet.toLocaleString()} ft²
                          </span>
                          <span className="flex items-center">
                            <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                            {property.yearBuilt}
                          </span>
                        </div>

                        <Text className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {property.description}
                        </Text>
                      </div>

<Button
                        onClick={() => onToggleFavorite(property.Id || property.id)}
                        className={`ml-4 p-3 rounded-full border-2 transition-colors ${
                          isFavorite
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
                        }`}
                        as="motion.button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ApperIcon name="Heart" className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={() => onPropertyClick(property.id)}
                        className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                        as="motion.button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </Button>
                      <Button
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        as="motion.button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Contact Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {properties.map((property, index) => (
<PropertyCard
            key={property.Id || property.id}
            property={property}
            isFavorite={favorites.some((fav) => (fav.property_id || fav.propertyId) === (property.Id || property.id))}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onPropertyClick}
            showPropertyTypeBadge={showPropertyTypeBadge}
            showRemoveButton={showRemoveButton}
            formatPrice={formatPrice}
            formatDate={formatDate}
            motionProps={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, scale: 0.9 },
              transition: { delay: index * 0.05 },
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default PropertyList;