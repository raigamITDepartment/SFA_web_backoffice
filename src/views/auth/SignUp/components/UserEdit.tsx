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
import { getUserById, updateUser } from '@/services/singupDropdownService';
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
  mobileNumber: string;
};

const validationSchema: ZodType<SignUpFormSchema> = z
 .object({
    email: z.string({ required_error: 'Please enter your email' }).email('Invalid email address'),
    userName: z.string({ required_error: 'Please enter your name' }),
    firstName: z.string({ required_error: 'Please enter your first name' }),
    lastName: z.string({ required_error: 'Please enter your last name' }),
    password: z.string({ required_error: 'Password Required' }),
    mobileNumber: z.string({ required_error: 'Please enter your mobile number' }),
  })


function UserEdit(props: SignUpFormProps) {
    const navigate = useNavigate()
    const { id } = useParams();
    const [userData, setUserData] = useState(null);
    const token = sessionStorage.getItem('accessToken')
    const { disableSubmit = false, className, setMessage } = props


    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset, 
    } = useForm<SignUpFormSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
    },
    });


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
                    userName: userDetails.userName,
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    email: userDetails.email,
                    mobileNumber:userDetails.mobileNo
                });
            } catch (error) {
                setMessage?.('Failed to load user data.')
            }
        }

        loadUserDetails()
    }, [token, id, setMessage]);


    const onSubmit = async (values: SignUpFormSchema) => {
        if (!userData || !id) {
            setMessage?.('User data or ID not loaded.');
            return;
        }

        try {
            const payload = {
                id: parseInt(id),
                userName: values.userName,
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                password: values.password,
                mobileNo: values.mobileNumber,
                isActive:  true,   
                gpsStatus:  true,
                superUserId:  1,
            };

            await updateUser(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
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
            );
            navigate(-1);
        } catch (error: any) {
            console.error('Failed to update user:', error);
            setMessage?.(error?.message || 'Failed to update user');
        }
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