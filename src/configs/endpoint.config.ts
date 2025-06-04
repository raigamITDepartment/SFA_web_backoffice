import {AuthService_URL} from './Config'

export const apiPrefix = '/api'

const endpointConfig = {
    signIn: `${AuthService_URL}/api/v1/auth/login`, 
    signOut: '/sign-out',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
}

export default endpointConfig
