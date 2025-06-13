const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const favoritesService = {
  async getAll() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "property_id" } },
          { "Field": { "Name": "added_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('favorite', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'property_id', 'added_at']
      };

      const response = await apperClient.getRecordById('favorite', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching favorite with ID ${id}:`, error);
      return null;
    }
  },

  async create(favoriteData) {
    try {
      const params = {
        records: [{
          Name: `Favorite ${favoriteData.property_id || favoriteData.propertyId}`,
          property_id: parseInt(favoriteData.property_id || favoriteData.propertyId),
          added_at: favoriteData.added_at || favoriteData.addedAt || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('favorite', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create favorite');
        }
        
        // Transform response to match UI expectations
        const created = response.results[0].data;
        return {
          ...created,
          propertyId: created.property_id,
          addedAt: created.added_at
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating favorite:", error);
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
      if (updates.propertyId) updateData.property_id = parseInt(updates.propertyId);
      if (updates.addedAt) updateData.added_at = updates.addedAt;

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('favorite', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update favorite');
        }
        return response.results[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error updating favorite:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('favorite', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete favorite');
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting favorite:", error);
      throw error;
    }
  },

  async getByPropertyId(propertyId) {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "property_id" } },
          { "Field": { "Name": "added_at" } }
        ],
        "where": [
          {
            "FieldName": "property_id",
            "Operator": "ExactMatch",
            "Values": [propertyId.toString()]
          }
        ]
      };

      const response = await apperClient.fetchRecords('favorite', params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      const favorites = response.data || [];
      return favorites.length > 0 ? favorites[0] : null;
    } catch (error) {
      console.error("Error fetching favorite by property ID:", error);
      return null;
    }
  }
};

export default favoritesService;

export default favoritesService;