import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SessionTimeout: React.FC = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const checkSessionExpiry = () => {
            const loginTime = parseInt(sessionStorage.getItem('loginTime') || '0', 10)
            const sessionTimeout = parseInt(sessionStorage.getItem('sessionTimeout') || '0', 10)
            const now = Date.now()

            if (loginTime && sessionTimeout && now - loginTime > sessionTimeout) {
                sessionStorage.clear()
                alert('Session expired. Please login again.')
                navigate('/login')
            }
        }

        const interval = setInterval(checkSessionExpiry, 60 * 1000)
        return () => clearInterval(interval)
    }, [navigate])

    return null
}

export default SessionTimeout
