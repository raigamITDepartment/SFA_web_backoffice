import React, { useMemo, useState, useEffect } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { FaRegEdit } from 'react-icons/fa'
import { MdDeleteOutline } from 'react-icons/md'
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
import {fetchChannels, fetchSubChannels, fetchRegions, fetchAreas, fetchTerritories} from '@/services/singupDropdownService'
import { fetchAgencies, fetchRoutesOptions } from '@/services/DemarcationService'
import Dialog from '@/components/ui/Dialog'

type FormSchema = {
    channel: string;
    subChannel: string;
    region: string;
    area: string;
    territory: string;
    route: string;
    agencyCode: string;
    agencyName: string;
    isActive: boolean;
    channelName:string;
};

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

interface Agency {
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

const Agency = (props: AddAgencyFormSchema) => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const token = sessionStorage.getItem('accessToken')
    const { disableSubmit = false, className, setMessage } = props
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [agencyData, setAgencyData] = useState<Agency[]>([])
    const [SelelectAgency, setSelelectAgency] = useState<Agency | null>(null)
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [channel, setChannel] = useState<any>([])
    const [subChannel, setSubChannel] = useState<any>([])
    const [region, setRegion] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [range, setRange] = useState<any>([])
    const [territory, setTerritory] = useState<any>([])
    const [route, setRoute] = useState<any>([])
    const navigate = useNavigate()

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await fetchAgencies()
                setAgencyData(res)
            } catch (err) {
                console.error('Failed to load agencies:', err)
            }
        }
        loadUsers()
    }, [])

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
        const loadSubChannel = async () => {
            try {
                const subChannelOptions = await fetchSubChannels(token)
                setSubChannel(subChannelOptions)
            } catch (error) {
                setMessage?.('Failed to load sub channels.')
            }
        }
        loadSubChannel()
    }, [setMessage])

    useEffect(() => {
        const loadRegion = async () => {
            try {
                const regionOptions = await fetchRegions(token)
                setRegion(regionOptions)
            } catch (error) {
                setMessage?.('Failed to load regions.')
            }
        }
        loadRegion()
    }, [setMessage])

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

    useEffect(() => {
        const loadRoutes = async () => {
            try {
                const routeOptions = await fetchRoutesOptions(token)
                setRoute(routeOptions)
            } catch (error) {
                setMessage?.('Failed to load routes.')
            }
        }
        loadRoutes()
    }, [setMessage])

    const handleDialogConfirm = async () => {
        setDialogIsOpen(false)
        if (SelelectAgency) {
            toast.push(
                <Alert
                    showIcon
                    type="danger"
                    className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                    Inactive Route
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
                // await ()
                // setData(prev => prev.filter(u => u.id !== selectedUser.id))
            } catch (error) {
                console.error('Failed to Territory:', error)
            } finally {
                setSelelectAgency(null)
            }
        }
    }
    const handleEditClick = (RGCode :Agency) => {
        navigate(`/Master-menu-Demarcation-/${RGCode.agencyCode}/Agency`)
    }

    const columns = useMemo<ColumnDef<Agency>[]>(
        () => [
            { header: 'Channel', accessorKey: 'channelName' },
            { header: 'Sub-Channel', accessorKey: 'subChannelCode' },
            { header: 'Region', accessorKey: 'regionCode' },
            { header: 'Area', accessorKey: 'areaCode' },
            { header: 'Territory', accessorKey: 'territoryCode' },
            { header: 'Route', accessorKey: 'routeCode' },
            { header: 'Agency Code', accessorKey: 'agencyCode' },
            { header: 'Agency Name', accessorKey: 'agencyName' },
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
                            <FaRegEdit
                                className="text-blue-500 text-base  cursor-pointer"
                                title="Edit"
                                onClick={() => handleEditClick(RGCode)}
                            />
                            <MdDeleteOutline
                                className="text-red-500 text-lg cursor-pointer"
                                title="Delete"
                                onClick={() => handleDeleteClick(RGCode)}
                            />
                        </div>
                    )
                },
            },
        ],
        [],
    )

    const data = agencyData

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
    const handleDeleteClick = (RGCode: Agency) => {
        setSelelectAgency(RGCode)
        setDialogIsOpen(true)
    }

    const handleDialogClose = () => {
        setDialogIsOpen(false)
        setSelelectAgency(null)
    }

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            channel: '',
            subChannel: '',
            region: '',
            area: '',
            territory: '',
            route: '',
            agencyName: '',
            isActive: true, // Set default value to true
        },
    })

    const onSubmit = async (values: FormSchema) => {
        await new Promise((r) => setTimeout(r, 500))
        alert(JSON.stringify(values, null, 2))
    }

    return (
        <div>
            <div className="flex flex-col lg:flex-row xl:flex-row gap-4">
                <Card bordered={false} className="lg:w-1/3 xl:w-1/3 h-1/2">
                    <h5 className="mb-2">Agency Creation</h5>
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
                              invalid={Boolean(errors.subChannel)}
                            errorMessage={errors.subChannel?.message}
                        >
                            <Controller
                                name="subChannel"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Sub Channel"
                                            options={subChannel}
                                            value={subChannel.find(
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
                            invalid={Boolean(errors.region)}
                            errorMessage={errors.region?.message}
                        >
                            <Controller
                                name="region"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Region"
                                            options={region}
                                            value={region.find(
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
                            invalid={Boolean(errors.area)}
                            errorMessage={errors.area?.message}
                        >
                            <Controller
                                name="area"
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
                            invalid={Boolean(errors.territory)}
                            errorMessage={errors.territory?.message}
                        >
                            <Controller
                                name="territory"
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
                            invalid={Boolean(errors.route)}
                            errorMessage={errors.route?.message}
                        >
                            <Controller
                                name="route"
                                control={control}
                                render={({ field }) => (
                                     <Select
                                            size="sm"
                                            placeholder="Select Route"
                                            options={route}
                                            value={route.find(
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
                            <Button variant="solid" block type="submit">
                                Create
                            </Button>
                        </FormItem>
                    </Form>
                </Card>

                <Card
                    bordered={false}
                    className="lg:w-2/3 xl:w-2/3 h-1/2 overflow-auto"
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
                <h5 className="mb-4">Incative Agancy</h5>
                <p>
                    Are you sure to Incative Agancy{' '}
                    <b>{SelelectAgency?.agencyName}</b>?
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

export default Agency
