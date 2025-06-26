import React, { useMemo, useState, useEffect } from 'react'
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
import {fetchChannels, fetchTerritories} from '@/services/singupDropdownService'
import { getAgencyById, updateAgency } from '@/services/DemarcationService'
import { useParams } from 'react-router-dom';

type FormSchema = {
    country: string
    channelName: string
    channelCode?: string
    isActive: boolean
}

interface AgencyEdit {
    channelCode: string
    channelName: string
    isActive?: boolean
}
interface Agency {
    id: number,
    channelCode: string;
    subChannelCode: string;
    regionCode: string;
    areaCode: string;
    territoryCode: string;
    routeCode: string;
    agencyCode: string;
    agencyName: string;
    isActive: boolean;
    channelName:string;
}

export type UpdateAgencyFormSchema = {
    userId: number;
    channelId: number | null;
    agencyName: string;
    agencyCode: number | null,
    territoryId: number | null;
    oldAgencyCode?: number | null;
    isActive: boolean;
};


const validationSchema: ZodType<UpdateAgencyFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'), 
    channelId: z.number({ required_error: 'Please select channel' }),
    territoryId: z.number({ required_error: 'Please select territory' }),
    agencyName: z.string({ required_error: 'Agency name is required' }),
    agencyCode: z.number({ required_error: 'Agency code is required' }),
    oldAgencyCode: z.number().nullable().optional(),
    isActive: z.boolean(),
});

const AgencyEdit = (props: UpdateAgencyFormSchema) => {
    const navigate = useNavigate()
    const { id } = useParams();
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const userIdNumber = Number(userId);
    const { disableSubmit = false, className, setMessage } = props
    const [agencyData, setAgencyData] = useState<Agency[]>([])
    const [channel, setChannel] = useState<any>([])
    const [territory, setTerritory] = useState<any>([])

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
    } = useForm<UpdateAgencyFormSchema>({
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
                    const agencyDetails = await getAgencyById(id)
                    setAgencyData(agencyDetails);
    
                    reset({
                        id: agencyDetails.id,
                        userId: userIdNumber,
                        channelId: agencyDetails.channelId ?? null,
                        agencyName: agencyDetails.agencyName ?? '',
                        agencyCode: agencyDetails.agencyCode ?? '',
                        territoryId: agencyDetails.territoryId ?? null,
                        displayOrder: agencyDetails.displayOrder ?? '',
                        isActive: agencyDetails.isActive ?? false,
                    });
                } catch (error) {
                    setMessage?.('Failed to load area data.');
                }
            };
    
    
            loadAreaDetails()
        }, [token, id, setMessage]);

    const onSubmit = async (values: UpdateAgencyFormSchema) => {
        if (!token) {
            setMessage?.('Auth token not found.');
            return;
        }

        try {
            const payload = {
                id: parseInt(id),
                channelId: values.channelId,
                userId: userIdNumber,
                agencyName: values.agencyName,
                agencyCode: values.agencyCode,
                territoryId: values.territoryId,
                displayOrder:1,
                isActive: values.isActive,
            };

            await updateAgency(payload, token);

            toast.push(
                <Alert className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center">
                    <div className="mt-2 text-amber-600 font-semibold text-lg text-center">
                        Agency updated successfully!
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
            console.error('Failed to update Agency:', error);
            setMessage?.(error.message || 'Failed to update Agency');
        }
    };
    const handleDiscard = () => {
        navigate(-1)
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                   <h5 className="mb-2">Agency Update</h5>
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
                                            value={territory.find(option => option.value === field.value) || null}
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
                            invalid={Boolean(errors.agencyCode)}
                            errorMessage={errors.agencyCode?.message}
                        >
                            <Controller
                                name="agencyCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Agency Code"
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
                            invalid={Boolean(errors.agencyName)}
                            errorMessage={errors.agencyName?.message}
                        >
                            <Controller
                                name="agencyName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Agency Name"
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
                                        : 'Update Agency '}
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

export default AgencyEdit
