import { lazy } from 'react'
import  {SALES_PREFIX_PATH} from '@/constants/route.constant'
import {CONCEPTS_PREFIX_PATH} from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const SalesRoute: Routes = [



    {
        key: 'SalesMenu.CategoryAdd',
       path: `${SALES_PREFIX_PATH}/Salesmenu/CategoryAdd`,
      // path: '/Sales-menu-CategoryAdd',
        component: lazy(() => import('@/views/SalesDetails/CategoryAdd/CategoryAdd')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'contained',
        },
    },
   


    {
        key: 'SalesMenu.FreeIssue',
          path:  `${SALES_PREFIX_PATH} /Salesmenu/FreeIssue`,
        component: lazy(() => import('@/views/SalesDetails/FreeIssue')),
        authority: [],
    },


    {
        key: 'SalesMenu.ItemMaster',
        path: `${SALES_PREFIX_PATH} /Salesmenu/ItemMaster`,
        component: lazy(() => import('@/views/SalesDetails/products/ProductList'),),
        authority: [],
    },

  

    {
        key: 'SalesMenu.ItemAdd',
      path: `${SALES_PREFIX_PATH} /Salesmenu/ItemAdd`,
        component: lazy(() => import('@/views/SalesDetails/products/ProductCreate')),
        authority: [],
    },
// {
//         key:  'SalesMenu.ItemAdd',
//         path:  `${CONCEPTS_PREFIX_PATH}/Sales-menu-`,
//         component: lazy(
//             () => import('@/views/SalesDetails/products/ProductCreate'),
//         ),
//         authority: [ADMIN, USER],
//         meta: {
//             header: {
//                 title: 'Create product',
//                 description:
//                     'Quickly add products to your inventory. Enter key details, manage stock, and set availability.',
//                 contained: true,
//             },
//             footer: false,
//         },
//     },
        {
            key: 'SalesMenu.ItemSequence',
            path: `${SALES_PREFIX_PATH} /Salesmenu/ItemSequence`,
            component: lazy(() => import('@/views/SalesDetails/ItemSequence')),
            authority: [],
        },

    {
        key: 'SalesMenu.PriceUpdate',
   path: `${SALES_PREFIX_PATH} /Salesmenu/PriceUpdate`,
        component: lazy(() => import('@/views/SalesDetails/PriceUpdate')),
        authority: [],
    },


  
    {
        key: 'SalesMenu.Stock',
            path: `${SALES_PREFIX_PATH} /Salesmenu/Stock`,
        component: lazy(() => import('@/views/SalesDetails/Stock/ProductList')),
        authority: [],
    },

    {
        key: 'SalesMenu.Marketreturn',
        path:`${SALES_PREFIX_PATH}/Salesmenu/Marketreturn`,
        component: lazy(() => import('@/views/SalesDetails/Marketreturn')),
        authority: [],
    },
    {
        key: 'SalesMenu.WorkingDay',
        path:`${SALES_PREFIX_PATH}/Salesmenu/WorkingDay`,
        component: lazy(() => import('@/views/SalesDetails/WorkingDay')),
        authority: [],
    },

]

export default SalesRoute