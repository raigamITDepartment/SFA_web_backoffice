import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import { HiExclamationCircle } from 'react-icons/hi'


const SessionTimeout: React.FC = () => {
    const navigate = useNavigate()
    const { signOut } = useAuth()
    const [dialogIsOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const checkSessionExpiry = () => {
            const loginTime = parseInt(sessionStorage.getItem('loginTime') || '0', 10)
            const sessionTimeout = parseInt(sessionStorage.getItem('sessionTimeout') || '0', 10)
            const now = Date.now()

            if (loginTime && sessionTimeout && now - loginTime > sessionTimeout) {
                sessionStorage.clear()
                setIsOpen(true)
                signOut() 
            }
        }
        checkSessionExpiry()
        const interval = setInterval(checkSessionExpiry, 60 * 1000)
        return () => clearInterval(interval)
    }, [signOut])

    const handleDialogOk = () => {
        setIsOpen(false)
        signOut()
    }

    return (
        <>
            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogOk}
                onRequestClose={handleDialogOk}
                closable={false}
            >
                <div className="flex flex-col items-center justify-center py-2">
                    <HiExclamationCircle className="text-4xl text-red-500 mb-2" />
                    <h5 className="mb-4">Session Expired</h5>
                    <p>
                        Session expired. Please login again.
                    </p>
                    <div className="text-right mt-6 w-full">
                        <Button variant="solid" onClick={handleDialogOk}>
                            Okay
                        </Button>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default SessionTimeout
