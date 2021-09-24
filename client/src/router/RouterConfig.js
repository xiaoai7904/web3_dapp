import React from 'react';

export const RouterConfig = [
  {
    path: '/home',
    name: 'home',
    component: React.lazy(() => import('@/view/home/Home.view')),
  },
  {
    path: '/user',
    name: 'user',
    component: React.lazy(() => import('@/view/user/UserPage.view')),
  },
  {
    path: '/marketplace',
    name: 'marketplace',
    component: React.lazy(() => import('@/view/marketplace/Marketplace.view')),
  },
  {
    path: '/404',
    name: '404',
    component: React.lazy(() => import('@/components/404/404.view')),
  }
];

export default RouterConfig;
