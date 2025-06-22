import React, { useMemo, useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, Alert, toast } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { useNavigate } from 'react-router-dom'
import {fetchAreas, fetchRanges} from '@/services/singupDropdownService'
import { getTerritoryById, updateTerritory } from '@/services/DemarcationService'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'react-router-dom';

type FormSchema = {
    country: string
    channelName: string
    channelCode?: string
    isActive: boolean
}

interface Territory {
    id: number,
    channelCode: string;
    subChannelCode: string;
    regionCode: string;
    areaCode: string;
    range: string;
    territoryCode: string;
    territoryName: string;
    isActive: boolean;
    channelName:string;
    subChannelName:string;
    regionName:string;
    rangeName:string;
    areaName:string;
}

export type UpdateTerritoryFormSchema = {
    userId: number;
    rangeId: number | null;
    areaId: number | null;
    territoryName: string;
    territoryCode: string,
    displayOrder: number,
    isActive: boolean;
};


const validationSchema: ZodType<UpdateTerritoryFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'), 
    rangeId: z.number({ required_error: 'Please select range' }),
    areaId: z.number({ required_error: 'Please select area' }),
    territoryName: z.string({ required_error: 'Territory name is required' }),
    territoryCode: z.string({ required_error: 'Territory code is required' }),
    displayOrder: z.number({ required_error: 'Display order is required' }),
    isActive: z.boolean(),
});

const TerritoryEdit = (props: UpdateTerritoryFormSchema) => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem('accessToken')
    const { id } = useParams();
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const { disableSubmit = false, className, setMessage } = props
    const [area, setArea] = useState<any>([])
    const [range, setRange] = useState<any>([])
    const [territoryData, setTerritoryData] = useState<Territory[]>([])
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

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

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset
    } = useForm<UpdateTerritoryFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: userIdNumber, 
            rangeId: null,
            areaId: null,
            territoryName: '',
            territoryCode: '',
            isActive: true,
            displayOrder: 1
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

        const loadAreaDetails = async () => {
            try {
                const territoryDetails = await getTerritoryById(id)
                setTerritoryData(territoryDetails);

                reset({
                    id: territoryDetails.id,
                    userId: userIdNumber,
                    rangeId: territoryDetails.rangeId ?? null,
                    areaId: territoryDetails.areaId ?? '',
                    territoryName: territoryDetails.territoryName ?? '',
                    territoryCode: territoryDetails.territoryCode ?? '',
                    displayOrder: territoryDetails.displayOrder ?? '',
                    isActive: territoryDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load area data.');
            }
        };


        loadAreaDetails()
    }, [token, id, setMessage]);

    const onSubmit = async (values: UpdateTerritoryFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: parseInt(id),
                rangeId: values.rangeId,
                areaId: values.areaId,
                userId: userIdNumber,
                territoryName: values.territoryName,
                territoryCode: values.territoryCode,
                displayOrder:1,
                isActive: values.isActive,
            };

            await updateTerritory(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Territory updated successfully!
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
            console.error('Failed to update Territory:', error);
            setMessage?.(error.message || 'Failed to update Territory');
        }
    };

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Territory Update</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
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
                                            value={area.find(
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
                            invalid={Boolean(errors.rangeId)}
                            errorMessage={errors.rangeId?.message}
                        >
                            <Controller
                                name="rangeId"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Range"
                                            options={range}
                                            value={range.find(
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
                            invalid={Boolean(errors.territoryCode)}
                            errorMessage={errors.territoryCode?.message}
                        >
                            <Controller
                                name="territoryCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Territory Code"
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
                            invalid={Boolean(errors.territoryName)}
                            errorMessage={errors.territoryName?.message}
                        >
                            <Controller
                                name="territoryName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Territory Name"
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
                                        : 'Update Territory'}
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

export default TerritoryEdit
