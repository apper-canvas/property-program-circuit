import propertiesData from '../mockData/properties.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let properties = [...propertiesData];

const propertiesService = {
  async getAll() {
    await delay(300);
    return [...properties];
  },

  async getById(id) {
    await delay(200);
    const property = properties.find(p => p.id === id);
    return property ? { ...property } : null;
  },

  async create(propertyData) {
    await delay(400);
    const newProperty = {
      ...propertyData,
      id: Date.now().toString(),
      listingDate: new Date().toISOString(),
      status: 'active'
    };
    properties.unshift(newProperty);
    return { ...newProperty };
  },

  async update(id, updates) {
    await delay(400);
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    
    properties[index] = { ...properties[index], ...updates };
    return { ...properties[index] };
  },

  async delete(id) {
    await delay(300);
    const index = properties.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Property not found');
    
    properties.splice(index, 1);
    return true;
  },

  async search(query) {
    await delay(250);
    if (!query || query.trim() === '') return [...properties];
    
    const searchTerm = query.toLowerCase();
    const filtered = properties.filter(property =>
      property.title.toLowerCase().includes(searchTerm) ||
      property.address.toLowerCase().includes(searchTerm) ||
      property.city.toLowerCase().includes(searchTerm) ||
      property.state.toLowerCase().includes(searchTerm) ||
      property.propertyType.toLowerCase().includes(searchTerm) ||
      property.description.toLowerCase().includes(searchTerm)
    );
    
    return [...filtered];
  }
};

export default propertiesService;