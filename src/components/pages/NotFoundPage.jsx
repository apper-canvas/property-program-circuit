import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mb-8"
          >
            <ApperIcon name="Home" className="w-24 h-24 text-gray-300 mx-auto" />
          </motion.div>

          <Text as="h1" className="text-6xl font-heading font-bold text-primary mb-4">404</Text>
          <Text as="h2" className="text-2xl font-heading font-semibold text-primary mb-4">
            Property Not Found
          </Text>
          <Text as="p" className="text-gray-600 mb-8 leading-relaxed">
            The property you're looking for doesn't exist or has been moved to a new location.
          </Text>

          <div className="space-y-4">
            <Button
              onClick={() => navigate('/browse')}
              className="w-full px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors font-medium"
              as="motion.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Properties
            </Button>

            <Button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              as="motion.button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;