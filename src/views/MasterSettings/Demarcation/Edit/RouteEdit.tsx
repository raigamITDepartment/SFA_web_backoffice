import React, { useState, useEffect } from 'react';
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Card from '@/components/ui/Card'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { Button, Alert, toast } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { useNavigate } from 'react-router-dom'
import { getRouteById, updateRoute} from '@/services/DemarcationService'
import Dialog from '@/components/ui/Dialog'
import {fetchTerritories} from '@/services/singupDropdownService'
import { useWatch } from 'react-hook-form';
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

interface RouteEdit {
    channelCode: string
    channelName: string
    isActive?: boolean
}

interface Route {
    id: number,
    channelCode: string;
    subChannelCode: string;
    regionCode: string;
    areaCode: string;
    territoryCode: string;
    routeCode: string;
    routeName: string;
    isActive: boolean;
    territoryName:string;
}

export type UpdateRouteFormSchema = {
    userId: number;
    territoryId: number | null;
    routeName: string;
    routeCode: string,
    displayOrder: number,
    isActive: boolean;
};


const validationSchema: ZodType<UpdateRouteFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'), 
    territoryId: z.number({ required_error: 'Please select territory' }),
    routeName: z.string({ required_error: 'Route name is required' }),
    routeCode: z.string({ required_error: 'Route code is required' }),
    displayOrder: z.number({ required_error: 'Display order is required' }),
    isActive: z.boolean(),
});

const RouteEdit = (props: UpdateRouteFormSchema) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const { disableSubmit = false, className, setMessage } = props
    const [territory, setTerritory] = useState<any>([])
    const [routeData, setRouteData] = useState<Route[]>([])


    useEffect(() => {
        if (!token) {
            setMessage?.('No auth token found.')
            return
        }
        const loadTerritories = async () => {
            try {
                const territoryOptions = await fetchTerritories(token)
                setTerritory(territoryOptions)
            } catch (error) {
                setMessage?.('Failed to load territories.')
            }
        }
        loadTerritories()
    }, [token, setMessage])

    const {
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        reset
    } = useForm<UpdateRouteFormSchema>({
        //  resolver: zodResolver(),
        defaultValues: {},
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
                const routeDetails = await getRouteById(id)
                setRouteData(routeDetails);

                reset({
                    id: routeDetails.id,
                    userId: userIdNumber,
                    territoryId: routeDetails.territoryId ?? null,
                    routeName: routeDetails.routeName ?? '',
                    routeCode: routeDetails.routeCode ?? '',
                    displayOrder: routeDetails.displayOrder ?? '',
                    isActive: routeDetails.isActive ?? false,
                });
            } catch (error) {
                setMessage?.('Failed to load area data.');
            }
        };


        loadAreaDetails()
    }, [token, id, setMessage]);
    

    const onSubmit = async (values: UpdateRouteFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: parseInt(id),
                territoryId: values.territoryId,
                userId: userIdNumber,
                routeName: values.routeName,
                routeCode: values.routeCode,
                displayOrder:1,
                isActive: values.isActive,
            };

            await updateRoute(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Route updated successfully!
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
            console.error('Failed to update Route:', error);
            setMessage?.(error.message || 'Failed to update Route');
        }
    };

    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                     <h5 className="mb-2">Route Update</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>      
                        <FormItem
                            invalid={Boolean(errors.territoryId)}
                            errorMessage={errors.territoryId?.message}
                        >
                            <Controller
                                name="territoryId"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Territory"
                                            options={territory}
                                            value={territory.find(
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
                            invalid={Boolean(errors.routeCode)}
                            errorMessage={errors.routeCode?.message}
                        >
                            <Controller
                                name="routeCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Route Code"
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
                            invalid={Boolean(errors.routeName)}
                            errorMessage={errors.routeName?.message}
                        >
                            <Controller
                                name="routeName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Route Name"
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
                                        : 'Update Route'}
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

export default RouteEdit
