import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import PasswordInput from '@/components/shared/PasswordInput'
import classNames from '@/utils/classNames'
import { useAuth } from '@/auth'
import { useAppSelector, useAppDispatch } from '@/Store/Hooks'
import { 
    
    
    getBioEnabled,
    setUserName as setAsyncUserName,
    setPassword as setAsyncPassword,
    setRememberMe as setAsyncRememberMe,
    getRememberMe as getAsyncRememberMe,
    getUserName as getAsyncUserName,
    getPassword as getAsyncPassword,
    setToken as setAsyncToken,
    getToken as getAsyncToken,


} from '../../../../services/AsyncStoreService'
//import { loginUser } from '../../../../actions/UserAction'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { NavigationProp } from '@react-navigation/native'
import type { ReactNode } from 'react'
import { Navigation } from 'yet-another-react-lightbox/*'

interface SignInFormProps extends CommonProps {
    disableSubmit?: boolean
    passwordHint?: string | ReactNode
    setMessage?: (message: string) => void
    navigation: NavigationProp<any, any>;
}



type SignInFormSchema = {
    email: string
    password: string
}
const [loginButtonPressed, setLoginButtonPressed] = useState(false);
const userLoginResponse = useAppSelector((state) => state.login.user);
const [verifiedByUserNameAndPassword, setVerifiedByUserNameAndPassword,] = useState(false);

const dispatch = useAppDispatch();

const validationSchema: ZodType<SignInFormSchema> = z.object({
    email: z
        .string({ required_error: 'Please enter your email' })
        .min(1, { message: 'Please enter your email' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(1, { message: 'Please enter your password' }),
})

const SignInForm = (props: SignInFormProps) => {
    const { setError } = useFormContext(); // Add this line to get setError from the form context
    const [isSubmitting, setSubmitting] = useState<boolean>(false)

    const { disableSubmit = false, className, setMessage, passwordHint } = props

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: 'admin-01@ecme.com',
            password: '123Qwe',
        },
        resolver: zodResolver(validationSchema),
    })

    const { signIn } = useAuth()

    const onSignIn = async (values: SignInFormSchema) => {
        const { email, password } = values

        if (!disableSubmit) {
            setSubmitting(true)

            const result = await signIn({ email, password })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            }
        }

        setSubmitting(false)
    }


    useEffect(() => {verifyUserNameAndPassword(); }, []);

    const verifyUserNameAndPassword = async () => {
        setVerifiedByUserNameAndPassword(true);
        const un = await getAsyncUserName();
        const ps = await getAsyncPassword();
        const bioEnabled = (await getBioEnabled()) === "Y" ? true : false;
        if (bioEnabled && un && ps) {
         // dispatch(loginUser({ userName: un, password: ps, userTypeId: 2 }));
        }
      };
    
      useEffect(() => {
        if (userLoginResponse && userLoginResponse.loginType !== "SIGN_UP") {
          console.log(userLoginResponse);
    
          if (userLoginResponse.data && userLoginResponse.data.token) {
            if (loginButtonPressed) {
                props.navigation.navigate("Home");
              setAsyncPassword(userLoginResponse.data.password);
              setAsyncRememberMe(userLoginResponse.data.rememberMe ? "Y" : "N");
              setAsyncToken(userLoginResponse.data.token);
              props.navigation.navigate("Home");

            } else {
              if (userLoginResponse.data.termConditionAccept === true) {
                props.navigation.navigate("Home");
              } else {
                props.navigation.navigate("Home");
              }
            }
          } else if (userLoginResponse.error && userLoginResponse.error.length > 0) {
            if (loginButtonPressed) {
              let loginError = {
                type: "fieldValidation",
                message: "Login error",
              };
              setError("fieldValidation", loginError);
            }
          }
          setLoginButtonPressed(false);
        }
      }, [userLoginResponse]);

    return (
        <div className={className}>
            <Form onSubmit={handleSubmit(onSignIn)}>
                <FormItem
                    label="Username"
                     invalid={Boolean(errors.email)}
                    errorMessage={errors.email?.message}
                >
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                placeholder="Username"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Password"
                    invalid={Boolean(errors.password)}
                    errorMessage={errors.password?.message}
                    className={classNames(
                        passwordHint ? 'mb-0' : '',
                        errors.password?.message ? 'mb-8' : '',
                    )}
                >
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <PasswordInput
                                type="password"
                                placeholder="Password"
                                autoComplete="off"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                {passwordHint}
                <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
            </Form>
        </div>
    )
}

export default SignInForm
