import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import Masternavigationconfig from './Master.navigation.config'
import Salesnavigationconfig from './Sales.navigation.config'
import Outletnavigationconfig from './Outlet.navigation.config'
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
   

   ...Masternavigationconfig,
   ...Salesnavigationconfig,
   ...Outletnavigationconfig,
   



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
                path: '/Sales-menu-BookingReport',
                title: 'Booking Sales Report',
                translateKey: 'nav.Reports.BookingReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
              
            },
            {
                key: 'ActualReport',
                path:  '/Sales-menu-acutalReport',
                title: 'Actual Sales Report',
                translateKey: 'nav.Reports.ActualReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },


             {
                key: 'AchItemWise)',
                path:  '/Sales-menu-AchItemWise',
                title: 'Achievement(Item Wise)',
                translateKey: 'nav.Reports.AchItemWise',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },

             {
                key: 'AchProductwise',
                path:  '/Sales-menu-AchProductwise',
                title: 'Achievement(Product Wise)',
                translateKey: 'nav.Reports.AchProductwise',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             }
             ,

             {
                key: 'BAReport',
                path:  '/Sales-menu-BAReport',
                title: 'Booking & Actual Sales Report',
                translateKey: 'nav.Reports.BAReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },

             {
                key: 'TvsAReport',
                path:  '/Sales-menu-TvsAReport',
                title: 'Target vs Actual Sales Report',
                translateKey: 'nav.Reports.TvsAReport',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             },

        
             {
                key: 'Invoices',
                path:  '/Sales-menu-Invoices',
                title: 'Invoices',
                translateKey: 'nav.Reports.Invoices',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
             }



        ]
      

    },


    {
        key: 'HRModule',
        path: '',
        title: 'HR Module',
        translateKey: 'nav.HRModule.HRModule',
        icon: 'HR',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: [],
        subMenu: [
            {
                key: 'GPSMonitoring',
                path: '/Sales-menu-GPSMonitoring',
                title: 'GPS Monitoring',
                translateKey: 'nav.Reports.GPSMonitoring',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
              
            },

            {
                key: 'Time Attendance',
                path: '/Sales-menu-TimeAttendance',
                title: 'Time Attendance',
                translateKey: 'nav.Reports.TimeAttendance',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
              
            },

        ]
    },

    





    {
        key: 'AdminModule',
        path: '',
        title: 'Admin Module',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'groupMenu',
        type: NAV_ITEM_TYPE_TITLE,
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
                key: 'MarketResearch',
                path: '',
                title: 'Market Research',
                translateKey: 'nav.HRModule.HRModule',
                icon: 'research',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [],
                subMenu: [
                    {
                        key: 'Survey',
                        path: '/Sales-menu-Survey',
                        title: 'Survey',
                        translateKey: 'nav.Reports.Survey',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [],
                        subMenu: [],
                      
                    },
                ]
            },
        
          
        ],
    },
]

export default navigationConfig
