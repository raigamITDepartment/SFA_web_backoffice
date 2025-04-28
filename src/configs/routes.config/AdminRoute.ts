import { lazy } from 'react'
import { USER_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'


    const UserRoute: Routes = [
    {
        key: 'UserModule.ModifiyUser',
        path: '/User-menu-ModifiyUser',
        component: lazy(() => import('@/views/auth/SignUp/SignUp')),
        authority: [],
    },
   


    {
        key: 'UserModule.BookingReverse',
        path: '/User-menu-BookingReverse',
        component: lazy(() => import('@/views/admin/BookingReverse/products/ProductList/ProductList')),
        authority: [],
    },
   

]

export default UserRoute