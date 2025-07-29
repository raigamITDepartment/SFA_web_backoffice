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
        key: 'Reports.AchItemWise',
         path:  '/Reports-menu-AchItemWise',
        component: lazy(() => import('@/views/Report/AchievementItem')),
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