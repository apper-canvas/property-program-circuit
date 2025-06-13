import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import FormField from '@/components/molecules/FormField';

const CreateSavedSearchForm = ({ formData, onFormDataChange, propertyTypes, onSubmit, onClose }) => {
  const handleFilterChange = (filterName, value) => {
    onFormDataChange(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterName]: value
      }
    }));
  };

  const handlePropertyTypeToggle = (type) => {
    onFormDataChange(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        propertyTypes: prev.filters.propertyTypes.includes(type)
          ? prev.filters.propertyTypes.filter(t => t !== type)
          : [...prev.filters.propertyTypes, type]
      }
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <form onSubmit={onSubmit} className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Text as="h2" className="text-xl font-heading font-semibold text-primary">Create Saved Search</Text>
              <Button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="w-6 h-6" />
              </Button>
            </div>

            {/* Search Name */}
            <FormField
              label="Search Name"
              type="text"
              value={formData.name}
              onChange={(e) => onFormDataChange(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Downtown Condos Under $500K"
              className="mb-6"
              required
            />

            {/* Search Criteria */}
            <div className="space-y-6">
              {/* Location */}
              <FormField
                label="Location"
                type="text"
                value={formData.filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="City, state, or address..."
              />

              {/* Price Range */}
              <div>
                <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </Text>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    type="number"
                    value={formData.filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    placeholder="Min Price"
                    label=""
                  />
                  <FormField
                    type="number"
                    value={formData.filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    placeholder="Max Price"
                    label=""
                  />
                </div>
              </div>

              {/* Property Types */}
              <div>
                <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type
                </Text>
                <div className="space-y-2">
                  {propertyTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.filters.propertyTypes.includes(type)}
                        onChange={() => handlePropertyTypeToggle(type)}
                        className="rounded border-gray-300 text-accent focus:ring-accent"
                      />
                      <Text as="span" className="ml-2 text-sm text-gray-700">{type}</Text>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bedrooms and Bathrooms */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Bedrooms
                  </Text>
                  <select
                    value={formData.filters.bedroomsMin}
                    onChange={(e) => handleFilterChange('bedroomsMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  >
                    <option value="">Any</option>
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                    Min Bathrooms
                  </Text>
                  <select
                    value={formData.filters.bathroomsMin}
                    onChange={(e) => handleFilterChange('bathroomsMin', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                  >
                    <option value="">Any</option>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Square Feet */}
              <FormField
                label="Minimum Square Feet"
                type="number"
                value={formData.filters.squareFeetMin}
                onChange={(e) => handleFilterChange('squareFeetMin', e.target.value)}
                placeholder="Min sq ft"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                as="motion.button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Save Search
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CreateSavedSearchForm;