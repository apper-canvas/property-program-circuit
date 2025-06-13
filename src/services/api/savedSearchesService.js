const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const savedSearchesService = {
  async getAll() {
    try {
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "filters" } },
          { "Field": { "Name": "created_at" } }
        ]
      };

      const response = await apperClient.fetchRecords('saved_search', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved searches:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'filters', 'created_at']
      };

      const response = await apperClient.getRecordById('saved_search', id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching saved search with ID ${id}:`, error);
      return null;
    }
  },

  async create(searchData) {
    try {
      const params = {
        records: [{
          Name: searchData.name || searchData.Name,
          filters: typeof searchData.filters === 'object' ? JSON.stringify(searchData.filters) : searchData.filters,
          created_at: searchData.created_at || searchData.createdAt || new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('saved_search', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create saved search');
        }
        
        // Transform response to match UI expectations
        const created = response.results[0].data;
        return {
          ...created,
          name: created.Name,
          createdAt: created.created_at
        };
      }

      return null;
    } catch (error) {
      console.error("Error creating saved search:", error);
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
      if (updates.name) updateData.Name = updates.name;
      if (updates.createdAt) updateData.created_at = updates.createdAt;
      if (updates.filters) {
        updateData.filters = typeof updates.filters === 'object' ? JSON.stringify(updates.filters) : updates.filters;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('saved_search', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update saved search');
        }
        return response.results[0].data;
      }

      return null;
    } catch (error) {
      console.error("Error updating saved search:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('saved_search', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete saved search');
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error deleting saved search:", error);
      throw error;
    }
  }
};

export default savedSearchesService;

export default savedSearchesService;