import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const FeatureCard = ({ icon, title, description, motionProps }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      {...motionProps}
      className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-secondary" />
      </div>
      <Text as="h3" className="text-xl font-heading font-semibold text-primary mb-3">
        {title}
      </Text>
      <Text className="text-gray-600 leading-relaxed">
        {description}
      </Text>
    </motion.div>
  );
};

export default FeatureCard;