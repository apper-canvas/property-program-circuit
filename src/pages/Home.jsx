import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import { propertiesService } from '../services';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    setLoading(true);
    try {
      const allProperties = await propertiesService.getAll();
      // Get first 3 properties as featured
      setFeaturedProperties(allProperties.slice(0, 3));
    } catch (error) {
      console.error('Error loading featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Find Your Perfect Home
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Discover amazing properties with our intuitive search platform. 
              Browse thousands of listings with detailed photos and information.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property type, or features..."
                className="w-full px-6 py-4 text-lg text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary pr-16"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
              >
                <ApperIcon name="Search" className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.form>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            {[
              { label: 'Browse All', path: '/browse', icon: 'Search' },
              { label: 'Map View', path: '/map', icon: 'Map' },
              { label: 'Favorites', path: '/favorites', icon: 'Heart' }
            ].map((action, index) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                <ApperIcon name={action.icon} className="w-4 h-4" />
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover hand-picked properties that offer exceptional value and unique features
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-card overflow-hidden">
                  <div className="h-64 bg-gray-200 skeleton"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-gray-200 rounded skeleton"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 skeleton"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 skeleton"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-card overflow-hidden property-card cursor-pointer"
                  onClick={() => navigate(`/property/${property.id}`)}
                >
                  <div className="relative h-64 overflow-hidden gallery-container">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 property-card-overlay" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-2xl font-bold">{formatPrice(property.price)}</div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-primary text-xl mb-2 truncate">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex items-center">
                      <ApperIcon name="MapPin" className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{property.address}, {property.city}</span>
                    </p>
                    
                    <div className="flex items-center text-sm text-gray-600 space-x-6">
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
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium text-lg"
            >
              View All Properties
            </motion.button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">
              Why Choose PropertyHub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make finding your dream property simple and enjoyable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: 'Search',
                title: 'Advanced Search',
                description: 'Filter properties by price, location, size, and features to find exactly what you need.'
              },
              {
                icon: 'Map',
                title: 'Interactive Maps',
                description: 'Explore properties on interactive maps to understand neighborhoods and locations.'
              },
              {
                icon: 'Heart',
                title: 'Save Favorites',
                description: 'Save properties you love and compare them side by side to make informed decisions.'
              },
              {
                icon: 'Images',
                title: 'High-Quality Photos',
                description: 'Browse stunning photo galleries to get a complete view of every property.'
              },
              {
                icon: 'Bookmark',
                title: 'Saved Searches',
                description: 'Create custom search alerts and get notified when new properties match your criteria.'
              },
              {
                icon: 'Smartphone',
                title: 'Mobile Optimized',
                description: 'Search for properties on any device with our responsive, mobile-friendly design.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={feature.icon} className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Find Your Dream Home?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Start exploring thousands of properties today and discover the perfect place to call home.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/browse')}
              className="px-8 py-4 bg-white text-secondary rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
            >
              Start Browsing Properties
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;