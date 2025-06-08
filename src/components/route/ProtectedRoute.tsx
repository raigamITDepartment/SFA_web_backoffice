import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { getUserRole, getUserSubRole } from '@/utils/helpers/authHelpers'

interface ProtectedRouteProps {
    children?: React.ReactNode
    allowedRoles?: string[]
    allowedSubRoles?: string[]
}

const { unAuthenticatedEntryPath } = appConfig

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = [],
    allowedSubRoles = [],
}) => {
    const { authenticated } = useAuth()
    const location = useLocation()

    const userRole = getUserRole()
    const userSubRole = getUserSubRole()

    // If not authenticated, redirect to login with ?redirect
    if (!authenticated) {
        const redirectQuery =
            location.pathname === '/' ? '' : `?${REDIRECT_URL_KEY}=${location.pathname}`
        return <Navigate replace to={`${unAuthenticatedEntryPath}${redirectQuery}`} />
    }

    // If not authorized, redirect to /unauthorized
    const hasRoleAccess =
        allowedRoles.length === 0 || allowedRoles.includes(userRole ?? '')
    const hasSubRoleAccess =
        allowedSubRoles.length === 0 || allowedSubRoles.includes(userSubRole ?? '')

    if (!hasRoleAccess || !hasSubRoleAccess) {
        return <Navigate replace to="/unauthorized" />
    }

    // Render children or nested routes
    return <>{children ? children : <Outlet />}</>
}

export default ProtectedRoute
