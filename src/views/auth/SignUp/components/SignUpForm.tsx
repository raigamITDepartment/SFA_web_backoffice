import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import Select from '@/components/ui/Select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import axios from 'axios'
import { fetchAreas, fetchChannels, fetchDepartments, fetchRanges, fetchRegions, fetchTerritories, fetchUserTypes, fetchUserRoles } from '@/services/singupDropdownService'
import Dialog from '@/components/ui/Dialog'
import { HiCheckCircle } from 'react-icons/hi'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
    role: string
    gender: string
    region: string
    area: string
    territory: string
    range: string
    userType?: string
}

type SignUpFormSchema = {
    userName: string
    firstName: string
    lastName: string
    password: string
    email: string
    mobileNumber: string
    confirmPassword: string
    role: string
    department: string
    userType: string
    channel: string
    subChannel: string
    region: string
    area: string
    territory: string
    range: string
}

const validationSchema: ZodType<SignUpFormSchema> = z
    .object({
        email: z.string({ required_error: 'Please enter your email' }).email('Invalid email address'),
        userName: z.string({ required_error: 'Please enter your name' }),
        firstName: z.string({ required_error: 'Please enter your first name' }),
        lastName: z.string({ required_error: 'Please enter your last name' }),
        password: z.string({ required_error: 'Password Required' }),
        mobileNumber: z.string({ required_error: 'Mobile Number Required' }).regex(/^\d+$/, 'Mobile Number must be numeric'),
        confirmPassword: z.string({ required_error: 'Please confirm your password' }),
        role: z.string({ required_error: 'Please select your role' }),
        department: z.string({ required_error: 'Please select your department' }),
        userType: z.string({ required_error: 'Please select your user type' }),
        channel: z.string({ required_error: 'Please select your channel' }),
        subChannel: z.string({ required_error: 'Please select your sub-channel' }),
        region: z.string({ required_error: 'Please select your region' }),
        area: z.string({ required_error: 'Please select your area' }),
        territory: z.string({ required_error: 'Please select your territory' }),
        range: z.string({ required_error: 'Please select your range' }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password not match',
        path: ['confirmPassword'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, setMessage } = props
    const token = sessionStorage.getItem('accessToken')
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [departments, setDepartments] = useState<any>([])
    const [territory, setTerritory] = useState<any>([])
    const [region, setRegion] = useState<any>([])
    const [channel, setChannel] = useState<any>([])
    const [subChannel, setSubChannel] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [range, setRange] = useState<any>([])
    const [userType, setUserType] = useState<any>([])
    const [userRole, setUserRole] = useState<any>([])
    const [successDialog, setSuccessDialog] = useState(false)
    const { signUp } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const selectedDepartment = watch('department')
    const isSales = selectedDepartment?.label?.toLowerCase() === 'sales'

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.');
            return;
        }

        const loadDepartments = async () => {
            try {
                const departmentOptions = await fetchDepartments(token)
                setDepartments(departmentOptions)
            } catch (error) {
                setMessage?.('Failed to load departments.')
            }
        }

        loadDepartments()
    }, [token, setMessage])

    useEffect(() => {
        const loadTerritories = async () => {
            try {
                const territoryOptions = await fetchTerritories(token)
                setTerritory(territoryOptions)
            } catch (error) {
                setMessage?.('Failed to load territories.')
            }
        }
        loadTerritories()
    }, [setMessage])

    useEffect(() => {
        const loadRegion = async () => {
            try {
                const regionOptions = await fetchRegions(token)
                setRegion(regionOptions)
            } catch (error) {
                setMessage?.('Failed to load regions.')
            }
        }
        loadRegion()
    }, [setMessage])

    useEffect(() => {
        const loadChannel = async () => {
            try {
                const channelOptions = await fetchChannels(token)
                setChannel(channelOptions)
            } catch (error) {
                setMessage?.('Failed to load channels.')
            }
        }
        loadChannel()
    }, [setMessage])

    useEffect(() => {
        const loadArea = async () => {
            try {
                const areaOptions = await fetchAreas(token)
                setArea(areaOptions)
            } catch (error) {
                setMessage?.('Failed to load areas.')
            }
        }
        loadArea()
    }, [setMessage])

    useEffect(() => {
        const loadRange = async () => {
            try {
                const rangeOptions = await fetchRanges(token)
                setRange(rangeOptions)
            } catch (error) {
                setMessage?.('Failed to load ranges.')
            }
        }
        loadRange()
    }, [setMessage])

    
    useEffect(() => {
        const loadRange = async () => {
            try {
                const userTypes = await fetchUserTypes(token)
                setUserType(userTypes)
            } catch (error) {
                setMessage?.('Failed to load user types.')
            }
        }
        loadRange()
    }, [setMessage])

    useEffect(() => {
        const loadRange = async () => {
            try {
                const userRole = await fetchUserRoles(token)
                setUserRole(userRole)
            } catch (error) {
                setMessage?.('Failed to load user types.')
            }
        }
        loadRange()
    }, [setMessage])

    const onSignUp = async (values: SignUpFormSchema) => {
        const { userName, password, email, mobileNumber } = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await signUp({ userName, password, email })

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else {
                setSuccessDialog(true)
            }

            setSubmitting(false)
        }
    }

    return (
        <div className={className} style={{ maxWidth: '500px', marginLeft: '0 auto' }}>
            <div className="card">
                <div className="card-body">
                    <Form onSubmit={handleSubmit(onSignUp)}>
                        <FormItem
                            label="User name"
                            invalid={Boolean(errors.userName)}
                            errorMessage={errors.userName?.message}
                        >
                            <Controller
                                name="userName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        size="sm"
                                        type="text"
                                        placeholder="User Name"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="First Name"
                            invalid={Boolean(errors.firstName)}
                            errorMessage={errors.firstName?.message}
                        >
                            <Controller
                                name="firstName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        size="sm"
                                        type="text"
                                        placeholder="First Name"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Last Name"
                            invalid={Boolean(errors.lastName)}
                            errorMessage={errors.lastName?.message}
                        >
                            <Controller
                                name="lastName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        size="sm"
                                        type="text"
                                        placeholder="Last Name"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Email"
                            invalid={Boolean(errors.email)}
                            errorMessage={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="email"
                                        size="sm"
                                        placeholder="Email"
                                        autoComplete="off"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Mobile Number"
                            invalid={Boolean(errors.mobileNumber)}
                            errorMessage={errors.mobileNumber?.message}
                        >
                            <Controller
                                name="mobileNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        size="sm"
                                        type="text"
                                        placeholder="Mobile Number"
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
                        >
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        size="sm"
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Password"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Confirm Password"
                            invalid={Boolean(errors.confirmPassword)}
                            errorMessage={errors.confirmPassword?.message}
                        >
                            <Controller
                                name="confirmPassword"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        size="sm"
                                        type="password"
                                        autoComplete="off"
                                        placeholder="Confirm Password"
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Role"
                            invalid={Boolean(errors.role)}
                            errorMessage={errors.role?.message}
                            style={{ flex: 1, minWidth: 180 }}
                        >
                            <Controller
                                name="role"
                                control={control}
                                rules={{ required: 'Role is required' }}
                                render={({ field }) => (
                                   <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select Role"
                                            options={userRole}
                                            {...field}
                                        />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Department"
                            invalid={Boolean(errors.department)}
                            errorMessage={errors.department?.message}
                            style={{ flex: 1, minWidth: 180 }}
                        >
                            <Controller
                                name="department"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        className="mb-4"
                                        placeholder="Please Select"
                                        options={departments}
                                        {...field}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="User Type"
                            invalid={Boolean(errors.userType)}
                            errorMessage={errors.userType?.message}
                            style={{ flex: 1, marginLeft: '10px' }}
                        >
                            <Controller
                                name="userType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select Type"
                                            options={userType}
                                            {...field}
                                        />
                                )}
                            />
                        </FormItem>
                        {isSales && (
                            <FormItem
                                label="Select Region"
                                invalid={Boolean(errors.region)}
                                errorMessage={errors.region?.message}
                                style={{ flex: 1, marginLeft: '10px' }}
                            >
                                <Controller
                                    name="region"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select Region"
                                            options={region}
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        )}
                        {isSales && (
                            <FormItem
                                label="Select Channel "
                                invalid={Boolean(errors.channel)}
                                errorMessage={errors.channel?.message}
                                style={{ flex: 1, marginLeft: '10px' }}
                            >
                                <Controller
                                    name="channel"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select Channel"
                                            options={channel}
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        )}
                        {isSales && (
                            <FormItem
                                label="Select Area"
                                invalid={Boolean(errors.area)}
                                errorMessage={errors.area?.message}
                                style={{ flex: 1, marginLeft: '10px' }}
                            >
                                <Controller
                                    name="area"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select"
                                            options={area}
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        )}
                        {isSales && (
                            <FormItem
                                label="Select Territory"
                                invalid={Boolean(errors.territory)}
                                errorMessage={errors.territory?.message}
                                style={{ flex: 1, marginLeft: '10px' }}
                            >
                                <Controller
                                    name="territory"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select Area"
                                            options={territory}
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        )}
                        {isSales && (
                            <FormItem
                                label="Select Range "
                                invalid={Boolean(errors.range)}
                                errorMessage={errors.range?.message}
                                style={{ flex: 1, marginLeft: '10px' }}
                            >
                                <Controller
                                    name="range"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select Range"
                                            options={range}
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        )}
                        <Button
                            block
                            loading={isSubmitting}
                            variant="solid"
                            type="submit"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                        </Button>
                    </Form>
                </div>
            </div>
            {/* Success Dialog */}
            <Dialog isOpen={successDialog} onClose={() => setSuccessDialog(false)} title="Success">
                <div className="flex flex-col items-center justify-center py-6">
                    <HiCheckCircle className="text-green-500" size={48} />
                    <div className="mt-4 text-green-700 font-semibold text-lg">User created successfully!</div>
                    <Button className="mt-6" variant="solid" onClick={() => setSuccessDialog(false)}>
                        OK
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default SignUpForm