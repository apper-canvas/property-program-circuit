import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import CreateSavedSearchForm from '@/components/organisms/CreateSavedSearchForm';
import { savedSearchesService } from '@/services';

const SavedSearchesPage = () => {
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
      setSavedSearches(prev => prev.filter(search => (search.Id || search.id) !== searchId));
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
        created_at: new Date().toISOString()
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

  const runSearch = (filters) => {
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
          <Text as="h3" className="text-lg font-semibold text-primary mb-2">Error Loading Saved Searches</Text>
          <Text as="p" className="text-gray-600 mb-4">{error}</Text>
          <Button
            onClick={loadData}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Try Again
          </Button>
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
            <Text as="h1" className="text-2xl font-heading font-bold text-primary mb-1">Saved Searches</Text>
            <Text as="p" className="text-gray-600">{savedSearches.length} saved searches</Text>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            as="motion.button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>New Search</span>
          </Button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <CreateSavedSearchForm
            formData={formData}
            onFormDataChange={setFormData}
            propertyTypes={propertyTypes}
            onSubmit={handleSubmit}
            onClose={() => setShowCreateForm(false)}
          />
        )}

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
              <Text as="h3" className="text-xl font-heading font-semibold text-primary mb-2">No Saved Searches</Text>
              <Text as="p" className="text-gray-600 mb-6">
                Create custom searches to quickly find properties that match your criteria.
              </Text>
              <Button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                as="motion.button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Create Your First Search
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
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
                    <Text as="h3" className="text-lg font-heading font-semibold text-primary mb-2">
                      {search.name}
                    </Text>
                    <Text as="p" className="text-gray-600 text-sm mb-3">
                      {formatFilters(search.filters)}
                    </Text>
                    <Text as="p" className="text-gray-500 text-xs">
                      <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                      Created {formatDate(search.createdAt)}
                    </Text>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => runSearch(search.filters)}
                      className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
                      as="motion.button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name="Search" className="w-4 h-4" />
                      <span>Run Search</span>
                    </Button>

                    <Button
                      onClick={() => deleteSavedSearch(search.id, search.name)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedSearchesPage;