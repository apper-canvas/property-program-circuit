import React from 'react';
import { Home, Search, Map, Heart, Bookmark } from 'lucide-react';

// Import page components
import HomePage from '../components/pages/HomePage';
import BrowsePage from '../components/pages/BrowsePage';
import PropertyDetailsPage from '../components/pages/PropertyDetailsPage';
import MapViewPage from '../components/pages/MapViewPage';
import FavoritesPage from '../components/pages/FavoritesPage';
import SavedSearchesPage from '../components/pages/SavedSearchesPage';
import NotFoundPage from '../components/pages/NotFoundPage';

export const routes = {
  home: {
    path: '/',
    component: HomePage,
    label: 'Home',
    icon: 'Home',
  },
  browse: {
    path: '/browse',
    component: BrowsePage,
    label: 'Browse Properties',
    icon: 'Search',
  },
  propertyDetails: {
    path: '/property/:id',
    component: PropertyDetailsPage,
    label: 'Property Details',
    hidden: true,
  },
  mapView: {
    path: '/map',
    component: MapViewPage,
    label: 'Map View',
    icon: 'Map',
  },
  favorites: {
    path: '/favorites',
    component: FavoritesPage,
    label: 'Favorites',
    icon: 'Heart',
  },
  savedSearches: {
    path: '/saved-searches',
    component: SavedSearchesPage,
    label: 'Saved Searches',
    icon: 'Bookmark',
  },
  notFound: {
    path: '*',
    component: NotFoundPage,
    hidden: true,
  },
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => !route.hidden);