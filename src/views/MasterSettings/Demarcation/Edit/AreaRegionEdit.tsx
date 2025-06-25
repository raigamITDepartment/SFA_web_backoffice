import React, { useMemo, useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'


import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { useNavigate } from 'react-router-dom'
import { rankItem } from '@tanstack/match-sorter-utils'
import type {FilterFn} from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { Button, toast, Alert } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import {
    getAllSubChannelsByChannelId,
    getAllRegionsBySubChannelId,
    getAreaRegionById,
    getRegionById,
    updateAreaRegion
} from '@/services/DemarcationService'
import { fetchChannels, fetchAreas } from '@/services/singupDropdownService'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWatch } from 'react-hook-form'
import { useParams } from 'react-router-dom';




export type UpdateAreaRegionFormSchema = {
    userId: number;
    areaId: number | null;
    regionId: number | null;
    isActive: boolean;
    channelId?: number | null;     
    subChannelId?: number | null;   
};

const validationSchema: ZodType<UpdateAreaRegionFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'),
    areaId: z.number({ required_error: 'Please select area' }).nullable(),
    regionId: z.number({ required_error: 'Please select region' }).nullable(),
    channelId: z.number().nullable().optional(),  
    subChannelId: z.number().nullable().optional(),
    isActive: z.boolean(),
});


const Area = (props: UpdateAreaRegionFormSchema) => {
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { disableSubmit = false, className, setMessage } = props
    const [area, setArea] = useState<any>([])
    const [channel, setChannel] = useState<any>([])
    const [subChannel, setSubChannel] = useState<any>([])
    const [region, setRegion] = useState<any>([])
    

    const navigate = useNavigate()


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
        reset,
    } = useForm<UpdateAreaRegionFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: userIdNumber,
            areaId: null,
            regionId: null,
            isActive: true,
            channelId: null,  
            subChannelId: null
        },
    })

    useEffect(() => {
        if (!token || !id) {
            setMessage?.('Missing token or ID');
            return;
        }

        const loadChannelDetails = async () => {
            try {
                const areaRegionDetails = await getAreaRegionById(id);
                const regionDetails = await getRegionById(areaRegionDetails.regionId);

                const subChannelId = regionDetails.subChannelId;

                reset({
                    id: areaRegionDetails.id,
                    userId: areaRegionDetails.userId,
                    areaId: areaRegionDetails.areaId,
                    subChannelId: subChannelId, 
                    regionId: areaRegionDetails.regionId, 
                });

            } catch (error) {
                console.error(error);
                setMessage?.('Failed to load area region data.');
            }
        };

        loadChannelDetails();
    }, [token, id, reset, setMessage]);

    const selectedChannelId = useWatch({
        control,
        name: 'channelId',
    })

    useEffect(() => {
        const loadSubChannels = async () => {
            if (!selectedChannelId) {
                setSubChannel([])
                return
            }
            try {
                console.log(selectedChannelId, 'selectedChannelId')
                const subChannelOptions =
                await getAllSubChannelsByChannelId(selectedChannelId)
                setSubChannel(subChannelOptions)
                console.log(subChannel, 'sc')
            } catch (error) {
                setMessage?.('Failed to load sub channels.')
                setSubChannel([])
            }
        }

        loadSubChannels()
    }, [selectedChannelId, setMessage])

    const selectedSubChannelId = useWatch({
        control,
        name: 'subChannelId',
    })

    useEffect(() => {
        const loadRegions = async () => {
            if (!selectedSubChannelId) {
                setRegion([])
                return
            }

            try {
                const regionOptions =
                    await getAllRegionsBySubChannelId(selectedSubChannelId)
                setRegion(regionOptions)
            } catch (error) {
                setMessage?.('Failed to load regions.')
                setRegion([])
            }
        }

        loadRegions()
    }, [selectedSubChannelId, setMessage])

    const handleDiscard = () => {
        navigate(-1)
    }


    const onSubmit = async (values: UpdateAreaRegionFormSchema) => {
        console.log('clicked..!');
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: id,
                userId: userIdNumber,
                areaId: values.areaId,
                regionId: values.regionId,
                isActive: values.isActive,
            };
            console.log(payload);

            await updateAreaRegion(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Area-Region updated successfully!
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
            console.error('Failed to update Area-Region:', error);
            setMessage?.(error.message || 'Failed to update Area-Region');
        }
    };


    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Area Region Mapping Update</h5>
                    <br></br>

                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                      <h6 className="mb-2"> Step 01</h6>
                        <FormItem
                            invalid={Boolean(errors.areaId)}
                            errorMessage={errors.areaId?.message}
                        >
                            <Controller
                                name="areaId"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Area"
                                            options={area}
                                            value={area.find(option => option.value === field.value) || null}
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

                        <h6 className="mb-2"> Step 02</h6>
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
                                            value={subChannel.find(option => option.value === field.value) || null}
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
                                            value={region.find(option => option.value === field.value) || null}
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
                                        : 'Update '}
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

export default Area
