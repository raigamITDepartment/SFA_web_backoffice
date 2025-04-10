import { CONCEPTS_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { NavigationTree } from '@/@types/navigation'

const HrModulenavigationconfig: NavigationTree[] = [

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




]
export default HrModulenavigationconfig    