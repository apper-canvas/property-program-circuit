import BrowsePage from '@/components/pages/BrowsePage';
import PropertyDetailsPage from '@/components/pages/PropertyDetailsPage';
import MapViewPage from '@/components/pages/MapViewPage';
import FavoritesPage from '@/components/pages/FavoritesPage';
import SavedSearchesPage from '@/components/pages/SavedSearchesPage';
import NotFoundPage from '@/components/pages/NotFoundPage';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Search',
component: BrowsePage
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapViewPage
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: FavoritesPage
  },
  savedSearches: {
    id: 'savedSearches',
    label: 'Saved Searches',
    path: '/searches',
    icon: 'Bookmark',
    component: SavedSearchesPage
  },
  propertyDetails: {
    id: 'propertyDetails',
    label: 'Property Details',
    path: '/property/:id',
    icon: 'Home',
    component: PropertyDetailsPage,
    hidden: true
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '*',
    icon: 'AlertCircle',
    component: NotFoundPage,
    hidden: true
  }
};
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => !route.hidden);