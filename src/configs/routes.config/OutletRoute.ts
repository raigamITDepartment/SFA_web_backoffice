import { lazy } from 'react'
import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const OutletRoute: Routes = [


    {
        key: 'OutletModule.Customers',
        path:'/Outlet-Module-Customers',
        component: lazy(() => import('@/views/OutletModule/Customers')),
        authority: [],
    },

    {
        key: 'OutletModule.OutletReport',
        path:'/Outlet-Module-OutletReport',
        component: lazy(() => import('@/views/OutletModule/OutletReport')),
        authority: [],
    },
    {
        key: 'OutletModule.Route',
        path:'/Outlet-Module-Route',
        component: lazy(() => import('@/views/OutletModule/Route')),
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

]

export default OutletRoute