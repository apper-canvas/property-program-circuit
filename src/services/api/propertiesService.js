const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const propertiesService = {
  async getAll() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "price" } },
          { "Field": { "Name": "address" } },
          { "Field": { "Name": "city" } },
          { "Field": { "Name": "state" } },
          { "Field": { "Name": "zip_code" } },
          { "Field": { "Name": "property_type" } },
          { "Field": { "Name": "bedrooms" } },
          { "Field": { "Name": "bathrooms" } },
          { "Field": { "Name": "square_feet" } },
          { "Field": { "Name": "year_built" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "features" } },
          { "Field": { "Name": "images" } },
          { "Field": { "Name": "coordinates_lat" } },
          { "Field": { "Name": "coordinates_lng" } },
          { "Field": { "Name": "listing_date" } },
          { "Field": { "Name": "status" } }
        ]
      };

      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching properties:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'title', 'price', 'address', 'city', 'state', 'zip_code', 'property_type', 'bedrooms', 'bathrooms', 'square_feet', 'year_built', 'description', 'features', 'images', 'coordinates_lat', 'coordinates_lng', 'listing_date', 'status']
      };

      const response = await apperClient.getRecordById('property', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching property with ID ${id}:`, error);
      return null;
    }
  },

  async create(propertyData) {
    try {
      const params = {
        records: [{
          Name: propertyData.title || propertyData.Name,
          title: propertyData.title,
          price: propertyData.price,
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zip_code: propertyData.zip_code || propertyData.zipCode,
          property_type: propertyData.property_type || propertyData.propertyType,
          bedrooms: propertyData.bedrooms,
          bathrooms: propertyData.bathrooms,
          square_feet: propertyData.square_feet || propertyData.squareFeet,
          year_built: propertyData.year_built || propertyData.yearBuilt,
          description: propertyData.description,
          features: Array.isArray(propertyData.features) ? propertyData.features.join(',') : propertyData.features,
          images: Array.isArray(propertyData.images) ? propertyData.images.join(',') : propertyData.images,
          coordinates_lat: propertyData.coordinates_lat || propertyData.coordinates?.lat,
          coordinates_lng: propertyData.coordinates_lng || propertyData.coordinates?.lng,
          listing_date: propertyData.listing_date || new Date().toISOString(),
          status: propertyData.status || 'active'
        }]
      };

      const response = await apperClient.createRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create property');
        }
        return response.results[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    }
  },

  async update(id, updates) {
    try {
      const updateData = {
        Id: parseInt(id),
        ...updates
      };

      // Convert field names for database compatibility
      if (updates.zipCode) updateData.zip_code = updates.zipCode;
      if (updates.propertyType) updateData.property_type = updates.propertyType;
      if (updates.squareFeet) updateData.square_feet = updates.squareFeet;
      if (updates.yearBuilt) updateData.year_built = updates.yearBuilt;
      if (updates.coordinates?.lat) updateData.coordinates_lat = updates.coordinates.lat;
      if (updates.coordinates?.lng) updateData.coordinates_lng = updates.coordinates.lng;
      if (updates.listingDate) updateData.listing_date = updates.listingDate;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update property');
        }
        return response.results[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('property', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete property');
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },

  async search(query) {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "price" } },
          { "Field": { "Name": "address" } },
          { "Field": { "Name": "city" } },
          { "Field": { "Name": "state" } },
          { "Field": { "Name": "zip_code" } },
          { "Field": { "Name": "property_type" } },
          { "Field": { "Name": "bedrooms" } },
          { "Field": { "Name": "bathrooms" } },
          { "Field": { "Name": "square_feet" } },
          { "Field": { "Name": "year_built" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "features" } },
          { "Field": { "Name": "images" } },
          { "Field": { "Name": "coordinates_lat" } },
          { "Field": { "Name": "coordinates_lng" } },
          { "Field": { "Name": "listing_date" } },
          { "Field": { "Name": "status" } }
        ],
        "where": [
          {
            "FieldName": "title",
            "Operator": "Contains",
            "Values": [query]
          }
        ]
      };

      const response = await apperClient.fetchRecords('property', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching properties:", error);
      return [];
    }
  }
};

export default propertiesService;