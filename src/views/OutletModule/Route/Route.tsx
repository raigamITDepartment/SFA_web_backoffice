import React, { useMemo, useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
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
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'

import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Tag from '@/components/ui/Tag'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { Alert, toast } from '@/components/ui'
import Select from '@/components/ui/Select'
import { Form, FormItem } from '@/components/ui/Form'

import { FaRegEdit } from 'react-icons/fa'
import { MdBlock, MdCheckCircleOutline } from 'react-icons/md'

import { fetchRoutes, deleteRoute } from '@/services/DemarcationService'

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

interface DemarcationRoute {
    id: number
    channelCode: string
    subChannelCode: string
    regionCode: string
    areaCode: string
    territoryCode: string
    routeCode: string
    routeName: string
    isActive: boolean
    territoryName: string
}

const filterSchema = z.object({
    channel: z.string().optional(),
    subChannel: z.string().optional(),
    region: z.string().optional(),
    area: z.string().optional(),
    territory: z.string().optional(),
    route: z.string().optional(),
})

type FormSchema = z.infer<typeof filterSchema>

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const Route = () => {
    const navigate = useNavigate()

    const [routeData, setRouteData] = useState<DemarcationRoute[]>([])
    const [filteredData, setFilteredData] = useState<DemarcationRoute[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [selectedRoute, setSelectedRoute] = useState<DemarcationRoute | null>(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            channel: '',
            subChannel: '',
            region: '',
            area: '',
            territory: '',
            route: '',
        },
    })

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetchRoutes()
                setRouteData(res)
                setFilteredData(res)
            } catch (error) {
                toast.push(
                    <Alert type="danger" showIcon>
                        Failed to load routes
                    </Alert>
                )
            }
        }
        loadData()
    }, [])

    const columns = useMemo<ColumnDef<DemarcationRoute>[]>(() => [
        { header: 'Territory', accessorKey: 'territoryName' },
        { header: 'Route Code', accessorKey: 'routeCode' },
        { header: 'Route Name', accessorKey: 'routeName' },
        {
            header: 'Is Active',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <Tag
                    className={
                        row.original.isActive
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-red-100 text-red-600'
                    }
                >
                    {row.original.isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => {
                const route = row.original
                return (
                    <div className="flex space-x-2">
                        {route.isActive && (
                            <FaRegEdit
                                className="text-blue-500 cursor-pointer"
                                onClick={() => handleEditClick(route)}
                            />
                        )}
                        {route.isActive ? (
                            <MdBlock
                                className="text-red-500 cursor-pointer"
                                onClick={() => handleDeleteClick(route)}
                            />
                        ) : (
                            <MdCheckCircleOutline
                                className="text-green-500 cursor-pointer"
                                onClick={() => handleDeleteClick(route)}
                            />
                        )}
                    </div>
                )
            },
        },
    ], [])

    const table = useReactTable({
        data: filteredData,
        columns,
        filterFns: { fuzzy: fuzzyFilter },
        state: { globalFilter, columnFilters },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
    })

    const handleFilterSubmit = (data: FormSchema) => {
        const filtered = routeData.filter(route =>
            (!data.channel || route.channelCode === data.channel) &&
            (!data.subChannel || route.subChannelCode === data.subChannel) &&
            (!data.region || route.regionCode === data.region) &&
            (!data.area || route.areaCode === data.area) &&
            (!data.territory || route.territoryCode === data.territory) &&
            (!data.route || route.routeCode === data.route)
        )
        setFilteredData(filtered)
        table.setPageIndex(0)
    }

    const handleEditClick = (route: DemarcationRoute) => {
        navigate(`/Master-menu-Demarcation-/${route.id}/Route`)
    }

    const handleDeleteClick = (route: DemarcationRoute) => {
        setSelectedRoute(route)
        setDialogIsOpen(true)
    }

    const handleDialogConfirm = async () => {
        if (!selectedRoute) return
        try {
            await deleteRoute(selectedRoute.id)
            const updated = routeData.filter(r => r.id !== selectedRoute.id)
            setRouteData(updated)
            setFilteredData(updated)
            toast.push(
                <Alert showIcon type="success">
                    Route {selectedRoute.isActive ? 'deactivated' : 'activated'} successfully
                </Alert>
            )
        } catch {
            toast.push(
                <Alert type="danger" showIcon>
                    Operation failed
                </Alert>
            )
        } finally {
            setDialogIsOpen(false)
            setSelectedRoute(null)
        }
    }

    return (
        <div className="space-y-6">
            {/* Filter Form */}
            <Card>
                <h5 className="mb-4">Route</h5>
                <Form onSubmit={handleSubmit(handleFilterSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormItem
                            label="Channel"
                            invalid={!!errors.channel}
                            errorMessage={errors.channel?.message}
                        >
                            <Controller
                                name="channel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Channel"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { label: 'Channel 1', value: 'channel 1' }as any,
                                            { label: 'Channel 2', value: 'channel 2' },
                                        ]}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Sub Channel"
                            invalid={!!errors.subChannel}
                            errorMessage={errors.subChannel?.message}
                        >
                            <Controller
                                name="subChannel"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Sub Channel"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { label: 'SubChannel 1', value: 'subChannel 1' }as any,
                                            { label: 'SubChannel 2', value: 'subChannel 2' },
                                        ]}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Region"
                            invalid={!!errors.region}
                            errorMessage={errors.region?.message}
                        >
                            <Controller
                                name="region"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Region"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { label: 'Region 1', value: 'region 1' } as any,
                                            { label: 'Region 2', value: 'region 2' },
                                        ]}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Area"
                            invalid={!!errors.area}
                            errorMessage={errors.area?.message}
                        >
                            <Controller
                                name="area"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Area"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { label: 'Area 1', value: 'area 1' }as any,
                                            { label: 'Area 2', value: 'area 2' },
                                        ]}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Territory"
                            invalid={!!errors.territory}
                            errorMessage={errors.territory?.message}
                        >
                            <Controller
                                name="territory"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Territory"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { label: 'Territory 1', value: 'territory 1' }as any,
                                            { label: 'Territory 2', value: 'territory 2' },
                                        ]}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Route"
                            invalid={!!errors.route}
                            errorMessage={errors.route?.message}
                        >
                            <Controller
                                name="route"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Route"
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={[
                                            { label: 'Route 1', value: 'route 1' }as any,
                                            { label: 'Route 2', value: 'route 2' },
                                        ]}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <div className="mt-6">
                        <Button type="submit" variant="solid">Submit</Button>
                    </div>
                </Form>
            </Card>

            {/* Table */}
            <Card>
                <div className="flex justify-between mb-4">
                    <div></div>
                    <input
                        className="border px-2 py-1 rounded"
                        placeholder="Search..."
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                    />
                </div>

                <Table>
                    <THead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <Th key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                onClick={header.column.getToggleSortingHandler()}
                                                className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <Sorter sort={header.column.getIsSorted()} />
                                            </div>
                                        )}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map(row => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <Td key={cell.id} className="py-1 text-sm">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>

                <div className="flex justify-between items-center mt-4">
                    <Pagination
                        currentPage={table.getState().pagination.pageIndex + 1}
                        pageSize={pageSize}
                        total={filteredData.length}
                        onChange={page => table.setPageIndex(page - 1)}
                    />
                    <Select
                        size="sm"
                        value={pageSizeOptions.find(opt => opt.value === pageSize)}
                        onChange={opt => {
                            setPageSize(opt?.value ?? 10)
                            table.setPageSize(opt?.value ?? 10)
                        }}
                        options={pageSizeOptions}
                    />
                </div>
            </Card>

            {/* Dialog */}
            <Dialog isOpen={dialogIsOpen} onClose={() => setDialogIsOpen(false)}>
                <h5 className="mb-4">{selectedRoute?.isActive ? 'Deactivate' : 'Activate'} Route</h5>
                <p>
                    Are you sure you want to {selectedRoute?.isActive ? 'deactivate' : 'activate'} <b>{selectedRoute?.routeName}</b>?
                </p>
                <div className="text-right mt-6">
                    <Button className="mr-2" onClick={() => setDialogIsOpen(false)}>Cancel</Button>
                    <Button variant="solid" onClick={handleDialogConfirm}>Confirm</Button>
                </div>
            </Dialog>
        </div>
    )
}

export default Route
