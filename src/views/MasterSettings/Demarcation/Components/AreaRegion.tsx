import React, { useMemo, useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { FaRegEdit } from 'react-icons/fa'
import { MdBlock, MdCheckCircleOutline } from 'react-icons/md'
import Tag from '@/components/ui/Tag'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import { useNavigate } from 'react-router-dom'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
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

    const handleEditClick = (ArCode: Area) => {
      //  navigate(`/Master-menu-Demarcation-/${ARCode.id}/Area`)
   navigate(`/Master-menu-Demarcation-/${ArCode.id}/AreaRegionEdit`)
     
    }
    const columns = useMemo<ColumnDef<Area>[]>(
        () => [
            { header: 'Region', accessorKey: 'regionName' },
            { header: 'Area Name', accessorKey: 'areaName' },
            {
                header: 'Is Active',
                accessorKey: 'isActive',
                cell: ({ row }) => (
                    <div className="mr-2 rtl:ml-2">
                        <Tag
                            className={
                                row.original.isActive
                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 border-0 rounded'
                                    : 'text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0'
                            }
                        >
                            {row.original.isActive ? 'Active' : 'Inactive'}
                        </Tag>
                    </div>
                ),
            },
            {
                header: 'Actions',
                id: 'actions',
                cell: ({ row }) => {
                    const ArCode = row.original
                    return (
                        <div className="flex space-x-2">
                            {ArCode.isActive && (
                                <FaRegEdit
                                    className="text-blue-500 text-base cursor-pointer"
                                    title="Edit"
                                    onClick={() => handleEditClick(ArCode)}
                                />
                            )}
                            {ArCode.isActive ? (
                                <MdBlock
                                    className="text-red-500 text-lg cursor-pointer"
                                    title="Deactivate Area Region Mapping"
                                    onClick={() => handleDeleteClick(ArCode)}
                                />
                            ) : (
                                <MdCheckCircleOutline
                                    className="text-green-500 text-lg cursor-pointer"
                                    title="Activate User"
                                    onClick={() => handleDeleteClick(ArCode)}
                                />
                            )}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const data = areaRegion

    const totalData = data.length

    const table = useReactTable({
        data,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { columnFilters, globalFilter },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize: pageSize } },
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        const newSize = Number(value)
        setPageSize(newSize)
        table.setPageSize(newSize)
    }

    const handleDeleteClick = (ArCode: Area) => {
        setSelelectArea(ArCode)
        setDialogIsOpen(true)
    }

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
                        {/* <HiCheckCircle className="text-green-500 mb-2" size={48} /> */}
                        <div className="mt-2 text-green-700 font-semibold text-md text-center">
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
        }catch (err: any) {
            let backendMessage = 'An error occurred during creating new Area-Region. Please try again.';

            const response = err?.response;
            const data = response?.data;

            if (data) {
                if (typeof data.payload === 'string') {
                    backendMessage = data.payload;
                } else if (typeof data.message === 'string') {
                    backendMessage = data.message;
                }
            } else if (typeof err.message === 'string') {
                backendMessage = err.message;
            }

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
                },
            );
        }finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Area Region Mapping</h5>
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
       <span className="mb-2 text-xs block">Select Multiple Sub Channnel</span>
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
   <span className="mb-2 text-xs block">Select Multiple Region</span>
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
                            <Button variant="solid" block type="submit">
                                Create
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card
                    bordered={false}
                    className="lg:w-2/3 xl:w-2/3 overflow-auto"
                >
                    <div>
                        <DebouncedInput
                            value={globalFilter ?? ''}
                            className="font-xs shadow border border-block"
                            placeholder="Search all columns..."
                            onChange={(value) => setGlobalFilter(String(value))}
                        />
                        <Table>
                            <THead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <Th
                                                key={header.id}
                                                colSpan={header.colSpan}
                                            >
                                                {header.isPlaceholder ? null : (
                                                    <div
                                                        className={
                                                            header.column.getCanSort()
                                                                ? 'cursor-pointer select-none'
                                                                : ''
                                                        }
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext(),
                                                        )}
                                                        <Sorter
                                                            sort={header.column.getIsSorted()}
                                                        />
                                                    </div>
                                                )}
                                            </Th>
                                        ))}
                                    </Tr>
                                ))}
                            </THead>
                            <TBody>
                                {table.getRowModel().rows.map((row) => (
                                    <Tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <Td
                                                key={cell.id}
                                                className="py-1 text-xs"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))}
                            </TBody>
                        </Table>
                        <div className="flex items-center justify-between mt-4">
                            <Pagination
                                pageSize={table.getState().pagination.pageSize}
                                currentPage={
                                    table.getState().pagination.pageIndex + 1
                                }
                                total={totalData}
                                onChange={onPaginationChange}
                            />
                            <div style={{ minWidth: 130 }}>
                                <Select
                                    size="sm"
                                    isSearchable={false}
                                    value={pageSizeOptions.find(
                                        (option) => option.value === pageSize,
                                    )}
                                    options={pageSizeOptions}
                                    onChange={(option) =>
                                        onSelectChange(option?.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Dialog
                isOpen={dialogIsOpen}
                onClose={handleDialogClose}
                onRequestClose={handleDialogClose}
            >
                <h5 className="mb-4">
                    {SelelectArea?.isActive ? 'Deactivate' : 'Activate'} Channel
                </h5>
                <p>
                    Are you sure you want to{' '}
                    {SelelectArea?.isActive ? 'Deactivate' : 'Activate'}{' '}
                    <b>{SelelectArea?.areaName}</b>?
                </p>
                <div className="text-right mt-6">
                    <Button
                        className="mr-2"
                        clickFeedback={false}
                        customColorClass={({ active, unclickable }) =>
                            [
                                'hover:text-red-600 border-red-600 border-2 hover:border-red-800 hover:ring-0 text-red-600 ',

                                unclickable && 'opacity-50 cursor-not-allowed',
                                !active && !unclickable,
                            ]
                                .filter(Boolean)
                                .join(' ')
                        }
                        onClick={handleDialogClose}
                    >
                        Cancel
                    </Button>
                    <Button variant="solid" onClick={handleDialogConfirm}>
                        Confirm
                    </Button>
                </div>
            </Dialog>
        </div>
    )
}

export default Area
