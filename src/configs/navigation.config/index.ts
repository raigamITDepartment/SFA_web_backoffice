import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'
import Masternavigationconfig from './Master.navigation.config'
import Salesnavigationconfig from './Sales.navigation.config'
import Outletnavigationconfig from './Outlet.navigation.config'
import AdminModuleNavigationConfig from './AdminModule.navigation.config'
import Reportnavigationconfig from './Report.navigation.config'
import HrModulenavigationconfig from './HrModule.navigation.config'
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
    ...Reportnavigationconfig,
   ...HrModulenavigationconfig,
   ...AdminModuleNavigationConfig,
   




    





     
]

export default navigationConfig
