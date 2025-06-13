import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const MainFeature = ({ 
  properties, 
  favorites, 
  onToggleFavorite, 
  viewMode, 
  onPropertyClick 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

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
          <h3 className="text-xl font-heading font-semibold text-primary mb-2">No Properties Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search criteria or filters to find more properties.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
          >
            Reset Search
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <AnimatePresence>
          {properties.map((property, index) => {
            const isFavorite = favorites.some(fav => fav.propertyId === property.id);
            
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
                      <div className="text-xl font-bold">{formatPrice(property.price)}</div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold text-primary text-xl mb-2 cursor-pointer hover:text-secondary transition-colors"
                          onClick={() => onPropertyClick(property.id)}
                        >
                          {property.title}
                        </h3>
                        <p className="text-gray-600 mb-3 flex items-center">
                          <ApperIcon name="MapPin" className="w-4 h-4 mr-2 flex-shrink-0" />
                          {property.address}, {property.city}, {property.state}
                        </p>
                        
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
                        
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                          {property.description}
                        </p>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onToggleFavorite(property.id)}
                        className={`ml-4 p-3 rounded-full border-2 transition-colors ${
                          isFavorite
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-white border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200'
                        }`}
                      >
                        <ApperIcon name="Heart" className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                      </motion.button>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onPropertyClick(property.id)}
                        className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                      >
                        View Details
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        Contact Agent
                      </motion.button>
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
        {properties.map((property, index) => {
          const isFavorite = favorites.some(fav => fav.propertyId === property.id);
          
          return (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-card overflow-hidden property-card"
            >
              <div className="relative h-48 overflow-hidden gallery-container">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => onPropertyClick(property.id)}
                />
                <div className="absolute inset-0 property-card-overlay" />
                
                {/* Favorite Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggleFavorite(property.id)}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isFavorite
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                  }`}
                >
                  <ApperIcon name="Heart" className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </motion.button>
                
                {/* Price tag */}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="text-xl font-bold">{formatPrice(property.price)}</div>
                </div>
                
                {/* Property type badge */}
                <div className="absolute top-3 left-3 bg-secondary text-white text-xs px-2 py-1 rounded">
                  {property.propertyType}
                </div>
              </div>
              
              <div className="p-4">
                <h3 
                  className="font-semibold text-primary text-lg mb-1 cursor-pointer hover:text-secondary transition-colors truncate"
                  onClick={() => onPropertyClick(property.id)}
                >
                  {property.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <ApperIcon name="MapPin" className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.address}, {property.city}</span>
                </p>
                
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPropertyClick(property.id)}
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ApperIcon name="Phone" className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;