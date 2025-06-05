import { lazy } from 'react'

import MasterRoute from './MasterRoute'
import OutletRoute from './OutletRoute'
import SalesRoute from './SalesRoute'
import UserModule from './AdminRoute'
import dashboardsRoute from './dashboardsRoute'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import HrRoute from './HrRoute'
import ReportRoute from './ReportRoute'
import AgencyRoute from './AgancyRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [

   
    
    ...dashboardsRoute,
    ...OutletRoute ,
    ...SalesRoute,
    ... MasterRoute,
     ...HrRoute,
    ...UserModule,
    ...ReportRoute,
    ...AgencyRoute,

    {
        key: 'createProduct',
        path: '/create-product',
        component: lazy(() => import('@/views/SalesDetails/Products/ProductCreate/ProductCreate')),
        authority: [],
    },

  
  
]
