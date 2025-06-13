import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const MapControls = ({ onZoomIn, onZoomOut, onLocate }) => {
  return (
    <div className="absolute top-4 right-4 z-30 space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <Button onClick={onZoomIn} className="block w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors">
          <ApperIcon name="Plus" className="w-4 h-4 mx-auto" />
        </Button>
        <Button onClick={onZoomOut} className="block w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded text-gray-600 hover:text-gray-800 transition-colors mt-1">
          <ApperIcon name="Minus" className="w-4 h-4 mx-auto" />
        </Button>
      </div>
      <Button onClick={onLocate} className="block w-10 h-10 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg shadow-lg text-gray-600 hover:text-gray-800 transition-colors">
        <ApperIcon name="Locate" className="w-4 h-4 mx-auto" />
      </Button>
    </div>
  );
};

export default MapControls;