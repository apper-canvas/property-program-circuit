import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const PropertyStats = ({ property }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div className="text-center p-4 bg-white rounded-lg shadow-card">
        <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
          <ApperIcon name="Bed" className="w-6 h-6 text-accent" />
        </div>
        <Text as="div" className="text-2xl font-bold text-primary">{property.bedrooms}</Text>
        <Text as="div" className="text-sm text-gray-600">Bedrooms</Text>
      </div>
      <div className="text-center p-4 bg-white rounded-lg shadow-card">
        <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
          <ApperIcon name="Bath" className="w-6 h-6 text-accent" />
        </div>
        <Text as="div" className="text-2xl font-bold text-primary">{property.bathrooms}</Text>
        <Text as="div" className="text-sm text-gray-600">Bathrooms</Text>
      </div>
      <div className="text-center p-4 bg-white rounded-lg shadow-card">
        <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
          <ApperIcon name="Square" className="w-6 h-6 text-accent" />
        </div>
        <Text as="div" className="text-2xl font-bold text-primary">{property.squareFeet.toLocaleString()}</Text>
        <Text as="div" className="text-sm text-gray-600">Sq Ft</Text>
      </div>
      <div className="text-center p-4 bg-white rounded-lg shadow-card">
        <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mx-auto mb-2">
          <ApperIcon name="Calendar" className="w-6 h-6 text-accent" />
        </div>
        <Text as="div" className="text-2xl font-bold text-primary">{property.yearBuilt}</Text>
        <Text as="div" className="text-sm text-gray-600">Year Built</Text>
      </div>
    </div>
  );
};

export default PropertyStats;