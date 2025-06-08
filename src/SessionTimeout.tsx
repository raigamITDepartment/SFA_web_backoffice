import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'


const SessionTimeout: React.FC = () => {
    const navigate = useNavigate()
    const { signOut } = useAuth()

    useEffect(() => {
        const checkSessionExpiry = () => {
            const loginTime = parseInt(sessionStorage.getItem('loginTime') || '0', 10)
            const sessionTimeout = parseInt(sessionStorage.getItem('sessionTimeout') || '0', 10)
            const now = Date.now()

            if (loginTime && sessionTimeout && now - loginTime > sessionTimeout) {
                sessionStorage.clear()
                alert('Session expired. Please login again.')
                signOut()
            }
        }

        const interval = setInterval(checkSessionExpiry, 60 * 1000)
        return () => clearInterval(interval)
    }, [signOut])

    return null
}

export default SessionTimeout
