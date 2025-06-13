const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let savedFilters = [];

const filtersService = {
  async getAll() {
    await delay(200);
    return [...savedFilters];
  },

  async getById(id) {
    await delay(150);
    const filter = savedFilters.find(f => f.id === id);
    return filter ? { ...filter } : null;
  },

  async create(filterData) {
    await delay(300);
    const newFilter = {
      ...filterData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    savedFilters.unshift(newFilter);
    return { ...newFilter };
  },

  async update(id, updates) {
    await delay(300);
    const index = savedFilters.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Filter not found');
    
    savedFilters[index] = { ...savedFilters[index], ...updates };
    return { ...savedFilters[index] };
  },

  async delete(id) {
    await delay(250);
    const index = savedFilters.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Filter not found');
    
    savedFilters.splice(index, 1);
    return true;
  }
};

export default filtersService;