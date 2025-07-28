import { lazy } from 'react'
//import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const OutletRoute: Routes = [


    {
        key: 'OutletModule.Customers',
        path:'/Outlet-Module-Customers',
        component: lazy(() => import('@/views/OutletModule/Customers/Customers')),
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
        component: lazy(() => import('@/views/OutletModule/Route/Route')),
        authority: [],
    },

    // {
    //     key: 'groupMenu.collapse.item2',
    //     path: '/group-collapse-menu-item-view-2',
    //     component: lazy(
    //         () => import('@/views/MasterSettings/GroupCollapseMenuItemView2'),
    //     ),
    //     authority: [],
    // },
    // {
    //     key: 'OutletModule.editOutlet',
    //     path: '/Outlet-Module-editOutlet',
    //     component: lazy(
    //         () => import('@/views/OutletModule/CreateCustomer/CustomerEdit'),
    //     ),
    //     authority: [],
    // },
        {
        key: 'outlets.edit',
        path: '/outlets/edit/:outletId',
        component: lazy(
            () => import('@/views/OutletModule/Customers/Edit/OutletEdit')
        ),
        authority: [],
    },


]

export default OutletRoute