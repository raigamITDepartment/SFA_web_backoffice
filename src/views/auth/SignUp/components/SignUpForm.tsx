import { useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import { useAuth } from '@/auth'
import Select from '@/components/ui/Select'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import type { CommonProps } from '@/@types/common'
import axios from 'axios'
import {
    fetchAreas,
    fetchChannels,
    fetchDepartments,
    fetchRanges,
    fetchRegions,
    fetchTerritories,
    fetchUserTypes,
    fetchUserRoles,
    signupUser,
    SignupPayload,
} from '@/services/singupDropdownService'
import Dialog from '@/components/ui/Dialog'
import { HiCheckCircle } from 'react-icons/hi'
import { toast, Alert } from '@/components/ui'

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

export type SignUpFormSchema = {
    email: string
    userName: string
    firstName: string
    lastName: string
    password: string
    confirmPassword: string
    mobileNumber: string
    role: number
    department: number
    userType: number
    channel?: number
    subChannel?: number
    region?: number
    area?: number
    territory?: number
    range?: number
}

const validationSchema: ZodType<SignUpFormSchema> = z
    .object({
        email: z
            .string({ required_error: 'Please enter your email' })
            .email('Invalid email address'),
        userName: z.string({ required_error: 'Please enter your name' }),
        firstName: z.string({ required_error: 'Please enter your first name' }),
        lastName: z.string({ required_error: 'Please enter your last name' }),
        password: z.string({ required_error: 'Password Required' }),
        confirmPassword: z.string({
            required_error: 'Please confirm your password',
        }),
        mobileNumber: z.string({
            required_error: 'Please enter your mobile number',
        }),
        role: z.number({ required_error: 'Please select your role' }),
        department: z.number({
            required_error: 'Please select your department',
        }),
        userType: z.number({ required_error: 'Please select your user type' }),
        channel: z.number().optional(),
        subChannel: z.number().optional(),
        region: z.number().optional(),
        area: z.number().optional(),
        territory: z.number().optional(),
        range: z.number().optional(),
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
    const isSales = selectedDepartment === 2

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.')
            return
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
        if (!token) {
            setMessage?.('No auth token found.')
            return
        }

        const loadTerritories = async () => {
            try {
                const territoryOptions = await fetchTerritories(token)
                setTerritory(territoryOptions)
            } catch (error) {
                setMessage?.('Failed to load territories.')
            }
        }
        loadTerritories()
    }, [token, setMessage])

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

    const handleSignup: SubmitHandler<SignUpFormSchema> = async (data) => {
        console.log('handleSignup called with:', data)
        const payload: SignupPayload = {
            roleId: Number(data.role),
            departmentId: Number(data.department),
            continentId: 1, // Set defaults or collect these via form
            countryId: null,
            channelId: data.channel ? Number(data.channel) : null,
            subChannelId: data.subChannel ? Number(data.subChannel) : null,
            regionId: data.region ? Number(data.region) : null,
            areaId: data.area ? Number(data.area) : null,
            territoryId: data.territory ? Number(data.territory) : null,
            agencyId: null,
            userTypeId: Number(data.userType),
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            perMail: '', // default or collect from form
            address1: '',
            address2: '',
            address3: '',
            perContact: '',
            email: data.email,
            password: data.password,
            mobileNo: data.mobileNumber,
            isActive: true, // or use a form checkbox if needed
            gpsStatus: true,
            superUserId: 0, // adjust if required
        }

        try {
            const result = await signupUser(payload)
            console.log('Signup success:', result)

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else {
                toast.push(
                    <Alert
                        showIcon
                        type="success"
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                    >
                        <HiCheckCircle
                            className="text-green-500 mb-2"
                            size={48}
                        />
                        <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                            User created successfully!
                        </div>
                    </Alert>,
                    {
                        offsetX: 5,
                        offsetY: 100,
                        transitionType: 'fade',
                        block: false,
                        placement: 'top-end',
                    },
                )
            }
        } catch (err: any) {
            console.error('Signup failed:', err.message)
            setMessage?.('An error occurred during signup. Please try again.')
        }
    }

    return (
        <div
            className={className}
            style={{ maxWidth: '500px', marginLeft: '0 auto' }}
        >
            <div className="card">
                <div className="card-body">
                    <form
                        onSubmit={handleSubmit(
                            (data) => {
                                console.log('Form data:', data)
                                handleSignup(data)
                            },
                            (err) => {
                                console.log('Form validation errors:', err)
                            },
                        )}
                    >
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
                                        value={userRole.find(
                                            (option: { value: number }) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(
                                            option: {
                                                label: string
                                                value: number
                                            } | null,
                                        ) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Grade"
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
                                        value={departments.find(
                                            (option: { value: number }) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(
                                            option: {
                                                label: string
                                                value: number
                                            } | null,
                                        ) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem
                            label="Access Level"
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
                                        value={userType.find(
                                            (option: { value: number }) =>
                                                option.value === field.value,
                                        )}
                                        onChange={(
                                            option: {
                                                label: string
                                                value: number
                                            } | null,
                                        ) => field.onChange(option?.value)}
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
                                            value={region.find(
                                                (option: { value: number }) =>
                                                    option.value ===
                                                    Number(field.value),
                                            )}
                                            onChange={(
                                                option: {
                                                    label: string
                                                    value: number
                                                } | null,
                                            ) => field.onChange(option?.value)}
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
                                            value={channel.find(
                                                (option: { value: number }) =>
                                                    option.value ===
                                                    Number(field.value),
                                            )}
                                            onChange={(
                                                option: {
                                                    label: string
                                                    value: number
                                                } | null,
                                            ) => field.onChange(option?.value)}
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
                                            value={area.find(
                                                (option: { value: number }) =>
                                                    option.value ===
                                                    Number(field.value),
                                            )}
                                            onChange={(
                                                option: {
                                                    label: string
                                                    value: number
                                                } | null,
                                            ) => field.onChange(option?.value)}
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
                                            value={territory.find(
                                                (option: { value: number }) =>
                                                    option.value ===
                                                    Number(field.value),
                                            )}
                                            onChange={(
                                                option: {
                                                    label: string
                                                    value: number
                                                } | null,
                                            ) => field.onChange(option?.value)}
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
                                            value={range.find(
                                                (option: { value: number }) =>
                                                    option.value ===
                                                    Number(field.value),
                                            )}
                                            onChange={(
                                                option: {
                                                    label: string
                                                    value: number
                                                } | null,
                                            ) => field.onChange(option?.value)}
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
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignUpForm
