import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import FormField from '@/components/molecules/FormField';

const PropertyFilterSidebar = ({
  showFilters,
  filters,
  onFilterChange,
  searchQuery,
  onSearchQueryChange,
  propertyTypes,
  onPropertyTypeToggle,
  onClearFilters,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.aside
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white border-r border-gray-200 overflow-y-auto z-30"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Text as="h2" className="text-lg font-heading font-semibold text-primary">Filters</Text>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={onClearFilters}
                  className="text-sm text-accent hover:text-accent/80 transition-colors"
                >
                  Clear All
                </Button>
                <Button
                  onClick={onClose}
                  className="md:hidden text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <FormField
              label="Search Location"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="City, state, or address..."
              className="mb-6"
            />

            {/* Price Range */}
            <div className="mb-6">
              <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </Text>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => onFilterChange('priceMin', e.target.value)}
                  placeholder="Min Price"
                />
                <Input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => onFilterChange('priceMax', e.target.value)}
                  placeholder="Max Price"
                />
              </div>
            </div>

            {/* Property Types */}
            <div className="mb-6">
              <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </Text>
              <div className="space-y-2">
                {propertyTypes.map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.propertyTypes.includes(type)}
                      onChange={() => onPropertyTypeToggle(type)}
                      className="rounded border-gray-300 text-accent focus:ring-accent"
                    />
                    <Text as="span" className="ml-2 text-sm text-gray-700">{type}</Text>
                  </label>
                ))}
              </div>
            </div>

            {/* Bedrooms */}
            <div className="mb-6">
              <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Bedrooms
              </Text>
              <select
                value={filters.bedroomsMin}
                onChange={(e) => onFilterChange('bedroomsMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div className="mb-6">
              <Text as="label" className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Bathrooms
              </Text>
              <select
                value={filters.bathroomsMin}
                onChange={(e) => onFilterChange('bathroomsMin', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="">Any</option>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>

            {/* Square Feet */}
            <FormField
              label="Minimum Square Feet"
              type="number"
              value={filters.squareFeetMin}
              onChange={(e) => onFilterChange('squareFeetMin', e.target.value)}
              placeholder="Min sq ft"
              className="mb-6"
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default PropertyFilterSidebar;