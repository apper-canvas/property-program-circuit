import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const PropertyMarker = ({ property, onClick, formatPrice, index }) => {
  // Simulate random positions based on property index (as in original MapView)
  const x = 100 + (index * 150) % (window.innerWidth - 300);
  const y = 100 + (index * 120) % (window.innerHeight - 300);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
      className="absolute z-20"
      style={{ left: x, top: y }}
    >
      <div className="relative">
        <Button
          onClick={() => onClick(property)}
          className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg hover:bg-secondary/90 transition-colors border-2 border-white"
          as="motion.button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {formatPrice(property.price)}
        </Button>

        {/* Marker Pin */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-secondary" />
      </div>
    </motion.div>
  );
};

export default PropertyMarker;