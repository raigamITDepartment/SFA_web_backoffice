import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, Alert, toast } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { useNavigate } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { ZodType } from 'zod'
import {fetchChannels, fetchRegions} from '@/services/singupDropdownService'
import { getAreaById, updateArea } from '@/services/DemarcationService'
import { useParams } from 'react-router-dom';


interface Area {
    id: number,
    channelCode: string
    subChannelCode: string
    regionCode: string
    areaCode: string
    areaName: string
    isActive: boolean
    regionName: string
}

interface AreaEdit {
    channelCode: string
    channelName: string
    isActive?: boolean
}

export type UpdateAreaFormSchema = {
    id: number;
    regionId: number | null;
    userId: number;
    areaName: string;
    areaCode: string;
    isActive: boolean;
    displayOrder: number;
};

const validationSchema: ZodType<UpdateAreaFormSchema> = z.object({
    id: z.number(),
    userId: z.number(),
    regionId: z.number().nullable(),
    areaName: z.string().min(1, 'Area name is required'),
    areaCode: z.string().min(1, 'Area code is required'),
    displayOrder: z.number({ required_error: 'Display order is required' }),
    isActive: z.boolean(),
});

const AreaEdit = (props: UpdateAreaFormSchema) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { disableSubmit = false, className, setMessage } = props
    const [subChannel, setSubChannel] = useState<any>([])
    const [channel, setChannel] = useState<any>([])
    const [region, setRegion] = useState<any>([])
    const [areaData, setAreaData] = useState<Area[]>([])

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
        formState: { errors },
        control,
        reset
    } = useForm<UpdateAreaFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: userIdNumber,
            regionId: null,
            areaName: '',
            areaCode: '',
            displayOrder:1,
            isActive: true,
        },
    });

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchRegions()
                setRegion(res)
            } catch (err) {
                console.error('Failed to load regions:', err)
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

        const loadAreaDetails = async () => {
            try {
                const areaDetails = await getAreaById(id)
                setAreaData(areaDetails);

                reset({
                    id: areaDetails.id,
                    userId: userIdNumber,
                    regionId: areaDetails.regionId ?? null,
                    areaName: areaDetails.areaName ?? '',
                    areaCode: areaDetails.areaCode ?? '',
                    displayOrder: areaDetails.displayOrder ?? '',
                    isActive: areaDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load area data.');
            }
        };


        loadAreaDetails()
    }, [token, id, setMessage]);
    

    const onSubmit = async (values: UpdateAreaFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: parseInt(id),
                regionId: values.regionId,
                userId: userIdNumber,
                areaName: values.areaName,
                areaCode: values.areaCode,
                displayOrder:1,
                isActive: values.isActive,
            };

            await updateArea(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Area updated successfully!
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
            console.error('Failed to update Area:', error);
            setMessage?.(error.message || 'Failed to update Area');
        }
    };

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Area update</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>

                        <FormItem
                              invalid={Boolean(errors.regionId)}
                            errorMessage={errors.regionId?.message}
                        >
                            <Controller
                                name="regionId"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Region"
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
                            invalid={Boolean(errors.areaCode)}
                            errorMessage={errors.areaCode?.message}
                        >
                            <Controller
                                name="areaCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Area Code"
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
                            invalid={Boolean(errors.areaName)}
                            errorMessage={errors.areaName?.message}
                        >
                            <Controller
                                name="areaName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Area Name"
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
                                        : 'Update Area'}
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

export default AreaEdit
