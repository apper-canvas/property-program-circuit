path: '/browse',
    icon: 'Search',
    component: BrowsePage,
  },
}
};

export const routeArray = Object.values(routes);
export const navRoutes = routeArray.filter(route => !route.hidden);