import { lazy } from 'react'
//import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const HrRoute: Routes = [


    {
        key: 'HRModule.GPSMonitoring',
       path: '/HR-menu-GPSMonitoring',
        component: lazy(() => import('@/views/HrModule/GpsMonitoring')),
        authority: [],
    },
    {
        key: 'HRModule.TimeAttendance',
       path: '/HR-menu-TimeAttendance',
        component: lazy(() => import('@/views/HrModule/TimeAttendance')),
        authority: [],
    },
 
]

export default HrRoute