import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, Alert, toast } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { useNavigate } from 'react-router-dom'
import { getRegionById, updateRegion} from '@/services/DemarcationService'
import {fetchChannels, fetchSubChannels} from '@/services/singupDropdownService'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { useParams } from 'react-router-dom';

type FormSchema = {
    country: string
    channelName: string
    channelCode?: string
    isActive: boolean
}

interface RegionEdit {
    channelCode: string
    channelName: string
    isActive?: boolean
}

export type UpdateRegionFormSchema = {
    id: number;
    subChannelId: number | null;
    channelId: number | null;
    userId: number;
    regionName: string;
    regionCode: string;
    isActive: boolean;
};

const validationSchema: ZodType<UpdateRegionFormSchema> = z.object({
    id: z.number(),
    userId: z.number(),
    subChannelId: z.number().nullable(),
    channelId: z.number().nullable(),
    regionName: z.string().min(1, 'Area name is required'),
    regionCode: z.string().min(1, 'Area code is required'),
    isActive: z.boolean(),
});

const RegionEdit = (props: UpdateRegionFormSchema) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [subChannel, setSubChannel] = useState<any>([])
    const { disableSubmit = false, className, setMessage } = props
    const [channel, setChannel] = useState<any>([])
    const [regionData, setRegionData] = useState<any[]>([])

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
        const loadChannel = async () => {
            try {
                const subChannelOptions = await fetchSubChannels(token)
                setSubChannel(subChannelOptions)
            } catch (error) {
                setMessage?.('Failed to load sub channels.')
            }
        }
        loadChannel()
    }, [setMessage])

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset
    } = useForm<UpdateRegionFormSchema>({
          resolver: zodResolver(validationSchema),
          defaultValues: {
              userId: userIdNumber,
              channelId: null,
              subChannelId: null,
              regionName: '',
              regionCode: '',
              isActive: true,
          },
    })

    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.');
            return;
        }
        if (!id) {
            setMessage?.('No user ID found.');
            return;
        }

        const loadAreaDetails = async () => {
            try {
                const regionDetails = await getRegionById(id)
                setRegionData(regionDetails);

                reset({
                    id: regionDetails.id,
                    userId: userIdNumber,
                    channelId: regionDetails.channelId ?? null,
                    subChannelId: regionDetails.subChannelId ?? null,
                    regionCode: regionDetails.regionCode ?? '',
                    regionName: regionDetails.regionName ?? '',
                    isActive: regionDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load area data.');
            }
        };


        loadAreaDetails()
    }, [token, id, setMessage]);

    const onSubmit = async (values: UpdateRegionFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: parseInt(id),
                subChannelId: values.subChannelId,
                channelId: values.channelId ,
                userId: userIdNumber,
                regionName: values.regionName,
                regionCode: values.regionCode,
                isActive: values.isActive,
            };

            await updateRegion(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Region updated successfully!
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
            console.error('Failed to update Region:', error);
            setMessage?.(error.message || 'Failed to update Region');
        }
    };

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Region update</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            invalid={Boolean(errors.channelId)}
                            errorMessage={errors.channelId?.message}
                        >
                            <Controller
                                name="channelId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Channel"
                                        options={channel}
                                        value={channel.find(option => option.value === field.value) || null}
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
                            invalid={Boolean(errors.subChannelId)}
                            errorMessage={errors.subChannelId?.message}
                        >
                            <Controller
                                name="subChannelId"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Sub Channel"
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
                            invalid={Boolean(errors.regionCode)}
                            errorMessage={errors.regionCode?.message}
                        >
                            <Controller
                                name="regionCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Region Code"
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
                            invalid={Boolean(errors.regionName)}
                            errorMessage={errors.regionName?.message}
                        >
                            <Controller
                                name="regionName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Region Name"
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

export default RegionEdit
