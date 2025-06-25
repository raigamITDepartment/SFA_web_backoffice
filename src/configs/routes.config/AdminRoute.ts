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
        component: lazy(() => import('@/views/Admin 2/BookingReverse')),
        authority: [],
    },



    {
        key: 'UserModule.AcutualReverse',
        path: '/Admin-menu-AcutualReverse',
        component: lazy(() => import('@/views/Admin 2/ActualReverse')),
        authority: [],
    },

    {
        key: 'UserModule.EditUser',
        path: '/users/:id/edit',
        component: lazy(() => import('@/views/auth/SignUp/components/UserEdit')),
        authority: [],
    },

    {
        key: 'UserModule.ShopTransfer',
        path: '/Admin-menu-ShopTransfer',
        component: lazy(() => import('@/views/Admin 2/ShopTransfer/ShopTransfer')),
        authority: [],
    },


]

export default UserRoute