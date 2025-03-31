import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import MasterRoute from './MasterRoute'
import OutletRoute from './OutletRoute'
import SalesRoute from './SalesRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    {
        key: 'home',
        path: '/home',
        component: lazy(() => import('@/views/Home')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'singleMenuItem',
        path: '/single-menu-view',
        component: lazy(() => import('@/views/MasterSettings/SingleMenuView')),
        authority: [],
    },
    

   

    {
        key: 'createProduct',
        path: '/create-product',
        component: lazy(() => import('@/views/SalesDetails/products/ProductCreate/ProductCreate')),
        authority: [],
    },

   ...OutletRoute ,
    ...SalesRoute,
    ... MasterRoute,
    ...othersRoute,
]
