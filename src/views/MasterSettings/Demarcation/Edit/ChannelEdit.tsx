import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, Alert, toast } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { useNavigate } from 'react-router-dom'
import { getChannelById, fetchCountry, updateChannel} from '@/services/DemarcationService'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { useParams } from 'react-router-dom';


type FormSchema = {
    id: number,
    userId: number,
    country: string
    countryId: number,
    channelName: string
    channelCode?: string
    isActive: boolean
}

interface ChannelEdit {
    channelCode: string
    channelName: string
    isActive?: boolean
}

export type UpdateChannelFormSchema = {
    id: number;
    userId: number;
    countryId: number | null;
    channelName: string;
    channelCode: string;
    isActive: boolean;  
};

const validationSchema: ZodType<UpdateChannelFormSchema> = z.object({
    id: z.number(),
    userId: z.number(),
    countryId: z.number().nullable(),
    channelName: z.string().min(1, 'Channel name is required'),
    channelCode: z.string().min(1, 'Channel code is required'),
    isActive: z.boolean(),
});

const ChannelEdit = (props: UpdateChannelFormSchema) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const { disableSubmit = false, className, setMessage } = props
    const [channelData, setChannelData] = useState<any[]>([])
    const [country, setCountry] = useState<any>([])

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset
    } = useForm<UpdateChannelFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            id: 0,
            userId: userIdNumber,
            countryId: null,
            channelName: '',
            channelCode: '',
            isActive: false,
        },
    })
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const countryOptions = await fetchCountry()
                setCountry(countryOptions)
            } catch (err) {
                console.error('Failed to load countries:', err)
            }
        }
        loadUsers()
    }, [])

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.');
            return;
        }
        if (!id) {
            setMessage?.('No user ID found.');
            return;
        }

        const loadChannelDetails = async () => {
            try {
                const channelDetails = await getChannelById(id)
                setChannelData(channelDetails);

                reset({
                    id: channelDetails.id,
                    userId: userIdNumber,
                    countryId: channelDetails.countryId,
                    channelName: channelDetails.channelName ?? '',
                    channelCode: channelDetails.channelCode ?? '',
                    isActive: channelDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load channel data.');
            }
        };


        loadChannelDetails()
    }, [token, id, setMessage]);


    const onSubmit = async (values: UpdateChannelFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: id,
                countryId: values.countryId,
                userId: userIdNumber,
                channelName: values.channelName,
                channelCode: values.channelCode,
                isActive: values.isActive,
            };

            await updateChannel(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Channel updated successfully!
                    </div>
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                },
            );
            reset();
            navigate(-1);
        } catch (error: any) {
            console.error('Failed to update Channel:', error);
            setMessage?.(error.message || 'Failed to update Channel');
        }
    };

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Channel update</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            invalid={Boolean(errors.countryId)}
                            errorMessage={errors.countryId?.message}
                        >
                            <Controller
                                name="countryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Country"
                                        options={country}
                                        value={country.find(option => option.value === field.value) || null}
                                        onChange={(option) => field.onChange(option?.value ?? null)}
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
                            invalid={Boolean(errors.channelCode)}
                            errorMessage={errors.channelCode?.message}
                        >
                            <Controller
                                name="channelCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Channel Code"
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
                            invalid={Boolean(errors.channelName)}
                            errorMessage={errors.channelName?.message}
                        >
                            <Controller
                                name="channelName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Channel Name"
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
                                        : 'Update Channel'}
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

export default ChannelEdit
