import { lazy } from 'react'
//import { USER_PREFIX_PATH } from '@/constants/route.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'


    const ReportRoute : Routes = [
    {
        key: 'Reports.BookingReport',
        path: '/Reports-menu-BookingReport',
        component: lazy(() => import('@/views/Report/BookingReport')),
        authority: [],
    },
    {
        key: 'Reports.acutalReport',
        path:  '/Reports-menu-acutalReport',
        component: lazy(() => import('@/views/Report/ActualReport ')),
        authority: [],
    },
   

   {
        key: 'Reports.Achievement',
         path:  '/Reports-menu-Achievement',
        component: lazy(() => import('@/views/Report/Achievement/Acievement')),
        authority: [],
    },

    {
        key: 'Reports.AchievementTerritory',
         path:  '/Reports-menu-AchievementTerritory',
        component: lazy(() => import('@/views/Report/Achievement/Territory/AchievementTerritory')),
        authority: [],
    },

    {
        key: 'Reports.AchievementArea',
         path:  '/Reports-menu-AchievementArea',
        component: lazy(() => import('@/views/Report/Achievement/Area/AchievementArea')),
        authority: [],
    },
    {
        key: 'Reports.AchievementShop',
         path:  '/Reports-menu-AchievementShop',
        component: lazy(() => import('@/views/Report/Achievement/Shop/AchievementShop')),
        authority: [],
    },
   
 
  
   

  {
        key: 'Reports.BAReport',
        path:  '/Reports-menu-BAReport',
        component: lazy(() => import('@/views/Report/BookingandActual')),
        authority: [],
    },
   
  {
        key: 'Reports.TvsAReport',
      path:  '/Reports-menu-TvsAReport',
        component: lazy(() => import('@/views/Report/TargetwiseActual')),
        authority: [],
    },
   
   {
        key: 'Reports.Invoices',
        path:  '/Reports-menu-Invoices',
        component: lazy(() => import('@/views/Report/Invoices')),
        authority: [],
    },
   

   

   
   

]

export default ReportRoute