import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import FeatureCard from '@/components/molecules/FeatureCard';
import PropertyCard from '@/components/molecules/PropertyCard';
import { propertiesService } from '@/services';

const HomePage = () => {
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

  const handlePropertyClick = (id) => {
    navigate(`/property/${id}`);
  };

  const handleToggleFavorite = (propertyId) => {
    // Favorites functionality is in the Favorites page and Browse page
    // This Home page only displays properties.
    // For a real app, this would likely interact with a global state or a favorite service.
    console.log(`Toggling favorite for property ${propertyId} - Not implemented on Home page`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Text
            as="motion.div"
            motionProps={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } }}
          >
            <Text as="h1" className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Find Your Perfect Home
            </Text>
            <Text as="p" className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Discover amazing properties with our intuitive search platform.
              Browse thousands of listings with detailed photos and information.
            </Text>
          </Text>

          {/* Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property type, or features..."
                className="w-full px-6 py-4 text-lg text-gray-900 bg-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary pr-16"
              />
              <Button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
                as="motion.button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name="Search" className="w-5 h-5" />
              </Button>
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
              <Button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                as="motion.button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name={action.icon} className="w-4 h-4" />
                <span>{action.label}</span>
              </Button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Text as="h2" className="text-3xl font-heading font-bold text-primary mb-4">
              Featured Properties
            </Text>
            <Text as="p" className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover hand-picked properties that offer exceptional value and unique features
            </Text>
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
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={false} // Featured properties on home page are not necessarily favorited
                  onToggleFavorite={handleToggleFavorite} // Placeholder, not active on home
                  onViewDetails={handlePropertyClick}
                  showPropertyTypeBadge={true}
                  showRemoveButton={false}
                  formatPrice={formatPrice}
                  motionProps={{
                    initial: { opacity: 0, y: 30 },
                    animate: { opacity: 1, y: 0 },
                    transition: { duration: 0.6, delay: index * 0.1 },
                  }}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/browse')}
              className="px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium text-lg"
              as="motion.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Properties
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Text as="h2" className="text-3xl font-heading font-bold text-primary mb-4">
              Why Choose PropertyHub?
            </Text>
            <Text as="p" className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make finding your dream property simple and enjoyable
            </Text>
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
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                motionProps={{
                  transition: { duration: 0.6, delay: index * 0.1 },
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-secondary to-secondary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Text
            as="motion.div"
            motionProps={{ initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } }}
          >
            <Text as="h2" className="text-3xl md:text-4xl font-heading font-bold mb-6">
              Ready to Find Your Dream Home?
            </Text>
            <Text as="p" className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Start exploring thousands of properties today and discover the perfect place to call home.
            </Text>
            <Button
              onClick={() => navigate('/browse')}
              className="px-8 py-4 bg-white text-secondary rounded-lg hover:bg-gray-100 transition-colors font-bold text-lg shadow-lg"
              as="motion.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Browsing Properties
            </Button>
          </Text>
        </div>
      </section>
    </div>
  );
};

export default HomePage;