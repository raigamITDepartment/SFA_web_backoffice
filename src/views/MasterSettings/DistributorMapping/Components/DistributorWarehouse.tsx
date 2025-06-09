import React, { useMemo, useState, useRef, Component, ReactNode } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Card from '@/components/ui/Card'
import Pagination from '@/components/ui/Pagination'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import Checkbox from '@/components/ui/Checkbox'
import Button from '@/components/ui/Button'
import { FaRegEdit } from "react-icons/fa"
import { MdDeleteOutline } from "react-icons/md"
import Tag from '@/components/ui/Tag'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { LoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { Library } from '@googlemaps/js-api-loader'

type FormSchema = {
    distributor: string
    warehouseName: string
    isActive: boolean
    location: string
}

const distributorOptions = [
    { label: 'Distributor 1', value: 'Distributor 1' },
    { label: 'Distributor 2', value: 'Distributor 2' },
    { label: 'Distributor 3', value: 'Distributor 3' },
    { label: 'Distributor 4', value: 'Distributor 4' },
    { label: 'Distributor 5', value: 'Distributor 5' },
]

type WarehouseRow = {
    distributor: string
    warehouseName: string
    isActive: boolean
    location: string
    lat?: number
    lng?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({ itemRank })
    return itemRank.passed
}

const libraries: Library[] = ['places']

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
    constructor(props: any) {
        super(props)
        this.state = { hasError: false }
    }
    static getDerivedStateFromError() {
        return { hasError: true }
    }
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("Error caught in ErrorBoundary:", error, errorInfo)
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center justify-center min-h-screen bg-white px-6">
                    <div className="text-center p-10 bg-gray-50 rounded-lg shadow-lg max-w-md w-full">
                        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Something went wrong.</h1>
                        <p className="text-gray-600 text-lg">Please try refreshing the page or come back later.</p>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}

function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }: any) {
    const [value, setValue] = useState(initialValue)
    React.useEffect(() => { setValue(initialValue) }, [initialValue])
    React.useEffect(() => {
        const timeout = setTimeout(() => { onChange(value) }, debounce)
        return () => clearTimeout(timeout)
    }, [value, onChange, debounce])
    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2 text-gray-700 font-semibold">Search:</span>
                <Input size='sm' {...props} value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        </div>
    )
}

function DistributorWarehouse() {
    const [rows, setRows] = useState<WarehouseRow[]>([
        { distributor: 'Distributor 1', warehouseName: 'Warehouse A', isActive: true, location: 'Colombo', lat: 6.9271, lng: 79.8612 },
        { distributor: 'Distributor 2', warehouseName: 'Warehouse B', isActive: false, location: 'Kandy', lat: 7.2906, lng: 80.6337 },
    ])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [pageSize, setPageSize] = useState(10)
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
    const [scriptLoaded, setScriptLoaded] = useState(false)
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 7.8731, lng: 80.7718 })
    const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null)

    const handleEdit = (row: WarehouseRow) => {
        // Implement edit functionality here
        console.log('Edit:', row)
    }

    const handleDelete = (idx: number) => {
        setRows(prev => prev.filter((_, i) => i !== idx))
    }

    const columns = useMemo<ColumnDef<WarehouseRow>[]>(() => [
        {
            header: 'Distributor',
            accessorKey: 'distributor',
        },
        {
            header: 'Warehouse Name',
            accessorKey: 'warehouseName',
        },
        {
            header: 'Location',
            accessorKey: 'location',
        },
        {
            header: 'Is Active',
            accessorKey: 'isActive',
            cell: ({ row }) => (
                <Tag className={row.original.isActive
                    ? "bg-green-100 text-green-700 rounded px-2 py-1 font-medium"
                    : "bg-red-100 text-red-700 rounded px-2 py-1 font-medium"}>
                    {row.original.isActive ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            header: 'Action',
            accessorKey: 'action',
            cell: ({ row }) => (
                <div className="flex ">
                    <FaRegEdit onClick={() => handleEdit(row.original)} className="cursor-pointer mr-4 text-primary-deep text-lg" />
                    <MdDeleteOutline onClick={() => handleDelete(row.index)} className="cursor-pointer text-red-600 text-xl" />
                </div>
            ),
        },
    ], [rows])

    const table = useReactTable({
        data: rows,
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
        initialState: { pagination: { pageSize } },
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        const newSize = Number(value)
        setPageSize(newSize)
        table.setPageSize(newSize)
    }

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            distributor: '',
            warehouseName: '',
            isActive: true,
            location: '',
        },
    })

    const onSubmit = async (values: FormSchema) => {
        setRows(prev => [...prev, { ...values, lat: marker?.lat, lng: marker?.lng }])
        reset()
        setMarker(null)
        setMapCenter({ lat: 7.8731, lng: 80.7718 })
    }

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-white text-gray-800 py-16 px-6 max-w-7xl mx-auto">
                <LoadScript
                    googleMapsApiKey={'AIzaSyBTEKJ5XFCCr0IrmAXf4VptQV76hc7IAZA'}
                    libraries={libraries}
                    onLoad={() => setScriptLoaded(true)}
                    onError={(error) => console.error("Error loading Google Maps script:", error)}
                    preventGoogleFontsLoading={true}
                >
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Form Card */}
                        <Card bordered={false} className="lg:w-1/3 xl:w-1/3 rounded-xl shadow-md p-6 h-fit">
                            <h5 className='mb-5'>Distributor Warehouse Mapping</h5>
                            <Form size="sm" onSubmit={handleSubmit(onSubmit)} noValidate>
                                <FormItem
                                    label="Select Distributor"
                                    invalid={Boolean(errors.distributor)}
                                    errorMessage={errors.distributor?.message}
                                >
                                    <Controller
                                        name="distributor"
                                        control={control}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                            <Select
                                                size="sm"
                                                placeholder="Select Distributor"
                                                options={distributorOptions}
                                                value={distributorOptions.find(opt => opt.value === field.value) || null}
                                                onChange={option => field.onChange(option ? option.value : '')}
                                            />
                                        )}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Warehouse Name"
                                    invalid={Boolean(errors.warehouseName)}
                                    errorMessage={errors.warehouseName?.message}
                                >
                                    <Controller
                                        name="warehouseName"
                                        control={control}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Warehouse Name"
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>

                                <FormItem
                                    label="Location"
                                    invalid={Boolean(errors.location)}
                                    errorMessage={errors.location?.message}
                                >
                                    <Controller
                                        name="location"
                                        control={control}
                                        rules={{ required: 'Required' }}
                                        render={({ field }) =>
                                            scriptLoaded ? (
                                                <>
                                                    <Autocomplete
                                                        onLoad={(autocomplete) => {
                                                            autocompleteRef.current = autocomplete
                                                        }}
                                                        onPlaceChanged={() => {
                                                            const place = autocompleteRef.current?.getPlace()
                                                            if (place && place.formatted_address) {
                                                                field.onChange(place.formatted_address)
                                                                if (place.geometry && place.geometry.location) {
                                                                    const lat = place.geometry.location.lat()
                                                                    const lng = place.geometry.location.lng()
                                                                    setMapCenter({ lat, lng })
                                                                    setMarker({ lat, lng })
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <Input
                                                            type="text"
                                                            autoComplete="off"
                                                            placeholder="Search Location"
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.value)}
                                                        />
                                                    </Autocomplete>
                                                    <div className="my-4 rounded-lg overflow-hidden shadow border border-gray-200">
                                                        <GoogleMap
                                                            mapContainerStyle={{
                                                                height: '250px',
                                                                width: '100vw',
                                                                borderRadius: '12px'
                                                            }}
                                                            center={mapCenter}
                                                            zoom={14}
                                                            options={{
                                                                // Classic look: no styles property
                                                                disableDefaultUI: true,
                                                                zoomControl: true,
                                                                fullscreenControl: true,
                                                            }}
                                                        >
                                                            {marker && (
                                                                <Marker position={marker} />
                                                            )}
                                                        </GoogleMap>
                                                    </div>
                                                </>
                                            ) : (
                                                <Input
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder="Search Location"
                                                    disabled
                                                />
                                            )
                                        }
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
                                    <Button variant="solid" block type="submit" className="mt-4">
                                        Create
                                    </Button>
                                </FormItem>
                            </Form>
                        </Card>

                        {/* Table Card */}
                        <Card bordered={false} className="lg:w-2/3 xl:w-2/3 rounded-xl shadow-md p-6 h-fit overflow-auto">
                            <DebouncedInput
                                value={globalFilter ?? ''}
                                className="font-sm shadow border border-gray-300 rounded px-3 py-1"
                                placeholder="Search all columns..."
                                onChange={(value: string) => setGlobalFilter(String(value))}
                            />
                            <Table className="mt-4">
                                <THead>
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <Tr key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => (
                                                <Th key={header.id} colSpan={header.colSpan} className="text-left">
                                                    {header.isPlaceholder ? null : (
                                                        <div
                                                            className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center space-x-1' : ''}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                            aria-label="sort"
                                                            tabIndex={0}
                                                        >
                                                            <span className="font-semibold text-gray-900">
                                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                            </span>
                                                            <Sorter sort={header.column.getIsSorted()} />
                                                        </div>
                                                    )}
                                                </Th>
                                            ))}
                                        </Tr>
                                    ))}
                                </THead>
                                <TBody>
                                    {table.getRowModel().rows.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={columns.length} className="text-center py-6 text-gray-500">
                                                No data found.
                                            </Td>
                                        </Tr>
                                    ) : (
                                        table.getRowModel().rows.map((row) => (
                                            <Tr key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <Td key={cell.id} className="py-2 text-sm text-gray-700">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </Td>
                                                ))}
                                            </Tr>
                                        ))
                                    )}
                                </TBody>
                            </Table>

                            <div className="flex items-center justify-between mt-6">
                                <Pagination
                                    pageSize={table.getState().pagination.pageSize}
                                    currentPage={table.getState().pagination.pageIndex + 1}
                                    total={rows.length}
                                    onChange={onPaginationChange}
                                />
                                <div style={{ minWidth: 130 }}>
                                    <Select
                                        size="sm"
                                        isSearchable={false}
                                        value={pageSizeOptions.find(option => option.value === pageSize)}
                                        options={pageSizeOptions}
                                        onChange={(option) => onSelectChange(option?.value)}
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>
                </LoadScript>
            </div>
        </ErrorBoundary>
    )
}

export default DistributorWarehouse