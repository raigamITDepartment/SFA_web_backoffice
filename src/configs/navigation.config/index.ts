import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'Dashboard',
        path: '/home',
        title: 'Dashboard',
        translateKey: 'nav.home',
        icon: 'groupCollapseMenu',
        type: NAV_ITEM_TYPE_ITEM,
        authority: [],
        subMenu: [],
    },
    /** Example purpose only, please remove */
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

            {
                key: 'UserAccess',
                path:  '/User-menu-UserGroup',
                title: 'User Access Group',
                translateKey: 'UserMenu.collapse.UserGroup',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            }




        ],
    },
    {
        key: 'Master Settings',
        path: '',
        title: 'Master Settings',
        translateKey: 'nav.MasterMenu.MasterMenu',
        icon: 'collapseMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'Demarcation',
                path: '/Master-menu-Demarcation',
                title: 'Demarcation',
                translateKey: 'nav.MasterMenu.Demarcation',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'Distributor Mapping',
                path: '/Master-menu-DistributorMapping',
                title: 'Distributor Mapping',
                translateKey: 'nav.MasterMenu.DistributorMapping',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'Final Geography Mapping',
                path: '/Master-menu-FinalGeography',
                title: 'Final Geography Mapping',
                translateKey: 'nav.MasterMenu.FinalGeography',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },

   
    {
        key: 'Sales Details',
        path: '',
        title: 'Sales Details',
        translateKey: 'nav.SalesMenu.SalesMenu',
        icon: 'sales',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'CategoryAdd',
                path: '/Sales-menu-CategoryAdd',
                title: 'CategoryAdd',
                translateKey: 'nav.SalesMenu.CategoryAdd',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'FreeIssue',
                path:  '/Sales-menu-FreeIssue',
                title: 'Free Issue',
                translateKey: 'nav.SalesMenu.FreeIssue',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ItemAdd',
                path: '/Sales-menu-ItemAdd',
                title: 'Item Add',
                translateKey: 'nav.SalesMenu.ItemAdd',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
          
            {
                key: 'ItemMaster',
                path: '/Sales-menu-ItemMaster',
                title: 'Item Master',
                translateKey: 'nav.SalesMenu.ItemMaster',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ItemSequence',
                path: '/Sales-menu-ItemSequence',
                title: 'Item Sequence',
                translateKey: 'nav.SalesMenu.ItemSequence',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        
            {
                key: 'PriceUpdate',
                path: '/Sales-menu-PriceUpdate',
                title: 'Price Update',
                translateKey: 'nav.SalesMenu.PriceUpdate',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        
            {
                key: 'Target',
                path: '/Sales-menu-Target',
                title: 'Target',
                translateKey: 'nav.SalesMenu.Target',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
         







        ],
    },







    {
        key: 'groupMenu',
        path: '',
        title: 'Group Menu',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'groupMenu',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'groupMenu.single',
                path: '/group-single-menu-item-view',
                title: 'Group single menu item',
                translateKey: 'nav.groupMenu.single',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'groupMenu.collapse',
                path: '',
                title: 'Group collapse menu',
                translateKey: 'nav.groupMenu.collapse.collapse',
                icon: 'groupCollapseMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'groupMenu.collapse.item1',
                        path: '/group-collapse-menu-item-view-1',
                        title: 'Menu item 1',
                        translateKey: 'nav.groupMenu.collapse.item1',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'groupMenu.collapse.item2',
                        path: '/group-collapse-menu-item-view-2',
                        title: 'Menu item 2',
                        translateKey: 'nav.groupMenu.collapse.item2',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default navigationConfig
