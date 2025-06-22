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
import type { InputHTMLAttributes, ChangeEvent } from 'react'
import { Button, toast, Alert } from '@/components/ui'
import Checkbox from '@/components/ui/Checkbox'
import { fetchTerritories, addNewTerritory, deleteTerritory } from '@/services/DemarcationService'
import Dialog from '@/components/ui/Dialog'
import {fetchAreas, fetchRanges} from '@/services/singupDropdownService'
import { z } from 'zod'
import type { ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiCheckCircle } from 'react-icons/hi'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

interface Territory {
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

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

export type AddTerritoryFormSchema = {
    userId: number;
    rangeId: number | null;
    areaId: number | null;
    territoryName: string;
    territoryCode: string,
    displayOrder: number,
    isActive: boolean;
};


const validationSchema: ZodType<AddTerritoryFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'), 
    rangeId: z.number({ required_error: 'Please select range' }),
    areaId: z.number({ required_error: 'Please select area' }),
    territoryName: z.string({ required_error: 'Territory name is required' }),
    territoryCode: z.string({ required_error: 'Territory code is required' }),
    displayOrder: z.number({ required_error: 'Display order is required' }),
    isActive: z.boolean(),
});

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

const Territory = (props: AddTerritoryFormSchema) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const token = sessionStorage.getItem('accessToken')
    const userId = sessionStorage.getItem('userId');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const { disableSubmit = false, className, setMessage } = props
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [territoryData, setTerritoryData] = useState<Territory[]>([])
    const [SelelectTerritory, setSelelectTerritory] =
    useState<Territory | null>(null)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [area, setArea] = useState<any>([])
    const [range, setRange] = useState<any>([])
    const navigate = useNavigate()

    const userIdNumber = Number(userId);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchTerritories()
                setTerritoryData(res)
            } catch (err) {
                console.error('Failed to load territories:', err)
            }
        }
        loadUsers()
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

    const handleDialogConfirm = async () => {
        setDialogIsOpen(false)
        if (SelelectTerritory) {
            const isDeactivating = SelelectTerritory?.isActive;
            toast.push(
                <Alert
                    showIcon
                    type={isDeactivating ? 'danger' : 'success'}
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {isDeactivating ? 'Deactivating' : 'Activating'} Territory
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
                 await deleteTerritory(SelelectTerritory.id);
                // setData(prev => prev.filter(u => u.id !== selectedUser.id))
            } catch (error) {
                console.error('Failed to delete Territory:', error)
            } finally {
                setSelelectTerritory(null)
            }
        }
    }
    const handleEditClick = (TRCode:Territory) => {
        navigate(`/Master-menu-Demarcation-/${TRCode.territoryCode}/Territory`)
    }

    const columns = useMemo<ColumnDef<Territory>[]>(
        () => [
            { header: 'Channel', accessorKey: 'channelName' },
            { header: 'Sub-Channel', accessorKey: 'subChannelName' },
            { header: 'Region', accessorKey: 'regionName' },
            { header: 'Area', accessorKey: 'areaName' },
            { header: 'Range', accessorKey: 'rangeName' },
            { header: 'Territory Code', accessorKey: 'territoryCode' },
            { header: 'Territory Name', accessorKey: 'territoryName' },
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
                    const TRCode = row.original
                    return (
                        <div className="flex space-x-2">
                            {TRCode.isActive && (
                                <FaRegEdit
                                    className="text-blue-500 text-base cursor-pointer"
                                    title="Edit"
                                    onClick={() => handleEditClick(TRCode)}
                                />
                            )}
                            {TRCode.isActive ? (
                                <MdBlock
                                    className="text-red-500 text-lg cursor-pointer"
                                    title="Deactivate User"
                                    onClick={() => handleDeleteClick(TRCode)}
                                />
                            ) : (
                                <MdCheckCircleOutline
                                    className="text-green-500 text-lg cursor-pointer"
                                    title="Activate User"
                                    onClick={() => handleDeleteClick(TRCode)}
                                />
                            )}
                        </div>
                    )
                },
            },
        ],
        [],
    )
   
    const data = territoryData

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

    const handleDeleteClick = (RGCode: Territory) => {
        setSelelectTerritory(RGCode)
        setDialogIsOpen(true)
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setSelelectTerritory(null)
    }

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<AddTerritoryFormSchema>({
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

    const onSubmit = async (values: AddTerritoryFormSchema) => {
        console.log('clicked');
        if (isSubmitting) return // Prevent double submit
        setIsSubmitting(true)
        try {
            const result = await addNewTerritory(values, token);

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
                            New Territory created successfully!
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
            }
        }catch (err: any) {
            const backendMessage =
                err?.response?.data?.payload &&
                    typeof err.response.data.payload === 'object'
                    ? Object.values(err.response.data.payload).join(', ')
                    : err?.response?.data?.message ||
                    'An error occurred during creating new Territory. Please try again.'

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
                    <h5 className="mb-2">Territory Creation</h5>
                    <Form onSubmit={handleSubmit(onSubmit)}>
          
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
                <h5 className="mb-4">{SelelectTerritory?.isActive ? 'Deactivate' : 'Activate'} Territory</h5>
                <p>
                    Are you sure you want to {SelelectTerritory?.isActive ? 'Deactivate' : 'Activate'} <b>{SelelectTerritory?.territoryName}</b>?
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

export default Territory
