export const SALES_PREFIX_PATH = '/SalesDetails'
import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const Salesnavigationconfig: NavigationTree[] = [
    {
        key: 'Sales Details',
        path: '',
        title: 'Sales Details',
        translateKey: 'nav.SalesMenu.SalesMenu',
        icon: 'sales',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [ADMIN, USER],
        meta: {
            horizontalMenu: {
                layout: 'columns',
                columns: 2,
            },
        },
        subMenu: [
            {
                key: 'CategoryAdd',
                path: `${SALES_PREFIX_PATH}/Salesmenu/CategoryAdd`,
                title: 'CategoryAdd',
                translateKey: 'nav.SalesMenu.CategoryAdd',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, USER],
                subMenu: [],
            },
            {
                key: 'FreeIssue',
                path:  `${SALES_PREFIX_PATH} /Salesmenu/FreeIssue`,
                title: 'Free Issue',
                translateKey: 'nav.SalesMenu.FreeIssue',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ItemMaster',
                path: `${SALES_PREFIX_PATH} /Salesmenu/ItemMaster`,
                title: 'Item Master',
                translateKey: 'nav.SalesMenu.ItemMaster',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
          
            {
                key: 'ItemAdd',
                path: `${SALES_PREFIX_PATH} /Salesmenu/ItemAdd`,
                title: 'Item Add',
                translateKey: 'nav.SalesMenu.ItemAdd',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'ItemSequence',
                path: `${SALES_PREFIX_PATH} /Salesmenu/ItemSequence`,
                title: 'Item Sequence',
                translateKey: 'nav.SalesMenu.ItemSequence',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        
            {
                key: 'PriceUpdate',
                path: `${SALES_PREFIX_PATH} /Salesmenu/PriceUpdate`,
                title: 'Price Update',
                translateKey: 'nav.SalesMenu.PriceUpdate',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        
            
             
            {
                key: 'Agancy Stock',
                path: `${SALES_PREFIX_PATH} /Salesmenu/Stock`,
                title: 'Stock',
                translateKey: 'nav.SalesMenu.Stock',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            
            {
                key: 'Marketeturn',
                path: `${SALES_PREFIX_PATH} /Salesmenu/Marketreturn`,
                title: 'Market Return',
                translateKey: 'nav.SalesMenu.Marketreturn',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
         







        ],
    },
]
            export default Salesnavigationconfig