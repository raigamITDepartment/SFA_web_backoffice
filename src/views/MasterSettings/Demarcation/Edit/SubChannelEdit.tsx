import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, Alert, toast } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import { updateSubChannel, getSubChannelById} from '@/services/DemarcationService'
import {fetchChannels} from '@/services/singupDropdownService'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'



interface SubChannelEdit {
    channelCode: string
    channelName: string
    isActive?: boolean
}

export type UpdateSubChannelFormSchema = {
    id: number;
    channelId: number | null;
    userId: number;
    subChannelName: string;
    subChannelCode: string;
    isActive: boolean;
};

const validationSchema: ZodType<UpdateSubChannelFormSchema> = z.object({
    id: z.number(),
    userId: z.number(),
    channelId: z.number().nullable(),
    subChannelName: z.string().min(1, 'Sub-channel name is required'),
    subChannelCode: z.string().min(1, 'Sub-channel code is required'),
    isActive: z.boolean(),
});

const SubChannelEdit = (props: UpdateSubChannelFormSchema) => {
    const navigate = useNavigate();
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [subChannelData, setSubChannelData] = useState(null);
    const [channel, setChannel] = useState<any>([])
    const { disableSubmit = false, className, setMessage } = props
    

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

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset,
    } = useForm<UpdateSubChannelFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            id: 0,
            userId: userIdNumber,
            channelId: null,
            subChannelName: '',
            subChannelCode: '',
            isActive: false,
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

        const loadSubChannelDetails = async () => {
            try {
                const subChannelDetails = await getSubChannelById(id)
                setSubChannelData(subChannelDetails);

                reset({
                    id: subChannelDetails.id,
                    userId: userIdNumber,
                    channelId: subChannelDetails.channelId ?? null,
                    subChannelName: subChannelDetails.subChannelName ?? '',
                    subChannelCode: subChannelDetails.subChannelCode ?? '',
                    isActive: subChannelDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load subchannel data.');
            }
        };


        loadSubChannelDetails()
    }, [token, id, setMessage]);

    const onSubmit = async (values: UpdateSubChannelFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: id,
                channelId: values.channelId,
                userId: userIdNumber,
                subChannelName: values.subChannelName,
                subChannelCode: values.subChannelCode,
                isActive: values.isActive,
            };

            await updateSubChannel(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Sub-Channel updated successfully!
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
            navigate(-1);
        } catch (error: any) {
            console.error('Failed to update sub-channel:', error);
            setMessage?.(error.message || 'Failed to update sub-channel');
        }
    };


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
                                        value={channel.find(
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
