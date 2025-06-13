const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let savedSearches = [];

const savedSearchesService = {
  async getAll() {
    await delay(200);
    return [...savedSearches];
  },

  async getById(id) {
    await delay(150);
    const search = savedSearches.find(s => s.id === id);
    return search ? { ...search } : null;
  },

  async create(searchData) {
    await delay(300);
    const newSearch = {
      ...searchData,
      id: Date.now().toString(),
      createdAt: searchData.createdAt || new Date().toISOString()
    };
    savedSearches.unshift(newSearch);
    return { ...newSearch };
  },

  async update(id, updates) {
    await delay(300);
    const index = savedSearches.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Saved search not found');
    
    savedSearches[index] = { ...savedSearches[index], ...updates };
    return { ...savedSearches[index] };
  },

  async delete(id) {
    await delay(250);
    const index = savedSearches.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Saved search not found');
    
    savedSearches.splice(index, 1);
    return true;
  }
};

export default savedSearchesService;