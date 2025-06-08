import { lazy } from 'react'
//import { USER_PREFIX_PATH } from '@/constants/route.constant'
//import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'


const UserRoute: Routes = [
    {
        key: 'UserModule.ModifiyUser',
        path: '/User-menu-ModifiyUser',
        component: lazy(() => import('@/views/auth/SignUp/SignUp')),
        authority: [],
        meta: {
            allowedRoles: ['System Admin'],
            allowedSubRoles: ['Admin'],
        },
    },

    {
        key: 'UserModule.BookingReverse',
        path: '/Admin-menu-BookingReverse',
        component: lazy(() => import('@/views/Admin/BookingReverse')),
        authority: [],
    },
   

    
    {
        key: 'UserModule.AcutualReverse',
        path: '/Admin-menu-AcutualReverse',
        component: lazy(() => import('@/views/Admin/ActualReverse')),
        authority: [],
    },

    {
        key: 'UserModule.EditUser',
        path: '/users/:id/edit',
        component: lazy(() => import('@/views/auth/SignUp/components/UserEdit')),
        authority: [],
    },


]

export default UserRoute