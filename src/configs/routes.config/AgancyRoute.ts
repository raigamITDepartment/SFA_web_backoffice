import { lazy } from 'react'
//import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const AgancyRoute: Routes = [


    {
        key: 'ActualInvoice',
        path: '/AgancyModule-Invoice-ActualInvoice',
        component: lazy(() => import('@/views/AgancyModule/ActualBill/Viewbills')),
        authority: [],
    },
    {
        key: 'PostInvoice',
        path: '/AgancyModule-Invoice-PostInvoice',
        component: lazy(() => import('@/views/AgancyModule/PostBill/Postbill')),
        authority: [],
    },

      {
        key: 'ManualInvoice',
        path: '/AgancyModule-Invoice-ManualInvoice',
        component: lazy(() => import('@/views/AgancyModule/ManualBill/CreateAgancybill')),
        authority: [],
    },

     {
        key: 'ViewInvoice',
        path: '/AgancyModule-Invoice-ViewInvoice',
        component: lazy(() => import('@/views/AgancyModule/ViewInvoices/Invoices')),
        authority: [],
    },
 
      {
         key: 'LoadingListView',
        path: '/LoadingList-LoadingListView',
        component: lazy(() => import('@/views/AgancyModule/LoadingList/LoadingList')),
        authority: [],
    },

     {
        key: 'GoodReturn',
         path: '/Return-GoodReturn',
        component: lazy(() => import('@/views/AgancyModule/Return/GoodReturn')),
        authority: [],
    },

    {
        key: 'MarketReturn',
        path: '/Return-MarketReturn',
        component: lazy(() => import('@/views/AgancyModule/Return/MarketReturn')),
        authority: [],
    },
 
 
]

export default AgancyRoute