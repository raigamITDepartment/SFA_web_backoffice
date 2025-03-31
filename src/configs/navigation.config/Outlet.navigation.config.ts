import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const Outletnavigationconfig: NavigationTree[] = [


{
        key: 'OutletModule',
        path: '',
        title: 'Outlet Module',
        translateKey: 'nav.OutletModule.OutletModule',
        icon: 'Outlet',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'Customers',
                path: '/Outlet-Module-Customers',
                title: 'Customer (Outlet) ',
                translateKey: 'nav.OutletModule.Customers',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
              
            },

            {
                key: 'OutletReport',
                path: '/Outlet-Module-OutletReport',
                title: ' Active and close Outlet Report',
                translateKey: 'nav.OutletModule.OutletReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
              
            },

            {
                key: 'Route',
                path: '/Outlet-Module-Route',
                title: 'Route',
                translateKey: 'nav.OutletModule.Route',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
              
            },

        ]
    },

]
export default Outletnavigationconfig