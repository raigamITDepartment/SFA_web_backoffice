import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'



const Salesnavigationconfig: NavigationTree[] = [
    {
        key: 'Sales Details',
        path: '',
        title: 'Sales Details',
        translateKey: 'nav.SalesMenu.SalesMenu',
        icon: 'sales',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 2,
            },
        },
        subMenu: [
            {
                key: 'CategoryAdd',
                path: '/Salesmenu/CategoryAdd',
                title: 'Category Add',
                translateKey: 'nav.SalesMenu.CategoryAdd',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                    authority: [],
                subMenu: [],
            },
            {
                key: 'FreeIssue',
                path: '/Salesmenu/FreeIssue',
                title: 'Free Issue',
                translateKey: 'nav.SalesMenu.FreeIssue',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ItemMaster',
                path: '/Salesmenu/ItemMaster',
                title: 'Item Master',
                translateKey: 'nav.SalesMenu.ItemMaster',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ItemAdd',
                path: '/Salesmenu/ItemAdd',
                title: 'Item Add',
                translateKey: 'nav.SalesMenu.ItemAdd',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ItemSequence',
                path: '/Salesmenu/ItemSequence',
                title: 'Item Sequence',
                translateKey: 'nav.SalesMenu.ItemSequence',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'PriceUpdate',
                path: '/Salesmenu/PriceUpdate',
                title: 'Price Update',
                translateKey: 'nav.SalesMenu.PriceUpdate',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'AgancyStock',
                path: '/Salesmenu/Stock',
                title: 'Stock',
                translateKey: 'nav.SalesMenu.Stock',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'MarketReturn',
                path: '/Salesmenu/MarketReturn',
                title: 'Market Return',
                translateKey: 'nav.SalesMenu.MarketReturn',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'Working',
                path: '/Salesmenu/WorkingDay',
                title: 'Working Day',
                translateKey: 'nav.SalesMenu.WorkingDay',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'Invoice',
                path: '/Salesmenu/Invoice',
                title: 'Invoice',
                translateKey: 'nav.SalesMenu.Invoice',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'Target',
                path: '/Salesmenu/Target',
                title: 'Target',
                translateKey: 'nav.SalesMenu.Target',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default Salesnavigationconfig
