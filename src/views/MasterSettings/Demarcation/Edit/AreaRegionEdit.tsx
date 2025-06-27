import React, { useState, useEffect } from 'react';
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
import {fetchAreas, fetchRegions} from '@/services/singupDropdownService'
import { getAreaById, updateArea, getAreaRegionById, updateAreaRegion } from '@/services/DemarcationService'
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

export type UpdateAreaRegionFormSchema = {
    id: number,
    userId: number;
    areaId: number | null;
    regionId: number | null;
    isActive: boolean;
};


const AreaEdit = (props: UpdateAreaRegionFormSchema) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { disableSubmit = false, className, setMessage } = props
    const [areaData, setAreaData] = useState<Area[]>([])
    const [area, setArea] = useState<any>([])
    const [region, setRegion] = useState<any>([])

    if (!id) {
        return <div>Error: ID parameter is missing</div>;
    }


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
    }, [])

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
    }, [])

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<UpdateAreaRegionFormSchema>({
    });

        useEffect(() => {
        if (!token || !id) {
            setMessage?.('Missing token or ID');
            return;
        }
        const loadChannelDetails = async () => {
            try {
                const areaRegionDetails = await getAreaRegionById(id);

                reset({
                    id:  parseInt(id),
                    userId: areaRegionDetails.userId,
                    areaId: areaRegionDetails.areaId,
                    regionId: areaRegionDetails.regionId, 
                    isActive: areaRegionDetails.isActive
                });

            } catch (error) {
                console.error(error);
                setMessage?.('Failed to load area region data.');
            }
        };

        loadChannelDetails();
    }, [token, id, setMessage]);
    

    const onSubmit = async (values: UpdateAreaRegionFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }
        if (!id) {
            setMessage?.('Missing route parameter: ID');
            return;
        }

        try {
            const payload = {
                id: parseInt(id),
                userId: userIdNumber,
                areaId: values.areaId,
                regionId: values.regionId,
                isActive: values.isActive,
            };

            await updateAreaRegion(payload, token);

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
                    <h5 className="mb-2">Area-Region update</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                         label="Area"
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

                        <h6 className="mb-2"> </h6>

                        <FormItem
                            label="Region"
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
