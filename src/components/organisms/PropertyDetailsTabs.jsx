import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const PropertyDetailsTabs = ({ property, activeTab, onTabChange, formatDate }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'features', label: 'Features', icon: 'List' },
    { id: 'location', label: 'Location', icon: 'MapPin' }
  ];

  return (
    <>
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </Button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-card p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="overview"
            >
              <Text as="h3" className="text-xl font-heading font-semibold text-primary mb-4">Property Description</Text>
              <Text className="text-gray-700 leading-relaxed mb-6">{property.description}</Text>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Text as="h4" className="font-semibold text-primary mb-3">Property Details</Text>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text as="span" className="text-gray-600">Property Type:</Text>
                      <Text as="span" className="font-medium">{property.propertyType}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text as="span" className="text-gray-600">Status:</Text>
                      <Text as="span" className="font-medium capitalize">{property.status}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text as="span" className="text-gray-600">Listed:</Text>
                      <Text as="span" className="font-medium">{formatDate(property.listingDate)}</Text>
                    </div>
                  </div>
                </div>
                <div>
                  <Text as="h4" className="font-semibold text-primary mb-3">Property Size</Text>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text as="span" className="text-gray-600">Bedrooms:</Text>
                      <Text as="span" className="font-medium">{property.bedrooms}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text as="span" className="text-gray-600">Bathrooms:</Text>
                      <Text as="span" className="font-medium">{property.bathrooms}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text as="span" className="text-gray-600">Square Feet:</Text>
                      <Text as="span" className="font-medium">{property.squareFeet.toLocaleString()}</Text>
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
              <Text as="h3" className="text-xl font-heading font-semibold text-primary mb-4">Property Features</Text>
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
                    <Text as="span" className="text-gray-700">{feature}</Text>
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
              <Text as="h3" className="text-xl font-heading font-semibold text-primary mb-4">Location Information</Text>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <ApperIcon name="MapPin" className="w-5 h-5 text-secondary mt-1" />
                  <div>
                    <Text as="div" className="font-medium text-primary">Address</Text>
                    <Text as="div" className="text-gray-700">
                      {property.address}<br />
                      {property.city}, {property.state} {property.zipCode}
                    </Text>
                  </div>
                </div>

                {/* Placeholder for map */}
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <ApperIcon name="Map" className="w-12 h-12 mx-auto mb-2" />
                    <Text as="p">Interactive map would be displayed here</Text>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PropertyDetailsTabs;