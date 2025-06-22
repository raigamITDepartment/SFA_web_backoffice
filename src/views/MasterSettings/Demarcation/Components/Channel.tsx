import React, { useMemo, useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { FaRegEdit } from 'react-icons/fa'
import {MdBlock, MdCheckCircleOutline  } from 'react-icons/md'
import Tag from '@/components/ui/Tag'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
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
import Dialog from '@/components/ui/Dialog'
import { fetchChannels, fetchCountry, addNewChannel, deleteChannel } from '@/services/DemarcationService'
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

interface Channel {
    id: number;
    channelCode: string
    channelName: string
    isActive?: boolean
}

export type AddChannelFormSchema = {
    userId: number;
    countryId: number | null;
    channelName: string;
    channelCode: string;
    isActive: boolean;
};


const validationSchema: ZodType<AddChannelFormSchema> = z.object({
    userId: z.number().min(1, 'User ID is required'), 
    countryId: z.number({ required_error: 'Please select country' }),
    channelName: z.string({ required_error: 'Channel name is required' }),
    channelCode: z.string({ required_error: 'Channel code is required' }),
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

const Channel = (props: AddChannelFormSchema) => {
    const { disableSubmit = false, className, setMessage } = props
    const token = sessionStorage.getItem('accessToken')
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [SelelectChannel, setSelelectChannel] = useState<Channel | null>(null)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [channelData, setChannelData] = useState<Channel[]>([])
    const [country, setCountry] = useState<any>([])
    const navigate = useNavigate()

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const channelOptions = await fetchChannels()
                setChannelData(channelOptions)
            } catch (err) {
                console.error('Failed to load users:', err)
            }
        }
        loadUsers()
    }, [])

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const countryOptions = await fetchCountry()
                console.log(countryOptions);
                setCountry(countryOptions)
            } catch (err) {
                console.error('Failed to load countries:', err)
            }
        }
        loadUsers()
    }, [])

    const handleDialogConfirm = async () => {
        setDialogIsOpen(false);

        if (SelelectChannel) {
            const isDeactivating = SelelectChannel?.isActive;

            toast.push(
                <Alert
                    showIcon
                    type={isDeactivating ? 'danger' : 'success'}
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    {isDeactivating ? 'Deactivating' : 'Activating'} Channel
                </Alert>,
                {
                    offsetX: 5,
                    offsetY: 100,
                    transitionType: 'fade',
                    block: false,
                    placement: 'top-end',
                }
            );

            try {
                await deleteChannel(SelelectChannel.id);
            } catch (error) {
                console.error('Failed to delete Channel:', error);
            } finally {
                setSelelectChannel(null);
            }
        }
    };


    const handleEditClick = (CHCode: Channel) => {
        navigate(`/Master-menu-Demarcation-/${CHCode.id}/SubChannel`)
    }

    const columns = useMemo<ColumnDef<Channel>[]>(
        () => [
            { header: 'Channel Code', accessorKey: 'channelCode' },
            { header: 'Channel Name', accessorKey: 'channelName' },
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
                    const SelelectChannel = row.original
                    return (
                        <div className="flex space-x-2">
                            {SelelectChannel.isActive && (
                                <FaRegEdit
                                    className="text-blue-500 text-base cursor-pointer"
                                    title="Edit"
                                    onClick={() => handleEditClick(CHCode)}
                                />
                            )}
                            {SelelectChannel.isActive ? (
                                <MdBlock
                                    className="text-red-500 text-lg cursor-pointer"
                                    title="Deactivate User"
                                    onClick={() => handleDeleteClick(CHCode)}
                                />
                            ) : (
                                <MdCheckCircleOutline
                                    className="text-green-500 text-lg cursor-pointer"
                                    title="Activate User"
                                    onClick={() => handleDeleteClick(CHCode)}
                                />
                            )}
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const data = channelData

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
    const handleDeleteClick = (CHCode: Channel) => {
        setSelelectChannel(CHCode)
        setDialogIsOpen(true)
    }
    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setSelelectChannel(null)
    }

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<AddChannelFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            userId: 123, 
            countryId: null,
            channelName: '',
            channelCode: '',
            isActive: true,
        },
    });

    const onSubmit = async (values: AddChannelFormSchema) => {
        if (isSubmitting) return // Prevent double submit
        setIsSubmitting(true)
        try {
            const result = await addNewChannel(values, token);

            if (result?.status === 'failed') {
                setMessage?.(result.message)
            } else {
                toast.push(
                    <Alert
                        showIcon
                        type="success"
                        className="dark:bg-gray-700 w-64 sm:w-80 md:w-96 flex flex-col items-center"
                    >
                        <div className="mt-2 text-green-700 font-semibold text-lg text-center">
                            New Channel created successfully!
                        </div>
                    </Alert>,
                    {
                        offsetX: 5,
                        offsetY: 30,
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
                    'An error occurred during creating new channel. Please try again.'

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
                    <h5 className="mb-2">Channel Creation</h5>
                    <Form size="sm" onSubmit={handleSubmit(onSubmit)}>
                        <FormItem
                            invalid={Boolean(errors.countryId)}
                            errorMessage={errors.countryId?.message}
                        >
                            <Controller
                                name="countryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Country"
                                        options={country}
                                        value={country.find(
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
                            />
                        </FormItem>


                        <FormItem
                            invalid={Boolean(errors.channelCode)}
                            errorMessage={errors.channelCode?.message}
                        >
                            <Controller
                                name="channelCode"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Channel Code"
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
                            invalid={Boolean(errors.channelName)}
                            errorMessage={errors.channelName?.message}
                        >
                            <Controller
                                name="channelName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="text"
                                        autoComplete="off"
                                        placeholder="Channel Name"
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
                <h5 className="mb-4">{SelelectChannel?.isActive ? 'Deactivate' : 'Activate'} Channel</h5>
                <p>
                    Are you sure you want to {SelelectChannel?.isActive ? 'Deactivate' : 'Activate'} <b>{SelelectChannel?.channelName}</b>?
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

export default Channel
