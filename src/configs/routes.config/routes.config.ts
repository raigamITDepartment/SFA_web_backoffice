import { lazy } from 'react'

import othersRoute from './othersRoute'
import MasterRoute from './MasterRoute'
import OutletRoute from './OutletRoute'
import SalesRoute from './SalesRoute'
import UserModule from './AdminRoute'
import dashboardsRoute from './dashboardsRoute'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [

   
    
    ...dashboardsRoute,
    ...OutletRoute ,
    ...SalesRoute,
    ... MasterRoute,
    ...othersRoute,
    ...UserModule,

    {
        key: 'createProduct',
        path: '/create-product',
        component: lazy(() => import('@/views/SalesDetails/Products/ProductCreate/ProductCreate')),
        authority: [],
    },

  
  
]
