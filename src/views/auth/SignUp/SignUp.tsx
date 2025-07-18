import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './components/SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/Store/themeStore'
import { useEffect, useState } from 'react'
import UserTable from './components/UserTable'
import { fetchUsers } from '@/services/singupDropdownService'

type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const mode = useThemeStore((state) => state.mode)
    const [users, setUsers] = useState<any[]>([])

    const loadUsers = async () => {
            try {
                const res = await fetchUsers()
                setUsers(res)
            } catch (err) {
                console.error('Failed to load users:', err)
            }
        }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <>
            <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    imgClass="mx-auto"
                    logoWidth={60}
                />
            </div>
            <div className="mb-8">
                <h3 className="mb-1">Sign Up</h3>
                <p className="font-semibold heading-text">Add/Modify User</p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <div className="flex flex-col lg:flex-row justify-between items-start w-full">
                {/* Left Column (4/12 width) */}
                <div className="w-full lg:w-2/5 mb-4 lg:mb-0 lg:mr-4">
                    <SignUpForm
                        disableSubmit={disableSubmit}
                        setMessage={setMessage}
                        onSuccess={loadUsers}
                        role="defaultRole"
                        gender="defaultGender"
                        region="defaultRegion"
                        area="defaultArea"
                        territory="defaultTerritory"
                        range="defaultRange"
                    />
                </div>

                {/* Right Column (8/12 width) */}
                <div className="w-full lg:w-3/5 mt-1 lg:mt-0">
                    <UserTable users={users} />
                </div>
            </div>
        </>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
