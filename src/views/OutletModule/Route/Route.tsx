import React, { useMemo, useState, useEffect } from 'react'
import { useForm, Controller, useWatch } from 'react-hook-form'
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
import type {
    ColumnDef,
    FilterFn,
    ColumnFiltersState,
} from '@tanstack/react-table'

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

import {
    deleteRoute,
    getAllSubChannelsByChannelId,
    fetchRoutesByTerritoryId,
} from '@/services/DemarcationService'

import {
    fetchChannels,
    getTerritoriesByAreaId,
    fetchAreas,
} from '@/services/singupDropdownService'

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
    channelId: z.number().optional().nullable(),
    subChannelId: z.number().optional().nullable(),
    region: z.number().optional().nullable(),
    area: z.number().optional().nullable(),
    territory: z.number().optional().nullable(),
    route: z.number().optional().nullable(),
})

type FormSchema = z.infer<typeof filterSchema>

const Route = () => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem('accessToken')

    const [routeData, setRouteData] = useState<DemarcationRoute[]>([])
    const [filteredData, setFilteredData] = useState<DemarcationRoute[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])


    const [channelOptions, setChannelOptions] = useState<any[]>([])
    const [subChannel, setSubChannel] = useState<any[]>([])
    const [area, setArea] = useState<any[]>([])
    const [territory, setTerritory] = useState<any[]>([])

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchema>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            channelId: null,
            subChannelId: null,
            region: null,
            area: null,
            territory: null,
            route: null,
        },
    })

    // ✅ watch selected values
    const selectedChannelId = useWatch({ control, name: 'channelId' })
    const selectedAreaId = useWatch({ control, name: 'area' })

    // ✅ fetch sub-channels when channel changes
    useEffect(() => {
        const loadSubChannels = async () => {
            if (!selectedChannelId) return setSubChannel([])
            try {
                const res = await getAllSubChannelsByChannelId(selectedChannelId)
                setSubChannel(res)
            } catch {
                toast.push(
                    <Alert type="danger" showIcon>
                        Failed to load sub channels.
                    </Alert>
                )
                setSubChannel([])
            }
        }
        loadSubChannels()
    }, [selectedChannelId])

    // ✅ fetch areas
    useEffect(() => {
        const loadAreas = async () => {
            if (!token) {
                return
            }
            try {
                const res = await fetchAreas(token)
                setArea(res)
            } catch {
                toast.push(
                    <Alert type="danger" showIcon>
                        Failed to load areas.
                    </Alert>
                )
            }
        }
        loadAreas()
    }, [token])
  

    // ✅ fetch territories when area changes
    useEffect(() => {
        const loadTerritories = async () => {
            if (!selectedAreaId) return setTerritory([])
            try {
                const res = await getTerritoriesByAreaId(selectedAreaId)
                setTerritory(res)
            } catch {
                toast.push(
                    <Alert type="danger" showIcon>
                        Failed to load territories.
                    </Alert>
                )
                setTerritory([])
            }
        }
        loadTerritories()
    }, [selectedAreaId])

    const onSubmit = async (data: FormSchema) => {
        const { territory: territoryId } = data
        if (!territoryId) {
            setRouteData([])
            setFilteredData([])
            return
        }
        console.log("log territoryId",territoryId)
        try {
            const res = await fetchRoutesByTerritoryId(territoryId)
            setRouteData(res)
            setFilteredData(res)
            if (res.length === 0) {
                toast.push(
                    <Alert type="info" showIcon>
                        No routes found for the selected territory.
                    </Alert>
                )
            }
        } catch {
            toast.push(
                <Alert type="danger" showIcon>
                    Failed to load routes.
                </Alert>
            )
            setRouteData([])
            setFilteredData([])
        }
    }

    // ✅ fetch channels once
    useEffect(() => {
        const loadChannels = async () => {
            try {
                const res = await fetchChannels()
                setChannelOptions(res)
            } catch {
                toast.push(
                    <Alert type="danger" showIcon>
                        Failed to load channels
                    </Alert>,
                )
            }
        }
        loadChannels()
    }, [])

    const columns = useMemo<ColumnDef<DemarcationRoute>[]>(() => [
        { header: 'Territory', accessorKey: 'territoryName' },
        { header: 'Route Code', accessorKey: 'routeCode' },
        { header: 'Route Name', accessorKey: 'routeName' },
        {
            header: 'Is Active',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <Tag className={row.original.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}>
                    {row.original.isActive ? 'Active' : 'Inactive'}
                </Tag>
            ),
        },
        
    ], [])

    const table = useReactTable({
        data: filteredData,
        columns,
        state: { globalFilter, columnFilters },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const routeName = row.original.routeName || ''
            return routeName.toLowerCase().includes(String(filterValue).toLowerCase())
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageSize } },
    })

 


    return (
        <div className="space-y-6">
            <Card>
                <h5 className="mb-4">Filter Routes</h5>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* <FormItem label="Channel">
                            <Controller
                                name="channelId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Channel"
                                        options={channelOptions}
                                        value={channelOptions.find(opt => opt.value === field.value) || null}
                                        onChange={(option) => field.onChange(option?.value ?? null)}
                                    />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Sub Channel">
                            <Controller
                                name="subChannelId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Sub Channel"
                                        options={subChannel}
                                        value={subChannel.find(opt => opt.value === field.value) || null}
                                        onChange={(option) => field.onChange(option?.value ?? null)}
                                    />
                                )}
                            />
                        </FormItem> */}
                         <FormItem
                            label="Areas"
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
                                            value={area.find(option => option.value === field.value) || null}
                                            onChange={(option) => field.onChange(option?.value ?? null)}
                                        />
                                )}
                            />
                        </FormItem>
                        <FormItem label="Territory">
                            <Controller
                                name="territory"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size="sm"
                                        placeholder="Select Territory"
                                        options={territory}
                                        value={territory.find(opt => opt.value === field.value) || null}
                                        onChange={(option) => field.onChange(option?.value ?? null)}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button variant="solid" type="submit">
                            Submit
                        </Button>
                    </div>
                </Form>
            </Card>

            <Card>
                <div className="flex items-center justify-between mb-4">
                    <h5 className="mb-0">Routes</h5>
                    <div className="flex items-center gap-4">
                        <span className="font-semibold">
                            Total Routes: {table.getFilteredRowModel().rows.length}
                        </span>
                        <input
                            className="border px-2 py-1 rounded"
                            placeholder="Search by Route Name..."
                            value={globalFilter}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <Sorter sort={header.column.getIsSorted()} />
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>
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
                        pageSize={table.getState().pagination.pageSize}
                        total={table.getFilteredRowModel().rows.length}
                        onChange={(page) => table.setPageIndex(page - 1)}
                    />
                    <Select
                        size="sm"
                        value={pageSizeOptions.find((opt) => opt.value === pageSize)}
                        onChange={(opt) => {
                            const newSize = opt?.value ?? 10
                            setPageSize(newSize)
                            table.setPageSize(newSize)
                        }}
                        options={pageSizeOptions}
                    />
                </div>
            </Card>

          
        </div>
    )
}

export default Route
