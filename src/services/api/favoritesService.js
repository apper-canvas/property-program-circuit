const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let favorites = [];

const favoritesService = {
  async getAll() {
    await delay(200);
    return [...favorites];
  },

  async getById(id) {
    await delay(150);
    const favorite = favorites.find(f => f.id === id);
    return favorite ? { ...favorite } : null;
  },

  async create(favoriteData) {
    await delay(300);
    const newFavorite = {
      ...favoriteData,
      id: Date.now().toString(),
      addedAt: favoriteData.addedAt || new Date().toISOString()
    };
    favorites.unshift(newFavorite);
    return { ...newFavorite };
  },

  async update(id, updates) {
    await delay(300);
    const index = favorites.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Favorite not found');
    
    favorites[index] = { ...favorites[index], ...updates };
    return { ...favorites[index] };
  },

  async delete(id) {
    await delay(250);
    const index = favorites.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Favorite not found');
    
    favorites.splice(index, 1);
    return true;
  },

  async getByPropertyId(propertyId) {
    await delay(150);
    const favorite = favorites.find(f => f.propertyId === propertyId);
    return favorite ? { ...favorite } : null;
  }
};

export default favoritesService;