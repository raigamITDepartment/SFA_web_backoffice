import {
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const AgancyModulenavigationconfig: NavigationTree[] = [
  
   
    {
        key: 'AgancyModule',
        path: '',
        title: 'Agancy Module',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'Agancy',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [

            {
                key: 'Dashboard',
                path: '/AgancyModule-Dashboard',
                title: 'Dashboard',
                translateKey: 'nav.singleMenuItem',
                icon: 'dashboard',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
        
                    {
                        key: 'MonthlyTarget',
                        path: '/AgancyModule-Dashboard-MonthlyTarget',
                        title: 'Monthly Target',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                  
               
        
        
                ],
            },

          {
                key: 'Invoice',
                path: '/AgancyModule-Invoice',
                title: 'Invoice',
                translateKey: 'nav.singleMenuItem',
                icon: 'Invoice',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
        
                    {
                        key: 'ActualInvoice',
                        path: '/AgancyModule-Invoice-ActualInvoice',
                        title: 'Actual Invoice',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                    {
                        key: 'PostInvoice',
                        path: '/AgancyModule-Invoice-PostInvoice',
                        title: 'Post Invoice',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                  
                  
                    {
                        key: 'ManualInvoice',
                        path: '/AgancyModule-Invoice-ManualInvoice',
                        title: 'Manual Invoice',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [  ],

                    
                    },
                    {
                        key: 'ViewInvoice',
                        path: '/AgancyModule-Invoice-ViewInvoice',
                        title: 'View Invoice',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [  ],

                    
                    },
               
        
        
                ],
            },

             
            {
                key: 'LoadingList',
                path: '/LoadingList',
                title: 'Loading List',
                translateKey: 'nav.singleMenuItem',
                icon: 'Loding',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
        
                    {
                        key: 'LoadingListView',
                        path: '/LoadingList-LoadingListView',
                        title: 'View Loading List',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                  
               
        
        
                ],
            },
             
                 {
                key: 'Return',
                path: '/Return-menu',
                title: 'Return',
                translateKey: 'nav.singleMenuItem',
                icon: 'Return',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
        
                    {
                        key: 'GoodReturn',
                        path: '/Return-GoodReturn',
                        title: 'Good Return',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                    },
                  {
                        key: 'MarketReturn',
                        path: '/Return-MarketReturn',
                        title: 'Market Return',
                        translateKey: 'AgancyModule-Dashboard-MonthlyTarget',
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
export default AgancyModulenavigationconfig