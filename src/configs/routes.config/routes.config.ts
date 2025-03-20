import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
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
        key: 'MasterMenu.Demarcation',
        path: '/Master-menu-Demarcation',
        component: lazy(() => import('@/views/MasterSettings/Demarcation/Demarcation')),
        authority: [],
    },
    {
        key: 'MasterMenu.DistributorMapping',
        path: '/Master-menu-DistributorMapping',
        component: lazy(() => import('@/views/MasterSettings/DistributorMapping/DistributorMapping')),
        authority: [],
    },
    {
        key: 'MasterMenu.collapse.FinalGeography',
        path:  '/Master-menu-FinalGeography',
        component: lazy(() => import('@/views/MasterSettings/FinalGeography'),
        ),
        authority: [],
    },

   



    {
        key: 'UserMenu.collapse.ModifiyUser',
        path:  '/User-menu-ModifiyUser',
        component: lazy(() => import('@/views/auth/SignUp/SignUp'),
        ),
        authority: [],
    },


    {
        key: 'UserMenu.collapse.UserGroup',
        path:  '/User-menu-UserGroup',
        component: lazy(() => import('@/views/UserModule/UserGroup'),
        ),
        authority: [],
    },



    {
        key: 'SalesMenu.collapse.CategoryAdd',
        path: '/Sales-menu-CategoryAdd',
        component: lazy(() => import('@/views/SalesDetails/CategoryAdd/CategoryAdd')),
        authority: [],
    },
   


    {
        key: 'SalesMenu.FreeIssue',
        path: '/Sales-menu-FreeIssue',
        component: lazy(() => import('@/views/SalesDetails/FreeIssue')),
        authority: [],
    },


    {
        key: 'SalesMenu.ItemAdd',
        path:  '/Sales-menu-ItemAdd',
        component: lazy(() => import('@/views/SalesDetails/ItemAdd')),
        authority: [],
    },

    {
        key: 'SalesMenu.ItemMaster',
        path:'/Sales-menu-ItemMaster',
        component: lazy(() => import('@/views/SalesDetails/ItemMaster')),
        authority: [],
    },


    {
        key: 'SalesMenu.ItemSequence',
        path: '/Sales-menu-ItemSequence',
        component: lazy(() => import('@/views/SalesDetails/ItemSequence')),
        authority: [],
    },


    {
        key: 'SalesMenu.PriceUpdate',
        path: '/Sales-menu-PriceUpdate',
        component: lazy(() => import('@/views/SalesDetails/PriceUpdate')),
        authority: [],
    },


    {
        key: 'SalesMenu.Target',
        path: '/Sales-menu-Target',
        component: lazy(() => import('@/views/SalesDetails/Target')),
        authority: [],
    },
    {
        key: 'SalesMenu.Agstock',
        path:'/Sales-menu-Agstock',
        component: lazy(() => import('@/views/SalesDetails/Agstock')),
        authority: [],
    },

    {
        key: 'SalesMenu.Marketreturn',
        path:'/Sales-menu-Marketreturn',
        component: lazy(() => import('@/views/SalesDetails/Marketreturn')),
        authority: [],
    },
    {
        key: 'SalesMenu.WorkingDay',
        path:'/Sales-menu-WorkingDay',
        component: lazy(() => import('@/views/SalesDetails/WorkingDay')),
        authority: [],
    },



    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: lazy(
            () => import('@/views/MasterSettings/GroupCollapseMenuItemView2'),
        ),
        authority: [],
    },
    ...othersRoute,
]
