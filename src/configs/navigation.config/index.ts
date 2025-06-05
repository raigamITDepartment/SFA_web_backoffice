
import Masternavigationconfig from './Master.navigation.config'
import Salesnavigationconfig from './Sales.navigation.config'
import Outletnavigationconfig from './Outlet.navigation.config'
import AdminModuleNavigationConfig from './AdminModule.navigation.config'
import Reportnavigationconfig from './Report.navigation.config'
import HrModulenavigationconfig from './HrModule.navigation.config'
import dashboardsNavigationConfig from './dashboards.navigation.config'
//import authNavigationConfig from './auth.navigation.config'
import type { NavigationTree } from '@/@types/navigation'
import AgancyModulenavigationconfig from './AgancyModule.navigation.config'


const navigationConfig: NavigationTree[] = [
    // {
    //     key: 'Dashboard',
    //     path: '/home',
    //     title: 'Dashboard',
    //     translateKey: 'nav.home',
    //     icon: 'groupCollapseMenu',
    //     type: NAV_ITEM_TYPE_ITEM,
    //     authority: [],
    //     subMenu: [],
    // },
    /** Example purpose only, please remove */
   //...authNavigationConfig,
   ...dashboardsNavigationConfig,
   ...Masternavigationconfig,
   ...Salesnavigationconfig,
   ...Outletnavigationconfig,
    ...Reportnavigationconfig,
   ...HrModulenavigationconfig,
   ...AdminModuleNavigationConfig,
   ...AgancyModulenavigationconfig
   
   
   




    





     
]

export default navigationConfig
