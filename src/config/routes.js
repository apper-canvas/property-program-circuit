import Browse from '../pages/Browse';
import PropertyDetails from '../pages/PropertyDetails';
import MapView from '../pages/MapView';
import Favorites from '../pages/Favorites';
import SavedSearches from '../pages/SavedSearches';
import NotFound from '../pages/NotFound';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Search',
    component: Browse
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: Favorites
  },
  savedSearches: {
    id: 'savedSearches',
    label: 'Saved Searches',
    path: '/searches',
    icon: 'Bookmark',
    component: SavedSearches
  },
  propertyDetails: {
    id: 'propertyDetails',
    label: 'Property Details',
    path: '/property/:id',
    icon: 'Home',
    component: PropertyDetails,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => !route.hidden);