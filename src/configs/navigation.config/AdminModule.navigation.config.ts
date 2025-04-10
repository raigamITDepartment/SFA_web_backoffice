// Removed unused import: CONCEPTS_PREFIX_PATH
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_COLLAPSE,
    NAV_ITEM_TYPE_ITEM,
} from '@/constants/navigation.constant'
// Removed unused imports: ADMIN, USER
import type { NavigationTree } from '@/@types/navigation'

const AdminModuleNavigationConfig: NavigationTree[] = [
  
   
    {
        key: 'AdminModule',
        path: '',
        title: 'Admin Module',
        translateKey: 'nav.groupMenu.groupMenu',
        icon: 'groupMenu',
        type: NAV_ITEM_TYPE_COLLAPSE,
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
export default AdminModuleNavigationConfig