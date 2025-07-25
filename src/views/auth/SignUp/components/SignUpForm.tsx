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
    fetchGrades,
    fetchSubChannels,
    getTerritoriesByAreaId,
    fetchAgencies
} from '@/services/singupDropdownService'
import Dialog from '@/components/ui/Dialog'
import { HiCheckCircle } from 'react-icons/hi'
import { toast, Alert } from '@/components/ui'
import CreatableSelect from 'react-select/creatable'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
    onSuccess?: () => void
    loadUsers?: () => Promise<void>
    role: string
    gender: string
    region: string
    area: string
    territory: string
    range: string
    userLevel?: string
}

export type SignUpFormSchema = {
    email: string
    userName: string
    firstName: string
    lastName: string
    password: string
    confirmPassword: string
    mobileNo: string
    role: number
    grade: number
    userLevel: number
    channel?: number
    subChannel?: number
    region?: number
    area?: number[]
    territory?: number
    agency?: number
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
        mobileNo: z.string({
            required_error: 'Please enter your mobile number',
        }),
        role: z.number({ required_error: 'Please select your role' }),
        grade: z.number({ required_error: 'Please select your department' }),
        userLevel: z.number({ required_error: 'Please select your user type' }),
        channel: z.number().optional(),
        subChannel: z.number().optional(),
        region: z.number().optional(),
        territory: z.number().optional(),
        range: z.number().optional(),
        agency: z.number().optional(),
        area: z.number().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password not match',
        path: ['confirmPassword'],
    })

const SignUpForm = (props: SignUpFormProps) => {
    const {
    disableSubmit = false,
    className,
    setMessage,
    onSuccess,
    loadUsers,
    } = props
    const token = sessionStorage.getItem('accessToken')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [departments, setDepartments] = useState<any>([])
    const [grade, setGrade] = useState<any>([])
    const [territory, setTerritory] = useState<any>([])
    const [region, setRegion] = useState<any>([])
    const [channel, setChannel] = useState<any>([])
    const [subChannel, setSubChannel] = useState<any>([])
    const [agency, setAgency] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [range, setRange] = useState<any>([])
    const [userType, setUserType] = useState<any>([])
    const [userRole, setUserRole] = useState<any>([])
    const [successDialog, setSuccessDialog] = useState(false)
    const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
    const [territoryOptions, setTerritoryOptions] = useState<{ label: string; value: number }[]>([]);

    const { signUp } = useAuth()

    const {
        handleSubmit,
        formState: { errors },
        control,
        watch,
        reset,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
    })

    const selectedSubRole = watch('grade')
    const isSales = selectedSubRole === 13;
    const isCH = selectedSubRole === 5;
    const isSCH = selectedSubRole === 6;
    const isRSM = selectedSubRole === 7;
    const isASM = selectedSubRole === 8;
    const isASE = selectedSubRole === 9;
    const isRep = selectedSubRole === 10;
    const isAgent = selectedSubRole === 11;


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
        const loadGrades = async () => {
            try {
                const grades = await fetchGrades(token)
                setGrade(grades)
            } catch (error) {
                setMessage?.('Failed to load sub roles.')
            }
        }

        loadGrades()
    }, [token, setMessage])

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.')
            return
        }
        const loadTerritories = async () => {
            try {
                const territoryOptions = await fetchTerritories()
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
                const regionOptions = await fetchRegions()
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
                const channelOptions = await fetchChannels()
                setChannel(channelOptions)
            } catch (error) {
                setMessage?.('Failed to load channels.')
            }
        }
        loadChannel()
    }, [setMessage])

    useEffect(() => {
        const loadChannel = async () => {
            try {
                const subChannelOptions = await fetchSubChannels()
                setSubChannel(subChannelOptions)
            } catch (error) {
                setMessage?.('Failed to load sub channels.')
            }
        }
        loadChannel()
    }, [setMessage])

    useEffect(() => {
        const loadArea = async () => {
            try {
                const areaOptions = await fetchAreas()
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
                const rangeOptions = await fetchRanges()
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
                const agencyOptions = await fetchAgencies()
                setAgency(agencyOptions)
            } catch (error) {
                setMessage?.('Failed to load ranges.')
            }
        }
        loadRange()
    }, [setMessage])

    useEffect(() => {
        const loadRange = async () => {
            try {
                const userTypes = await fetchUserTypes()
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
                const userRole = await fetchUserRoles()
                setUserRole(userRole)
            } catch (error) {
                setMessage?.('Failed to load user types.')
            }
        }
        loadRange()
    }, [setMessage])

    useEffect(() => {
        const fetchTerritoriesByAreas = async () => {
            try {
                const promises = selectedAreas.map((id) => getTerritoriesByAreaId(id));
                const results = await Promise.all(promises);
                const merged = results.flat(); // flatten array of arrays
                const unique = Array.from(
                    new Map(merged.map(item => [item.value, item])).values()
                );
                setTerritoryOptions(unique);
            } catch (error) {
                console.error('Failed to load territories by areas', error);
                setMessage?.('Failed to load territories from selected areas.');
            }
        };

        if (selectedAreas.length > 0) {
            fetchTerritoriesByAreas();
        } else {
            setTerritoryOptions([]);
        }
    }, [selectedAreas]);

    const handleSignup: SubmitHandler<SignUpFormSchema> = async (data) => {
        if (isSubmitting) return // Prevent double submit
        setIsSubmitting(true)

        const payload: SignupPayload = {
            roleId: Number(data.role),
            subRoleId: Number(data.grade),
            continentId: 1,
            countryId: 1,
            channelId: data.channel ?? null,
            subChannelId: data.subChannel ?? null,
            regionId: data.region ?? null,
            areaList: Array.isArray(data.area) ? data.area.map(Number) : [],
            territoryId: data.territory ?? null,
            agencyId: null,
            userLevelId: Number(data.userLevel),
            userName: data.userName,
            firstName: data.firstName,
            lastName: data.lastName,
            perMail: data.email,
            address1: 'temp addr 1',
            address2: 'temp addr 2',
            address3: '',
            perContact: data.mobileNo,
            email: data.email,
            password: data.password,
            mobileNo: data.mobileNo,
            isActive: true,
            gpsStatus: true,
            rangeId: data.range ?? null,
            superUserId: 1,
        }

        //register new user
        try {
            const result = await signupUser(payload)

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
                reset();
                await loadUsers?.();
                onSuccess?.();
            }
        }catch (err: any) {
            let backendMessage = 'An error occurred during onboardin new user. Please try again.';

            const response = err?.response;
            const data = response?.data;

            if (data) {
                if (typeof data.payload === 'string') {
                    backendMessage = data.payload;
                } else if (typeof data.message === 'string') {
                    backendMessage = data.message;
                }
            } else if (typeof err.message === 'string') {
                backendMessage = err.message;
            }

            toast.push(
                <Alert
                    showIcon
                    type="danger"
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {backendMessage}
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                },
            );
        } finally {
        setIsSubmitting(false)
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
                            invalid={Boolean(errors.mobileNo)}
                            errorMessage={errors.mobileNo?.message}
                        >
                            <Controller
                                name="mobileNo"
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
                            invalid={Boolean(errors.grade)}
                            errorMessage={errors.grade?.message}
                            style={{ flex: 1, minWidth: 180 }}
                        >
                            <Controller
                                name="grade"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        className="mb-4"
                                        placeholder="Please Select"
                                        options={grade}
                                        value={grade.find(
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
                            invalid={Boolean(errors.userLevel)}
                            errorMessage={errors.userLevel?.message}
                            style={{ flex: 1, marginLeft: '10px' }}
                        >
                            <Controller
                                name="userLevel"
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

                        {(isSales || isCH || isSCH || isRSM || isASM || isASE || isRep || isAgent || isAgent) &&  (
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

                        {(isSales || isSCH || isRSM || isASM || isASE || isRep || isAgent) && (
                            <FormItem
                                label="Select Sub Channel "
                                invalid={Boolean(errors.subChannel)}
                                errorMessage={errors.subChannel?.message}
                                style={{ flex: 1, marginLeft: '10px' }}
                            >
                                <Controller
                                    name="subChannel"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select Channel"
                                            options={subChannel}
                                            value={subChannel.find(
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

                        {(isSales || isRSM || isASM || isASE || isRep || isAgent) && (
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

                        {(isSales || isASM || isASE || isRep || isAgent) && (
                            <FormItem
                                label="Multi Select Area"
                                invalid={Boolean(errors.area)}
                                errorMessage={errors.area?.message}
                            >
                                <Controller
                                    name="area"
                                    control={control}
                                    render={({ field }) =>
                                        <Select
                                            isMulti
                                            componentAs={CreatableSelect}
                                            options={area}
                                            value={area.filter(
                                                (option: { value: number }) =>
                                                    Array.isArray(field.value)
                                                        ? field.value.includes(option.value)
                                                        : false
                                            )}
                                            onChange={(selected) => {
                                                const ids = Array.isArray(selected) ? selected.map((opt) => opt.value) : [];
                                                field.onChange(ids);
                                                setSelectedAreas(ids);
                                            }}
                                        />
                                    }
                                />
                            </FormItem>
                        )} 

                        
                        {(isSales || isRep || isAgent) && (

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

                        {(isSales || isRep || isAgent) && (
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
                                            options={territoryOptions}
                                            value={territoryOptions.find(option => option.value === Number(field.value))}
                                            onChange={(option) => field.onChange(option?.value)}
                                        />
                                    )}
                                />
                            </FormItem>
                        )}

                        {(isSales || isAgent) && (
                            <FormItem
                                label="Select Agency"
                                invalid={Boolean(errors.agency)}
                                errorMessage={errors.agency?.message}
                                style={{ flex: 1, marginLeft: '10px' }}
                            >
                                <Controller
                                    name="agency"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            size="sm"
                                            className="mb-4"
                                            placeholder="Please Select agency"
                                            options={agency}
                                            value={agency.find(
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
                            disabled={isSubmitting}
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
