import { lazy } from 'react'
//import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const AgancyRoute: Routes = [
    {
        key: 'ActualInvoice',
        path: '/AgancyModule-Invoice-ActualInvoice',
        component: lazy(
            () => import('@/views/AgancyModule/Invoice/ActualBill/Viewbills'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },
    {
        key: 'PostInvoice',
        path: '/AgancyModule-Invoice-PostInvoice',
        component: lazy(
            () => import('@/views/AgancyModule/Invoice/PostBill/Postbill'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'EditBill',
        path: '/EditBill/:invoiceId',
        component: lazy(
            () => import('@/views/AgancyModule/Invoice/PostBill/Edit/Editbill'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'AddItem',
        path: '/AddItem/:invoiceId',
        component: lazy(
            () => import('@/views/AgancyModule/Invoice/PostBill/Edit/AddItem'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'ManualInvoice',
        path: '/AgancyModule-Invoice-ManualInvoice',
        component: lazy(
            () =>
                import('@/views/AgancyModule/Invoice/ManualBill/CreateInvoice'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'invoiceFinish',
        path: '/AgancyModule-Invoice-invoiceFinish',
        component: lazy(
            () =>
                import('@/views/AgancyModule/Invoice/ManualBill/InvoiceFinish'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },






    {
        key: 'CreateInvoiceScreen',
        path: '/AgancyModule-Invoice-CreateInvoiceScreen',
        component: lazy(
            () =>
                import('@/views/AgancyModule/Invoice/ManualBill/CreateInvoiceScreen'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'ItemDetails',
        path: '/AgancyModule-Invoice-ItemDetails',
        component: lazy(
            () =>
                import('@/views/AgancyModule/Invoice/ManualBill/ItemDetailsScreen'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'ViewInvoice',
        path: '/AgancyModule-Invoice-ViewInvoice',
        component: lazy(
            () => import('@/views/AgancyModule/Invoice/ViewInvoices/ViewInvoices'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'invoiceDetails',
        path: '/invoice-details/:invoiceId',
        component: lazy(() => import('@/views/AgancyModule/Invoice/ViewInvoices/InvoiceDetails')),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },
    {
        key: 'LoadingListView',
        path: '/LoadingList-LoadingListView',
        component: lazy(
            () => import('@/views/AgancyModule/LoadingList/LoadingList'),
        ),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'GoodReturn',
        path: '/Return-GoodReturn',
        component: lazy(() => import('@/views/AgancyModule/Return/GoodReturn')),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'MarketReturn',
        path: '/Return-MarketReturn',
        component: lazy(
            () => import('@/views/AgancyModule/Return/MarketReturn'),
        ),
        authority: [],
    },
    {
    key: 'ViewStock',
    path: '/Stock-ViewStock',
    component: lazy(() => import('@/views/AgancyModule/Stock/ViewStock')),
    authority: [],
    
    },
    {
    key: 'StockAdd',
    path: '/Stock-StockAdd',
    component: lazy(() => import('@/views/AgancyModule/Stock/StockAdd')),
    authority: [],
    
    },

]

export default AgancyRoute
