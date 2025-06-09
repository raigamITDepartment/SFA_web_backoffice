import React from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { FormItem, Form } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { HiCheckCircle } from 'react-icons/hi'
import { toast, Alert } from '@/components/ui'
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserById, fetchAreas, fetchChannels, fetchDepartments, fetchRanges, fetchRegions, fetchTerritories, fetchUserTypes, fetchUserRoles, signupUser, SignupPayload, fetchGrades } from '@/services/singupDropdownService';
import type { CommonProps } from '@/@types/common';
import type { ZodType } from 'zod'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
    role: string
    gender: string
    region: string
    area: string
    territory: string
    range: string
    userLevel?: string
}

export type SignUpFormSchema = {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  role: number;
  subRole: number;
  userLevel: number;
  channel?: number;
  subChannel?: number;
  region?: number;
  area?: number;
  territory?: number;
  range?: number;
  departmentId?: number;
};

const validationSchema: ZodType<SignUpFormSchema> = z
 .object({
    email: z.string({ required_error: 'Please enter your email' }).email('Invalid email address'),
    userName: z.string({ required_error: 'Please enter your name' }),
    firstName: z.string({ required_error: 'Please enter your first name' }),
    lastName: z.string({ required_error: 'Please enter your last name' }),
    password: z.string({ required_error: 'Password Required' }),
    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
    mobileNumber: z.string({ required_error: 'Please enter your mobile number' }),
    role: z.number({ required_error: 'Please select your role' }),
    subRole: z.number({ required_error: 'Please select your department' }),
    userLevel: z.number({ required_error: 'Please select your user type' }),
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


function UserEdit(props: SignUpFormProps) {
    const navigate = useNavigate()
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const [subRoles, setSubRoles] = useState<any>([])
    const [territory, setTerritory] = useState<any>([])
    const [region, setRegion] = useState<any>([])
    const [channel, setChannel] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [range, setRange] = useState<any>([])
    const [userType, setUserType] = useState<any>([])
    const [userRole, setUserRole] = useState<any>([])
    const [departments, setDepartments] = useState<any>([])
    const token = sessionStorage.getItem('accessToken')
    const { disableSubmit = false, className, setMessage } = props


    const {
        watch,
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
        reset, 
    } = useForm<SignUpFormSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
        subRole: userData?.subRole || undefined,
        // other fields here
    },
    });


    const selectedSubRole = watch('subRole')
    const isSales = selectedSubRole === 7;

    console.log(selectedSubRole);

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.');
            return;
        }
        if (!id) {
            setMessage?.('No user ID found.');
            return;
        }

        const loadUserDetails = async () => {
            try {
                const userDetails = await getUserById(id)
                setUserData(userDetails);
                reset({
                    userLevel: userDetails.userLevelId, 
                    role: userDetails.roleId,        
                    userName: userDetails.userName,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                    subRole: userDetails.subRoleId,
                    region: userDetails.regionId,
                    channel: userDetails.channelId,
                    area: userDetails.areaId,
                    range: userDetails.email,
                    mobileNumber:userDetails.mobileNo
                });
            } catch (error) {
                setMessage?.('Failed to load user data.')
            }
        }

        loadUserDetails()
    }, [token, id, setMessage]);

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
        if (!token) {
            setMessage?.('No auth token found.');
            return;
        }

        const loadSubRoles = async () => {
            try {
                const subRoleOptions = await fetchGrades(token)
                setSubRoles(subRoleOptions)
            } catch (error) {
                setMessage?.('Failed to load sub roles.')
            }
        }

        loadSubRoles()
    }, [token, setMessage])

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.');
            return;
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


    console.log("user data " ,userData)


    const onSubmit = async (values: SignUpFormSchema) => {
        toast.push(
            <Alert
                className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
            >
                {/* <HiCheckCircle className="text-green-500 mb-2" size={48} /> */}
                <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                    User updated successfully!
                </div>
            </Alert>,
            {
                offsetX: 5,
                offsetY: 100,
                transitionType: 'fade',
                block: false,
                placement: 'top-end',
            }
        )
        navigate(-1)
    }

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div style={{ width: '100%', minHeight: '100vh', background: '#f9f9f9', padding: '40px 0' }}>
            <div style={{ maxWidth: 900, margin: '0 auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
                <div className="card-body" style={{ padding: 32 }}>
                    <h2 className="text-2xl font-bold mb-6">Edit User</h2>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 280 }}>
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
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 24 }}>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                                style={{ width: '50%' }}
                            >
                                {isSubmitting ? 'Updating...' : 'Update User'}
                            </Button>
                            <button
                                type="button"
                                className="w-1/2 py-2 border-2 border-red-500 text-red-600 rounded-lg bg-white font-medium
                                    transition-all duration-100 ease-in-out
                                    hover:bg-red-500 hover:text-white hover:shadow-lg "
                                onClick={handleDiscard}
                            >
                                Discard
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default UserEdit