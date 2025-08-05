import {
    
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const Reportnavigationconfig: NavigationTree[] = [
  
    
    {
        key: 'Reports',
        path: '',
        title: 'Reports',
        translateKey: 'nav.Reports.Reports',
        icon: 'report',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'BookingReport',
                path: '/Reports-menu-BookingReport',
                title: 'Booking Sales Report',
                translateKey: 'nav.Reports.BookingReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
              
            },
            {
                key: 'ActualReport',
                path:  '/Reports-menu-acutalReport',
                title: 'Actual Sales Report',
                translateKey: 'nav.Reports.ActualReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },


             {
                key: 'AchItemWise)',
                path:  '/Reports-menu-Achievement',
                title: 'Achievement',
                translateKey: 'nav.Reports.Achievement',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },

             

             {
                key: 'BAReport',
                path:  '/Reports-menu-BAReport',
                title: 'Booking & Actual Sales Report',
                translateKey: 'nav.Reports.BAReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },

             {
                key: 'TvsAReport',
                path:  '/Reports-menu-TvsAReport',
                title: 'Target vs Actual Sales Report',
                translateKey: 'nav.Reports.TvsAReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },

        
             {
                key: 'Invoices',
                path:  '/Reports-menu-Invoices',
                title: 'Invoices',
                translateKey: 'nav.Reports.Invoices',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             }



        ]
      

    },

]
export default Reportnavigationconfig