import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import { savedSearchesService } from '../services';

const SavedSearches = () => {
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    filters: {
      priceMin: '',
      priceMax: '',
      propertyTypes: [],
      bedroomsMin: '',
      bathroomsMin: '',
      squareFeetMin: '',
      location: ''
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await savedSearchesService.getAll();
      setSavedSearches(result);
    } catch (err) {
      setError(err.message || 'Failed to load saved searches');
      toast.error('Failed to load saved searches');
    } finally {
      setLoading(false);
    }
  };

  const deleteSavedSearch = async (searchId, searchName) => {
    if (!window.confirm(`Are you sure you want to delete "${searchName}"?`)) return;
    
    try {
      await savedSearchesService.delete(searchId);
      setSavedSearches(prev => prev.filter(search => search.id !== searchId));
      toast.success(`Deleted "${searchName}"`);
    } catch (err) {
      toast.error('Failed to delete saved search');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a name for your search');
      return;
    }

    try {
      const newSearch = {
        name: formData.name.trim(),
        filters: formData.filters,
        createdAt: new Date().toISOString()
      };
      
      const created = await savedSearchesService.create(newSearch);
      setSavedSearches(prev => [created, ...prev]);
      setShowCreateForm(false);
      setFormData({
        name: '',
        filters: {
          priceMin: '',
          priceMax: '',
          propertyTypes: [],
          bedroomsMin: '',
          bathroomsMin: '',
          squareFeetMin: '',
          location: ''
        }
      });
      toast.success('Saved search created successfully');
    } catch (err) {
      toast.error('Failed to create saved search');
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterName]: value
      }
    }));
  };

  const handlePropertyTypeToggle = (type) => {
    setFormData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        propertyTypes: prev.filters.propertyTypes.includes(type)
          ? prev.filters.propertyTypes.filter(t => t !== type)
          : [...prev.filters.propertyTypes, type]
      }
    }));
  };

  const runSearch = (filters) => {
    // Convert filters to URL search params and navigate to browse page
    const searchParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          searchParams.set(key, value.join(','));
        } else {
          searchParams.set(key, value.toString());
        }
      }
    });
    
    navigate(`/browse?${searchParams.toString()}`);
  };

  const formatFilters = (filters) => {
    const parts = [];
    
    if (filters.location) parts.push(`Location: ${filters.location}`);
    if (filters.priceMin || filters.priceMax) {
      const priceRange = [
        filters.priceMin ? `$${Number(filters.priceMin).toLocaleString()}` : '',
        filters.priceMax ? `$${Number(filters.priceMax).toLocaleString()}` : ''
      ].filter(Boolean).join(' - ') || 'Any price';
      parts.push(`Price: ${priceRange}`);
    }
    if (filters.propertyTypes.length > 0) {
      parts.push(`Type: ${filters.propertyTypes.join(', ')}`);
    }
    if (filters.bedroomsMin) parts.push(`${filters.bedroomsMin}+ beds`);
    if (filters.bathroomsMin) parts.push(`${filters.bathroomsMin}+ baths`);
    if (filters.squareFeetMin) parts.push(`${Number(filters.squareFeetMin).toLocaleString()}+ sq ft`);
    
    return parts.length > 0 ? parts.join(' • ') : 'No filters applied';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Loft'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6 skeleton"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-lg shadow-card p-6"
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-3 skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2 skeleton"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 skeleton"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Error Loading Saved Searches</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-primary mb-1">Saved Searches</h1>
            <p className="text-gray-600">{savedSearches.length} saved searches</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Search</span>
          </motion.button>
        </div>

        {/* Create Form Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => setShowCreateForm(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-heading font-semibold text-primary">Create Saved Search</h2>
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ApperIcon name="X" className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Search Name */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Downtown Condos Under $500K"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                        required
                      />
                    </div>

                    {/* Search Criteria */}
                    <div className="space-y-6">
                      {/* Location */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.filters.location}
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                          placeholder="City, state, or address..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                        />
                      </div>

                      {/* Price Range */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Range
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="number"
                            value={formData.filters.priceMin}
                            onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                            placeholder="Min Price"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                          />
                          <input
                            type="number"
                            value={formData.filters.priceMax}
                            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                            placeholder="Max Price"
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                          />
                        </div>
                      </div>

                      {/* Property Types */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Property Type
                        </label>
                        <div className="space-y-2">
                          {propertyTypes.map(type => (
                            <label key={type} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.filters.propertyTypes.includes(type)}
                                onChange={() => handlePropertyTypeToggle(type)}
                                className="rounded border-gray-300 text-accent focus:ring-accent"
                              />
                              <span className="ml-2 text-sm text-gray-700">{type}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Bedrooms and Bathrooms */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Bedrooms
                          </label>
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
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Min Bathrooms
                          </label>
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
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Square Feet
                        </label>
                        <input
                          type="number"
                          value={formData.filters.squareFeetMin}
                          onChange={(e) => handleFilterChange('squareFeetMin', e.target.value)}
                          placeholder="Min sq ft"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowCreateForm(false)}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                      >
                        Save Search
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Saved Searches List */}
        {savedSearches.length === 0 ? (
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
              <h3 className="text-xl font-heading font-semibold text-primary mb-2">No Saved Searches</h3>
              <p className="text-gray-600 mb-6">
                Create custom searches to quickly find properties that match your criteria.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
              >
                Create Your First Search
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {savedSearches.map((search, index) => (
                <motion.div
                  key={search.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-heading font-semibold text-primary mb-2">
                        {search.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {formatFilters(search.filters)}
                      </p>
                      <p className="text-gray-500 text-xs">
                        <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                        Created {formatDate(search.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => runSearch(search.filters)}
                        className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                      >
                        <ApperIcon name="Search" className="w-4 h-4" />
                        <span>Run Search</span>
                      </motion.button>
                      
                      <button
                        onClick={() => deleteSavedSearch(search.id, search.name)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearches;