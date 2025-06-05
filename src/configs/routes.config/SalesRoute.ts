import { lazy } from 'react'

//import {CONCEPTS_PREFIX_PATH} from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const SalesRoute: Routes = [



    {
        key: 'SalesMenu.CategoryAdd',
       path: '/Salesmenu/CategoryAdd',
      // path: '/Sales-menu-CategoryAdd',
        component: lazy(() => import('@/views/SalesDetails/CategoryAdd/CategoryAdd')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
   


    {
        key: 'SalesMenu.FreeIssue',
          path:  '/Salesmenu/FreeIssue',
        component: lazy(() => import('@/views/SalesDetails/FreeIssue')),
        authority: [],
    },


    {
        key: 'SalesMenu.ItemMaster',
        path: '/Salesmenu/ItemMaster',
        component: lazy(() => import('@/views/SalesDetails/Products/ProductList'),),
        authority: [],
    },

  

    {
        key: 'SalesMenu.ItemAdd',
      path: '/Salesmenu/ItemAdd',
        component: lazy(() => import('@/views/SalesDetails/Products/ProductCreate')),
        authority: [],
    },

    {
            key: 'SalesMenu.ItemSequence',
            path: '/Salesmenu/ItemSequence',
            component: lazy(() => import('@/views/SalesDetails/ItemSequence/ItemSequence')),
            authority: [],
     },

    {
        key: 'SalesMenu.PriceUpdate',
        path: '/Salesmenu/PriceUpdate',
        component: lazy(() => import('@/views/SalesDetails/PriceUpdate/products/ProductForm/PriceUpdateForm')),
        authority: [],
    },


  
    {
        key: 'SalesMenu.Stock',
        path: '/Salesmenu/Stock',
        component: lazy(() => import('@/views/SalesDetails/Stock/ProductList')),
        authority: [],
    },

    {
        key: 'SalesMenu.MarketReturn',
        path: '/Salesmenu/MarketReturn',
        component: lazy(() => import('@/views/SalesDetails/MarketReturn/MarketReturn')),
        authority: [],
    },

    {
        key: 'SalesMenu.WorkingDay',
        path:'/Salesmenu/WorkingDay',
        component: lazy(() => import('@/views/SalesDetails/WorkingDay/WorkingDay')),
        authority: [],
    },

    {
        key: 'SalesMenu.Invoice',
        path:'/Salesmenu/Invoice',
        component: lazy(() => import('@/views/SalesDetails/Invoice/Invoice')),
        authority: [],
    },

 
    {
        key: 'SalesMenu.Target',
        path:'/Salesmenu/Target',
        component: lazy(() => import('@/views/SalesDetails/Target/Target')),
        authority: [],
    },

]

export default SalesRoute