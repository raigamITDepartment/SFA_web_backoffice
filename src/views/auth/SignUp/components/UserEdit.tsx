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

const validationSchema = z
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

function UserEdit() {
    const navigate = useNavigate()

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        watch,
    } = useForm<SignUpFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {},
    })

    const selectedDepartment = watch('department')
    const isSales = selectedDepartment?.label?.toLowerCase() === 'sales'

    const onSubmit = async (values: SignUpFormSchema) => {
        // ...your update logic here...
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
                            <div style={{ flex: 1, minWidth: 280 }}>
                                <FormItem
                                    label="Role"
                                    invalid={Boolean(errors.role)}
                                    errorMessage={errors.role?.message}
                                >
                                    <Controller
                                        name="role"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                size="sm"
                                                className="mb-4"
                                                placeholder="Please Select"
                                                options={[]}
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Department"
                                    invalid={Boolean(errors.department)}
                                    errorMessage={errors.department?.message}
                                >
                                    <Controller
                                        name="department"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                size="sm"
                                                className="mb-4"
                                                placeholder="Please Select"
                                                options={[]}
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    label="User Type"
                                    invalid={Boolean(errors.userType)}
                                    errorMessage={errors.userType?.message}
                                >
                                    <Controller
                                        name="userType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                size="sm"
                                                className="mb-4"
                                                placeholder="Please Select User Type"
                                                options={[]}
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                {isSales && (
                                    <>
                                        <FormItem
                                            label="Select Region"
                                            invalid={Boolean(errors.region)}
                                            errorMessage={errors.region?.message}
                                        >
                                            <Controller
                                                name="region"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        size="sm"
                                                        className="mb-4"
                                                        placeholder="Please Select Region"
                                                        options={[]}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Select Channel "
                                            invalid={Boolean(errors.channel)}
                                            errorMessage={errors.channel?.message}
                                        >
                                            <Controller
                                                name="channel"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        size="sm"
                                                        className="mb-4"
                                                        placeholder="Please Select Channel"
                                                        options={[]}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Select Area"
                                            invalid={Boolean(errors.area)}
                                            errorMessage={errors.area?.message}
                                        >
                                            <Controller
                                                name="area"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        size="sm"
                                                        className="mb-4"
                                                        placeholder="Please Select"
                                                        options={[]}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Select Territory"
                                            invalid={Boolean(errors.territory)}
                                            errorMessage={errors.territory?.message}
                                        >
                                            <Controller
                                                name="territory"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        size="sm"
                                                        className="mb-4"
                                                        placeholder="Please Select Area"
                                                        options={[]}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                        <FormItem
                                            label="Select Range "
                                            invalid={Boolean(errors.range)}
                                            errorMessage={errors.range?.message}
                                        >
                                            <Controller
                                                name="range"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        size="sm"
                                                        className="mb-4"
                                                        placeholder="Please Select Range"
                                                        options={[]}
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </FormItem>
                                    </>
                                )}
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
                                    transition-all duration-300 ease-in-out
                                    hover:bg-red-500 hover:text-white hover:shadow-lg hover:scale-105 active:scale-95"
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