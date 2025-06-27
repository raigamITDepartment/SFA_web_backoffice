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
import {fetchChannels} from '@/services/singupDropdownService'
import { fetchRegions, addNewRegion, getAllSubChannelsByChannelId, deleteRegion } from '@/services/DemarcationService'
import Dialog from '@/components/ui/Dialog'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiCheckCircle } from 'react-icons/hi'
import { useWatch } from 'react-hook-form';



const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

interface Region {
    id:number,
    channelCode: string;
    subChannelCode: string;
    regionCode: string;
    regionName: string;
    isActive: boolean;
    channelName: string;
}

export type AddRegionFormSchema = {
    userId: number;
    channelId: number | null;
    subChannelId: number | null;
    regionName: string;
    regionCode: string;
    isActive: boolean;
};


const validationSchema: ZodType<AddRegionFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'), 
    channelId: z.number({ required_error: 'Please select channel' }),
    subChannelId: z.number({ required_error: 'Please select subChannel' }),
    regionName: z.string({ required_error: 'Region name is required' }),
    regionCode: z.string({ required_error: 'Region code is required' }),
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

const Region = (props: AddRegionFormSchema) => {
    const token = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { disableSubmit = false, className, setMessage } = props
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [regionData, setRegionData] = useState<Region[]>([])
    const [SelelectRegion, setSelelectRegion] = useState<Region | null>(null)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [channel, setChannel] = useState<any>([])
    const [subChannel, setSubChannel] = useState<any>([])
    const navigate = useNavigate()

    const userIdNumber = Number(userId);
 

    const loadRegions = async () => {
        try {
            const res = await fetchRegions()
            setRegionData(res)
        } catch (err) {
            console.error('Failed to load regions:', err)
        }
    }

    useEffect(() => {
        loadRegions();
    }, []);

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
    } = useForm<AddRegionFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: userIdNumber,
            channelId: null,
            subChannelId: null,
            regionName: '',
            regionCode: '',
            isActive: true,
        },
    });
    const selectedChannelId = useWatch({
        control,
        name: 'channelId',
    });
    
    useEffect(() => {
        const loadSubChannels = async () => {
            if (!selectedChannelId) {
                setSubChannel([]);
                return;
            }
            try {
                 console.log(selectedChannelId,'selectedChannelId');
                const subChannelOptions = await getAllSubChannelsByChannelId(selectedChannelId);
                setSubChannel(subChannelOptions);
                console.log(subChannel,'sc');
            } catch (error) {
                setMessage?.('Failed to load sub channels.');
                setSubChannel([]);
            }
        };

        loadSubChannels();
    }, [selectedChannelId, setMessage]);


    const handleDialogConfirm = async () => {
        setDialogIsOpen(false)
        if (SelelectRegion) {
            const isDeactivating = SelelectRegion?.isActive;
            toast.push(
                <Alert
                    showIcon
                    type={isDeactivating ? 'danger' : 'success'}
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {isDeactivating ? 'Deactivating' : 'Activating'} Region
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
                await deleteRegion(SelelectRegion.id);
                setRegionData(prev => prev.filter(u => u.id !== SelelectRegion.id))
            } catch (error) {
                console.error('Failed to delete Region:', error)
            } finally {
                setSelelectRegion(null)
            }
        }
    }
    const handleEditClick = (RGCode : Region) => {
        navigate(`/Master-menu-Demarcation-/${RGCode.id}/Region`)
    }
    const columns = useMemo<ColumnDef<Region>[]>(
        () => [
            { header: 'Channel', accessorKey: 'channelName' },
            { header: 'Sub-Channel', accessorKey: 'subChannelCode' },
            { header: 'Region Code', accessorKey: 'regionCode' },
            { header: 'Region Name', accessorKey: 'regionName' },
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
                    const RGCode = row.original
                    return (
                        <div className="flex space-x-2 ">
                                   {RGCode.isActive && (
                                       <FaRegEdit
                                           className="text-blue-500 text-base cursor-pointer"
                                           title="Edit"
                                           onClick={() => handleEditClick(RGCode)}
                                       />
                                   )}
                                   {RGCode.isActive ? (
                                       <MdBlock
                                           className="text-red-500 text-lg cursor-pointer"
                                           title="Deactivate Region"
                                           onClick={() => handleDeleteClick(RGCode)}
                                       />
                                   ) : (
                                       <MdCheckCircleOutline
                                           className="text-green-500 text-lg cursor-pointer"
                                           title="Activate User"
                                           onClick={() => handleDeleteClick(RGCode)}
                                       />
                                   )}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const data = regionData

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

    const handleDeleteClick = (RGCode: Region) => {
        setSelelectRegion(RGCode)
        setDialogIsOpen(true)
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setSelelectRegion(null)
    }


    const onSubmit = async (values: AddRegionFormSchema) => {
        if (isSubmitting) return 
        setIsSubmitting(true)
        try {
            const result = await addNewRegion(values, token);

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else {
                toast.push(
                    <Alert
                        showIcon
                        type="success"
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                    >
                        <HiCheckCircle
                            className="text-green-500 mb-2"
                            size={48}
                        />
                        <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                            New Region created successfully!
                        </div>
                    </Alert>,
                    {
                        offsetX: 5,
                        offsetY: 100,
                        transitionType: 'fade',
                        block: false,
                        placement: 'top-end',
                    },
                )
                reset();
                await loadRegions();
            }
        }catch (err: any) {
            const backendMessage =
                err?.response?.data?.payload &&
                    typeof err.response.data.payload === 'object'
                    ? Object.values(err.response.data.payload).join(', ')
                    : err?.response?.data?.message ||
                    'An error occurred during creating new region. Please try again.'

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
            )
        } finally {
            setIsSubmitting(false)
        }
    };

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Region Creation</h5>
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
                <h5 className="mb-4">{SelelectRegion?.isActive ? 'Deactivate' : 'Activate'} Region</h5>
                <p>
                    Are you sure you want to {SelelectRegion?.isActive ? 'Deactivate' : 'Activate'} <b>{SelelectRegion?.regionName}</b>?
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

export default Region
