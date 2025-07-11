import { useRef, useImperativeHandle } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/Store/authStore'
import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@/@types/auth'
import type { ReactNode, Ref } from 'react'
import type { NavigateFunction } from 'react-router-dom'


type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = ({ ref }: { ref: Ref<IsolatedNavigatorRef> }) => {
    const navigate = useNavigate()
    useImperativeHandle(ref, () => {
        return {
            navigate,
        }
    }, [navigate])
    return <></>
}

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser(
        (state) => state.setSessionSignedIn,
    )
    const { token, setToken } = useToken();
    const loginTime = new Date().getTime(); 
    const sessionTimeout = 60 * 60 * 1000;

    const authenticated = Boolean(token && signedIn)
    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    const redirect = () => {
        const search = window.location.search
        const params = new URLSearchParams(search)
        const redirectUrl = params.get(REDIRECT_URL_KEY)
        navigatorRef.current?.navigate(
            redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath,
        )
    }

    const handleSignIn = (tokens: Token, user?: User) => {
        setToken(tokens.accessToken)
        setSessionSignedIn(true)
        if (user) {
            setUser(user)
        }
    }

    const handleSignOut = () => {
        setToken('')
        setUser({})
        setSessionSignedIn(false)
    }

    const signIn = async (values: SignInCredential): Promise<AuthResult> => {
        try {
            const resp = await apiSignIn(values);
            console.log('apiSignIn response:', resp);

            if (resp && resp.payload?.token) {
                const { token, ...user } = resp.payload;

                // Save token in localStorage
                sessionStorage.setItem('accessToken', token);
                sessionStorage.setItem('loginTime', loginTime.toString());
                sessionStorage.setItem('sessionTimeout', sessionTimeout.toString());

                sessionStorage.setItem('role', user.role);
                sessionStorage.setItem('userId', user.userId.toString());
                sessionStorage.setItem('subRole', user.subRole);
                sessionStorage.setItem('user', JSON.stringify(user));

                console.log('token',token);
                console.log('User from API:', user);


                // Call sign-in handler
                handleSignIn({ accessToken: token }, user);

                redirect();
                return { status: 'success', message: '' };
            }

            return { status: 'failed', message: 'Unable to sign in' };
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };


    const signUp = async (values: SignUpCredential): Promise<AuthResult> => {
        try {
            const resp = await apiSignUp(values)
            console.log('apiSignUp response:', resp)
            if (resp && resp.token) {
                localStorage.setItem('authToken', resp.token)
                handleSignIn({ accessToken: resp.token }, resp.user)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Unable to sign up' }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            }
        }
    }

    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            sessionStorage.clear()
            localStorage.clear() 
            handleSignOut()
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath)
        }
    }

    const oAuthSignIn = (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => {
        callback({
            onSignIn: handleSignIn,
            redirect,
        })
    }

    return (
        <AuthContext.Provider
            value={{
                authenticated,
                user,
                signIn,
                signUp,
                signOut,
                oAuthSignIn,
            }}
        >
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

export default AuthProvider