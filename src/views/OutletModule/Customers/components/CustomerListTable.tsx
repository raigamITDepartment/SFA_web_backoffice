import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { TbPencil } from 'react-icons/tb'
import { toast, Alert, Button, FormItem } from '@/components/ui'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Tooltip from '@/components/ui/Tooltip'
import Tag from '@/components/ui/Tag'
import DataTable from '@/components/shared/DataTable'

import {
    fetchAreas,
    getTerritoriesByAreaId,
} from '@/services/singupDropdownService'
import {
    fetchRoutesByTerritoryId,
    fetchShopsbyRouteId,
} from '@/services/DemarcationService'

import type { ColumnDef, Row, OnSortParam } from '@/components/shared/DataTable'
import type { TableQueries } from '@/@types/common'

// ---------- Types ----------
interface Option {
    label: string
    value: string
}

export interface DemarcationRoute {
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

export interface Outlet {
    id: string
    outletName: string
    outletCode: string
    outletCategoryName: string
    routeCode: string
    rangeName: string
    address1: string
    address2: string
    address3: string
    ownerName: string
    mobileNo: string
    openTime: string
    closeTime: string
    latitude: string
    longitude: string
    outletSequence: string
    isApproved: boolean
    isClose: boolean
}

export type FormSchema = {
    area: string
    territory: string
    route: string
}

// ---------- Constants ----------
const STATUS_COLORS: Record<string, string> = {
    active: 'bg-emerald-200 text-gray-900',
    closed: 'bg-red-200 text-gray-900',
}

// ---------- Debounced Search ----------
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)
    useEffect(() => setValue(initialValue), [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => onChange(value), debounce)
        return () => clearTimeout(timeout)
    }, [value])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2">Search:</span>
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    size="sm"
                />
            </div>
        </div>
    )
}

// ---------- Page Component ----------
const OutletPage = () => {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [outlets, setOutlets] = useState<Outlet[]>([])
    const [allOutlets, setAllOutlets] = useState<Outlet[]>([])
    const [selectedOutlets, setSelectedOutlets] = useState<Outlet[]>([])
    const [loading, setLoading] = useState(false)
    const [totalOutlets, setTotalOutlets] = useState(0)

    const [tableData, setTableData] = useState<TableQueries>({
        pageIndex: 1,
        pageSize: 10,
        sort: { key: '', order: '' },
    })

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm<FormSchema>()

    const token = sessionStorage.getItem('accessToken')
    const selectedArea = useWatch({ control, name: 'area' })
    const selectedTerritory = useWatch({ control, name: 'territory' })

    const [areas, setAreas] = useState<Option[]>([])
    const [territories, setTerritories] = useState<Option[]>([])
    const [routes, setRoutes] = useState<Option[]>([])

    // ----------- Load dropdowns ------------
    useEffect(() => {
        if (!token) return
        fetchAreas()
            .then(setAreas)
            .catch(() =>
                toast.push(<Alert type="danger">Failed to load areas.</Alert>),
            )
    }, [token])

    useEffect(() => {
        if (!selectedArea) return
        getTerritoriesByAreaId(selectedArea)
            .then((res) => {
                setTerritories(res)
                setValue('territory', '')
                setValue('route', '')
                setRoutes([])
            })
            .catch(() => {
                toast.push(
                    <Alert type="danger">Failed to load territories.</Alert>,
                )
                setTerritories([])
            })
    }, [selectedArea])

    useEffect(() => {
        if (!selectedTerritory) return
        fetchRoutesByTerritoryId(selectedTerritory)
            .then((res) => {
                const formatted = res.map((r: DemarcationRoute) => ({
                    label: r.routeName,
                    value: String(r.id),
                }))
                setRoutes(formatted)
                setValue('route', '')
            })
            .catch(() => {
                toast.push(<Alert type="danger">Failed to load routes.</Alert>)
                setRoutes([])
            })
    }, [selectedTerritory])

    // ------------ Filter Submit ------------
    const onSubmitData = async (data: FormSchema) => {
        setLoading(true)
        try {
            const res = await fetchShopsbyRouteId(data.route)
            setAllOutlets(res)
            setTotalOutlets(res.length)
            setOutlets(res)
            if (res.length === 0) {
                toast.push(
                    <Alert type="info">No shops found for this route.</Alert>,
                )
            }
        } catch {
            toast.push(<Alert type="danger">Failed to load shops.</Alert>)
            setAllOutlets([])
            setOutlets([])
        } finally {
            setLoading(false)
        }
    }

    // ------------ Search Filter ------------
    useEffect(() => {
        if (!search) {
            setOutlets(allOutlets)
            setTotalOutlets(allOutlets.length)
            return
        }
        const lower = search.toLowerCase()
        const filtered = allOutlets.filter((outlet) =>
            Object.values(outlet).some((v) =>
                String(v).toLowerCase().includes(lower),
            ),
        )
        setOutlets(filtered)
        setTotalOutlets(filtered.length)
    }, [search, allOutlets])

    // ------------ Pagination Slice ------------
    const paginatedOutlets = useMemo(() => {
        const pageSize = tableData.pageSize ?? 10
        const pageIndex = tableData.pageIndex ?? 1
        const start = (pageIndex - 1) * pageSize
        const end = start + pageSize
        return outlets.slice(start, end)
    }, [outlets, tableData.pageIndex, tableData.pageSize])

    // ------------ Table Logic ------------
    const handleEdit = (outlet: Outlet) =>
        navigate(`/outlets/edit/${outlet.id}`, { state: { outlet } })
    const handleView = (outlet: Outlet) => navigate(`/outlets/${outlet.id}`)

    const handleRowSelect = (checked: boolean, outlet: Outlet) =>
        setSelectedOutlets((prev) =>
            checked
                ? [...prev, outlet]
                : prev.filter((o) => o.id !== outlet.id),
        )
    const handleAllSelect = (checked: boolean, rows: Row<Outlet>[]) =>
        setSelectedOutlets(checked ? rows.map((row) => row.original) : [])
    const updateTableData = (update: Partial<TableQueries>) =>
        setTableData((prev) => ({ ...prev, ...update }))

    const columns = useMemo<ColumnDef<Outlet>[]>(() => [
        {
            header: 'Name',
            accessorKey: 'outletName',
            cell: ({ row }) => (
                <Link
                    className="font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap truncate block max-w-[200px]"
                    to={`/outlets/${row.original.id}`}
                >
                    {row.original.outletName}
                </Link>
            )
        },
        { header: 'Outlet ID', accessorKey: 'outletCode' },
        { header: 'Category', accessorKey: 'outletCategoryName' },
        { header: 'Route', accessorKey: 'routeCode' },
        { header: 'Range', accessorKey: 'rangeName' },
        { header: 'Owner', accessorKey: 'ownerName' },
        { header: 'Mobile', accessorKey: 'mobileNo' },
        {
            header: 'Approved',
            accessorKey: 'isApproved',
            cell: ({ row }) => (
                <Tag
                    className={
                        row.original.isApproved === true
                            ? 'bg-emerald-200 text-gray-900'
                            : 'bg-red-200 text-gray-900'
                    }
                >
                    {row.original.isApproved === true
                        ? 'Approved'
                        : 'Not Approved'}
                </Tag>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'isClose',
            cell: ({ row }) => (
                <Tag
                    className={
                        row.original.isClose
                            ? STATUS_COLORS.closed
                            : STATUS_COLORS.active
                    }
                >
                    {row.original.isClose ? 'Closed' : 'Active'}
                </Tag>
            ),
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Tooltip title="Edit">
                        <div
                            className="cursor-pointer"
                            onClick={() => handleEdit(row.original)}
                        >
                            <TbPencil />
                        </div>
                    </Tooltip>
                </div>
            ),
        },
    ], [])

    return (
        <>
            {/* ---------- Filter Form ---------- */}
            <form onSubmit={handleSubmit(onSubmitData)} className="mb-6">
                <h5 className="mb-4">Filter Outlets</h5>
                <div className="flex flex-wrap gap-4">
                    <FormItem
                        label="Area"
                        invalid={!!errors.area}
                        errorMessage={errors.area?.message}
                    >
                        <Controller
                            name="area"
                            control={control}
                            rules={{ required: 'Area is required' }}
                            render={({ field }) => (
                                <Select
                                    size="sm"
                                    placeholder="Select Area"
                                    options={areas}
                                    value={
                                        areas.find(
                                            (opt) => opt.value === field.value,
                                        ) || null
                                    }
                                    onChange={(opt) =>
                                        field.onChange(opt?.value ?? '')
                                    }
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
                            rules={{ required: 'Territory is required' }}
                            render={({ field }) => (
                                <Select
                                    size="sm"
                                    placeholder="Select Territory"
                                    options={territories}
                                    value={
                                        territories.find(
                                            (opt) => opt.value === field.value,
                                        ) || null
                                    }
                                    onChange={(opt) =>
                                        field.onChange(opt?.value ?? '')
                                    }
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
                            rules={{ required: 'Route is required' }}
                            render={({ field }) => (
                                <Select
                                    size="sm"
                                    placeholder="Select Route"
                                    options={routes}
                                    value={
                                        routes.find(
                                            (opt) => opt.value === field.value,
                                        ) || null
                                    }
                                    onChange={(opt) =>
                                        field.onChange(opt?.value ?? '')
                                    }
                                />
                            )}
                        />
                    </FormItem>

                    <div className="flex items-end">
                        <Button type="submit" variant="solid">
                            Submit
                        </Button>
                    </div>
                </div>
            </form>

            {/* ---------- Search ---------- */}
            <DebouncedInput
                value={search}
                onChange={(value) => setSearch(String(value))}
                placeholder="Search outlets..."
            />

            {/* ---------- DataTable ---------- */}
            <DataTable
                selectable
                columns={columns}
                data={paginatedOutlets}
                loading={loading}
                pagingData={{
                    total: totalOutlets,
                    pageIndex: tableData.pageIndex!,
                    pageSize: tableData.pageSize!,
                }}
                onPaginationChange={(page) =>
                    updateTableData({ pageIndex: page })
                }
                onSelectChange={(size) => updateTableData({ pageSize: size })}
                onSort={(sort) => updateTableData({ sort })}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllSelect}
                checkboxChecked={(outlet) =>
                    selectedOutlets.some((o) => o.id === outlet.id)
                }
            />
        </>
    )
}

export default OutletPage
