//import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, Alert, toast } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { useNavigate } from 'react-router-dom'
//import { zodResolver } from '@hookform/resolvers/zod'

type FormSchema = {
    country: string
    channelName: string
    channelCode?: string
    isActive: boolean
}

interface SubChannelEdit {
    channelCode: string
    channelName: string
    isActive?: boolean
}

const SubChannelEdit = () => {
    const navigate = useNavigate()

    // useEffect(() => {
    //     const loadUsers = async () => {
    //         try {
    //             const res = await fetchChannels()
    //             setChannelData(res)
    //         } catch (err) {
    //             console.error('Failed to load users:', err)
    //         }
    //     }
    //     loadUsers()
    // }, [])
    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
    } = useForm<FormSchema>({
        //  resolver: zodResolver(),
        defaultValues: {},
    })

    const onSubmit = async (values: FormSchema) => {
        toast.push(
            <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
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
            },
        )
        navigate(-1)
    }

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                      <h5 className="mb-2">Sub-Channel update</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            invalid={Boolean(errors.channel)}
                            errorMessage={errors.channel?.message}
                        >
                            <Controller
                                name="channel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Channel"
                                        // options={[
                                        //     { label: 'National Channel', value: 'National Channel' }as any,
                                        //     { label: 'Bakery Channel', value: 'Bakery Channel' },
                                        // ]}
                                        value={field.value}
                                        onChange={(selectedOption) =>
                                            field.onChange(selectedOption)
                                        }
                                    />
                                )}
                                rules={{
                                    validate: {
                                        required: (value) => {
                                            if (!value) {
                                                return 'Required'
                                            }
                                            return
                                        },
                                    },
                                }}
                            />
                        </FormItem>

                        <FormItem
                            invalid={Boolean(errors.subChannelCode)}
                            errorMessage={errors.subChannelCode?.message}
                        >
                            <Controller
                                name="subChannelCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Sub-Channel Code"
                                        {...field}
                                    />
                                )}
                                rules={{
                                    validate: {
                                        required: (value) => {
                                            if (!value) {
                                                return 'Required'
                                            }
                                            return
                                        },
                                    },
                                }}
                            />
                        </FormItem>

                        <FormItem
                            invalid={Boolean(errors.subChannelName)}
                            errorMessage={errors.subChannelName?.message}
                        >
                            <Controller
                                name="subChannelName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Sub-Channel Name"
                                        {...field}
                                    />
                                )}
                                rules={{
                                    validate: {
                                        required: (value) => {
                                            if (!value) {
                                                return 'Required'
                                            }
                                            return
                                        },
                                    },
                                }}
                            />
                        </FormItem>

                        <FormItem>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox {...field} checked={field.value}>
                                        IsActive
                                    </Checkbox>
                                )}
                            />
                        </FormItem>

                        <FormItem>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: 16,
                                    marginTop: 24,
                                }}
                            >
                                <Button
                                    block
                                    loading={isSubmitting}
                                    variant="solid"
                                    type="submit"
                                    style={{ width: '50%' }}
                                >
                                    {isSubmitting
                                        ? 'Updating...'
                                        : 'Update  Sub Channel'}
                                </Button>
                                <Button
                                    type="button"
                                    className="w-1/2 py-2 border-2 border-red-500 text-red-600 rounded-lg bg-white font-medium
                                                               transition-all duration-100 ease-in-out
                                                               hover:bg-red-500 hover:text-white hover:shadow-lg "
                                    onClick={handleDiscard}
                                >
                                    Discard
                                </Button>
                            </div>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        </div>
    )
}

export default SubChannelEdit
