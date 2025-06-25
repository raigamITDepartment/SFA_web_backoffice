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
import type {
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { Button, toast, Alert } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import {
    addNewArea,
    getAllSubChannelsByChannelId,
    getAllRegionsBySubChannelId,
    deleteAreaRegion,
    fetchAreaRegion,mapAreaRegion
} from '@/services/DemarcationService'
import Dialog from '@/components/ui/Dialog'
import { fetchChannels, fetchAreas } from '@/services/singupDropdownService'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWatch } from 'react-hook-form'
import { HiCheckCircle } from 'react-icons/hi'
import CreatableSelect from 'react-select/creatable'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

interface Area {
    id: number
    channelCode: string
    subChannelCode: string
    regionCode: string
    areaCode: string
    areaName: string
    isActive: boolean
    regionName: string
}

export type AddAreaRegionFormSchema = {
    userId: number;
    areaId: number | null;
    regionId: number | null;
    isActive: boolean;
};

const validationSchema: ZodType<AddAreaRegionFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'),
    areaId: z.number({ required_error: 'Please select area' }).nullable(),
    regionId: z.number({ required_error: 'Please select region' }).nullable(),
    isActive: z.boolean(),
});


interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)
        return () => clearTimeout(timeout)
    }, [value, onChange, debounce])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2">Search:</span>
                <Input
                    size="sm"
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const Area = (props: AddAreaRegionFormSchema) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { disableSubmit = false, className, setMessage } = props
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [area, setArea] = useState<any>([])
    const [SelelectArea, setSelelectArea] = useState<Area | null>(null)
    const [SelelectRegion, setSelelectRegion] = useState<any[] | null>(null)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [channel, setChannel] = useState<any>([])
    const [subChannel, setSubChannel] = useState<any>([])
    const [region, setRegion] = useState<any>([])
    const [areaRegion, setAreaRegion] = useState<any>([])
    const navigate = useNavigate()

    const userIdNumber = Number(userId)

    const loadAreaRegions = async () => {
        try {
            const res = await fetchAreaRegion()
            setAreaRegion(res)
        } catch (err) {
            console.error('Failed to load areas:', err)
        }
    }

    useEffect(() => {
        loadAreaRegions()
    }, [])

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
    } = useForm<AddAreaRegionFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: userIdNumber,
            areaId: null,
            regionId: null,
            isActive: true,
        },
    })

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

    const handleDialogConfirm = async () => {
        setDialogIsOpen(false)
        if (SelelectArea) {
            const isDeactivating = SelelectArea?.isActive
            toast.push(
                <Alert
                    showIcon
                    type={isDeactivating ? 'danger' : 'success'}
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {isDeactivating ? 'Deactivating' : 'Activating'} Area
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                },
            )
            try {
                await deleteAreaRegion(SelelectArea.id)
                setAreaData((prev) =>
                    prev.filter((u) => u.id !== SelelectArea.id),
                )
            } catch (error) {
                console.error('Failed to delete area:', error)
            } finally {
                setSelelectArea(null)
            }
        }
    }

   const handleDiscard = () => {
        navigate(-1)
    }

    const data = areaRegion

    const totalData = data.length





    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setSelelectArea(null)
    }

    const onSubmit = async (values: AddAreaRegionFormSchema) => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const payload = {
                areaRegionsDTOList: [
                    {
                        userId: values.userId,
                        areaId: values.areaId!,
                        regionId: values.regionId!,
                        isActive: values.isActive,
                    },
                ],
            };

            const result = await mapAreaRegion(payload);

            if (result?.status === 'failed') {
                setMessage?.(result.message);
            } else {
                toast.push(
                    <Alert
                        showIcon
                        type="success"
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                    >
                        <HiCheckCircle className="text-green-500 mb-2" size={48} />
                        <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                            New Area-Region mapped successfully!
                        </div>
                    </Alert>,
                    {
                        offsetX: 5,
                        offsetY: 100,
                        transitionType: 'fade',
                        block: false,
                        placement: 'top-end',
                    }
                );
                reset();
                await loadAreaRegions();
            }
        } catch (err: any) {
            const backendMessage =
                err?.response?.data?.payload &&
                typeof err.response.data.payload === 'object'
                    ? Object.values(err.response.data.payload).join(', ')
                    : err?.response?.data?.message ||
                    'An error occurred during mapping new Area-Region. Please try again.';

            toast.push(
                <Alert
                    showIcon
                    type="danger"
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {backendMessage}
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                }
            );
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Area Region Mapping Update</h5>
                    <br></br>

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

                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>

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

                        {/* <FormItem>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox {...field} checked={field.value}>
                                        IsActive
                                    </Checkbox>
                                )}
                            />
                        </FormItem> */}

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
