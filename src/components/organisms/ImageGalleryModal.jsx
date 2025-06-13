import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const ImageGalleryModal = ({ images, currentImageIndex, onImageChange, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <Button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <ApperIcon name="X" className="w-8 h-8" />
        </Button>

        <div className="relative max-w-4xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
          <img
            src={images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {images.length > 1 && (
            <>
              <Button
                onClick={() => onImageChange('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
              >
                <ApperIcon name="ChevronLeft" className="w-6 h-6" />
              </Button>
              <Button
                onClick={() => onImageChange('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
              >
                <ApperIcon name="ChevronRight" className="w-6 h-6" />
              </Button>
            </>
          )}

          <Text as="div" className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
            {currentImageIndex + 1} of {images.length}
          </Text>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageGalleryModal;