import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const AdminModuleNavigationConfig: NavigationTree[] = [
    {
        key: 'AdminModule',
        path: '',
        title: 'Admin Module',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'groupMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'UserModule',
                path: '/single-menu-view',
                title: 'User Module',
                translateKey: 'nav.singleMenuItem',
                icon: 'usermodule',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'ModifiyUser',
                        path: '/User-menu-ModifiyUser',
                        title: 'Add/Modifiy User',
                        translateKey: 'UserMenu.collapse.ModifiyUser',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
            {
                key: 'InvoiceReverse',
                path: '',
                title: 'Invoice Reverse',
                translateKey: 'nav.AdminModule.AdminModule',
                icon: 'research',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'BookingReverse',
                        path: '/Admin-menu-BookingReverse',
                        title: 'BookingReverse',
                        translateKey: 'nav.Admin.BookingReverse',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'AcutualReverse',
                        path: '/Admin-menu-AcutualReverse',
                        title: 'Actual Reverse',
                        translateKey: 'nav.Admin.AcutualReverse',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ]
            },
            // Corrected ShopTransfer configuration
            {
                key: 'ShopTransfer',
                path: '/Admin-menu-ShopTransfer',
                title: 'Shop Transfer',
                translateKey: 'nav.AdminModule.ShopTransfer',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM, // Changed to single menu item
                authority: [],
                subMenu: [], // Removed redundant submenu
            },
        ],
    },
]

export default AdminModuleNavigationConfig