import React, { useMemo, useState, useRef, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import { Button, toast, Alert } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import { FormItem, Form } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Checkbox from '@/components/ui/Checkbox'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

import { z } from 'zod'; 
import { zodResolver } from '@hookform/resolvers/zod'; 

const validationSchema = z.object({
  agency: z.object(
    {
      value: z.string(),
      label: z.string()
    },
    {
      required_error: "Please select an agency",
      invalid_type_error: "Please select an agency"
    }
  ),
  route: z.object(
    {
      value: z.string(),
      label: z.string()
    },
    {
      required_error: "Please select a route",
      invalid_type_error: "Please select a route"
    }
  ),
})

type FormValues = z.infer<typeof validationSchema>

// Interface for shop data
interface Shop {
  id: number;
  shopCode: string;
  shopName: string;
  newTerritory: { value: string; label: string };
  newRoute: { value: string; label: string };
  routeCode: string;
  address1: string;
  address2: string;
  address3: string;
  ownerName: string;
  mobile: string;
  openTime: string;
  closeTime: string;
  latitude: number;
  longitude: number;
  image: string;
}

// Territory options
const territoryOptions = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'central', label: 'Central' },
]

// Route options
const routeOptions = [
  { value: 'route1', label: 'Route Alpha' },
  { value: 'route2', label: 'Route Beta' },
  { value: 'route3', label: 'Route Gamma' },
  { value: 'route4', label: 'Route Delta' },
  { value: 'route5', label: 'Route Epsilon' },
]

// Define DebouncedInput component
interface DebouncedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
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

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
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

// Fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

// Page size options
const pageSizeOptions = [
  { value: 5, label: '5 / page' },
  { value: 10, label: '10 / page' },
  { value: 20, label: '20 / page' },
  { value: 30, label: '30 / page' },
]

// Indeterminate checkbox component for row selection
type CheckBoxChangeEvent = React.ChangeEvent<HTMLInputElement>

interface IndeterminateCheckboxProps extends Omit<React.ComponentProps<typeof Checkbox>, 'onChange'> {
  indeterminate: boolean;
  onChange: (e: CheckBoxChangeEvent) => void;
}

const IndeterminateCheckbox = React.forwardRef<HTMLInputElement, IndeterminateCheckboxProps>(
  ({ indeterminate, onChange, ...rest }, ref) => {
    const defaultRef = useRef<HTMLInputElement>(null)
    const resolvedRef = ref || defaultRef

    useEffect(() => {
      if (typeof resolvedRef === 'object' && resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate
      }
    }, [resolvedRef, indeterminate])

    return (
      <Checkbox
        ref={resolvedRef}
        onChange={(_, e) => onChange(e)}
        {...rest}
      />
    )
  }
)

function ShopTransfer() {
  // Placeholder options data - replace with actual data from your API
  const agencyOptions = [
    { value: 'agency1', label: 'Agency One' },
    { value: 'agency2', label: 'Agency Two' },
    { value: 'agency3', label: 'Agency Three' },
  ]

  const {
    handleSubmit,
    formState: { errors },
    control,
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      agency: undefined,
      route: undefined
    }
  })

  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data)

    // Show success toast
    toast.push(
      <Alert showIcon type="success" className="dark:bg-gray-700 w-64 sm:w-80 md:w-96">
        Shop transfer submitted successfully
      </Alert>,
      {
        offsetX: 5,
        offsetY: 100,
        transitionType: 'fade',
        block: false,
        placement: 'top-end',
      }
    )
  }

  const handleDiscard = () => {
    reset({
      agency: undefined,
      route: undefined
    })
  }

  // Sample data for shops
  const [shops, setShops] = useState<Shop[]>([
    {
      id: 1,
      shopCode: "S001",
      shopName: "Super Mart",
      newTerritory: { value: 'north', label: 'North' },
      newRoute: { value: 'route1', label: 'Route Alpha' },
      routeCode: "RA001",
      address1: "123 Main Street",
      address2: "Downtown",
      address3: "City Center",
      ownerName: "John Doe",
      mobile: "555-1234",
      openTime: "08:00",
      closeTime: "20:00",
      latitude: 40.7128,
      longitude: -74.0060,
      image: "shop1.jpg"
    },
    {
      id: 2,
      shopCode: "S002",
      shopName: "Quick Stop",
      newTerritory: { value: 'south', label: 'South' },
      newRoute: { value: 'route2', label: 'Route Beta' },
      routeCode: "RB002",
      address1: "456 Oak Avenue",
      address2: "Uptown",
      address3: "Business District",
      ownerName: "Jane Smith",
      mobile: "555-5678",
      openTime: "07:30",
      closeTime: "21:00",
      latitude: 34.0522,
      longitude: -118.2437,
      image: "shop2.jpg"
    },
    {
      id: 3,
      shopCode: "S003",
      shopName: "Mega Store",
      newTerritory: { value: 'east', label: 'East' },
      newRoute: { value: 'route3', label: 'Route Gamma' },
      routeCode: "RC003",
      address1: "789 Pine Road",
      address2: "Suburbia",
      address3: "Shopping Complex",
      ownerName: "Robert Johnson",
      mobile: "555-9012",
      openTime: "09:00",
      closeTime: "22:00",
      latitude: 41.8781,
      longitude: -87.6298,
      image: "shop3.jpg"
    },
    {
      id: 4,
      shopCode: "S004",
      shopName: "Corner Shop",
      newTerritory: { value: 'west', label: 'West' },
      newRoute: { value: 'route4', label: 'Route Delta' },
      routeCode: "RD004",
      address1: "101 Maple Lane",
      address2: "Residential Area",
      address3: "Near Park",
      ownerName: "Sarah Williams",
      mobile: "555-3456",
      openTime: "08:00",
      closeTime: "19:30",
      latitude: 37.7749,
      longitude: -122.4194,
      image: "shop4.jpg"
    },
    {
      id: 5,
      shopCode: "S005",
      shopName: "24/7 Convenience",
      newTerritory: { value: 'central', label: 'Central' },
      newRoute: { value: 'route5', label: 'Route Epsilon' },
      routeCode: "RE005",
      address1: "202 Elm Street",
      address2: "City Square",
      address3: "Downtown Plaza",
      ownerName: "Michael Brown",
      mobile: "555-7890",
      openTime: "00:00",
      closeTime: "23:59",
      latitude: 39.9526,
      longitude: -75.1652,
      image: "shop5.jpg"
    }
  ])

  // State for table
  const [globalFilter, setGlobalFilter] = useState('')
  const [pageSize, setPageSize] = useState(5)
  const [rowSelection, setRowSelection] = useState({})

  // Handle territory change
  const handleTerritoryChange = (shopId: number, value: { value: string; label: string }) => {
    setShops(prev => prev.map(shop =>
      shop.id === shopId ? { ...shop, newTerritory: value } : shop
    ))
  }

  // Handle route change
  const handleRouteChange = (shopId: number, value: { value: string; label: string }) => {
    setShops(prev => prev.map(shop =>
      shop.id === shopId ? { ...shop, newRoute: value } : shop
    ))
  }

  // Define columns
  const columns = useMemo<ColumnDef<Shop>[]>(() => [
    {
      id: 'select',
      // Removed the header checkbox as requested
      header: () => null, // Set header to null or a function returning null to hide it
      cell: ({ row }) => (
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
      size: 40,
    },
    { header: 'Shop Code(Old DB)', accessorKey: 'shopCode' },
    { header: 'Shop Name', accessorKey: 'shopName' },
    {
      header: 'New Territory',
      accessorKey: 'newTerritory',
      cell: ({ row }) => (
        <Select
          size="sm"
          options={territoryOptions}
          value={row.original.newTerritory}
          onChange={(option) => option && handleTerritoryChange(row.original.id, option)}
          className="min-w-[120px]"
        />
      )
    },
    {
      header: 'New Route',
      accessorKey: 'newRoute',
      cell: ({ row }) => (
        <Select
          size="sm"
          options={routeOptions}
          value={row.original.newRoute}
          onChange={(option) => option && handleRouteChange(row.original.id, option)}
          className="min-w-[120px]"
        />
      )
    },
    { header: 'Route Code', accessorKey: 'routeCode' },
    { header: 'Address 1', accessorKey: 'address1' },
    { header: 'Address 2', accessorKey: 'address2' },
    { header: 'Address 3', accessorKey: 'address3' },
    { header: 'Owner Name', accessorKey: 'ownerName' },
    { header: 'Mobile', accessorKey: 'mobile' },
    { header: 'Open Time', accessorKey: 'openTime' },
    { header: 'Close Time', accessorKey: 'closeTime' },
    {
      header: 'Latitude',
      accessorKey: 'latitude',
      cell: ({ getValue }) => getValue<number>().toFixed(6)
    },
    {
      header: 'Longitude',
      accessorKey: 'longitude',
      cell: ({ getValue }) => getValue<number>().toFixed(6)
    },
    {
      header: 'Image',
      accessorKey: 'image',
      cell: ({ getValue }) => (
        <div className="flex justify-center">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        </div>
      )
    },
  ], [])

  // Create table instance
  const table = useReactTable({
    data: shops,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: {
      globalFilter,
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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

  const totalData = shops.length

  // Handle table submit - now only submits selected rows
const handleTableSubmit = () => {
  const selectedRowIds = Object.keys(rowSelection)
  const selectedShops = shops.filter(shop =>
    selectedRowIds.includes(shop.id.toString())
  )

  if (selectedRowIds.length === 0) {
    toast.push(
      <Alert showIcon type="warning" className="dark:bg-gray-700 w-64 sm:w-80 md:w-96">
        Please select at least one shop
      </Alert>,
      {
        offsetX: 5,
        offsetY: 100,
        transitionType: 'fade',
        block: false,
        placement: 'top-end',
      }
    )
    return
  }

  console.log('Selected shops submitted:', selectedShops)
  toast.push(
    <Alert showIcon type="success" className="dark:bg-gray-700 w-64 sm:w-80 md:w-96">
      {selectedShops.length} shop(s) transferred successfully
    </Alert>,
    {
      offsetX: 5,
      offsetY: 100,
      transitionType: 'fade',
      block: false,
      placement: 'top-end',
    }
  )
}

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 gap-4">
        {/* First Card */}
        <Card className="border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
          <div className="p-5">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Shop Transfer
            </h3>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                  invalid={Boolean(errors.agency)}
                  errorMessage={errors.agency?.message}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Agency
                  </label>
                  <Controller
                    name="agency"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={agencyOptions}
                        placeholder="Select agency"
                        className="w-full"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormItem>

                <FormItem
                  invalid={Boolean(errors.route)}
                  errorMessage={errors.route?.message}
                >
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Route
                  </label>
                  <Controller
                    name="route"
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={routeOptions}
                        placeholder="Select route"
                        className="w-full"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </FormItem>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end mt-8 space-x-4">
                <Button
                  variant="default"
                  className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-2"
                  onClick={handleDiscard}
                  type="button"
                >
                  Discard
                </Button>
                <Button
                  variant="solid"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md"
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          </div>
        </Card>

        {/* Second Card with Table */}
        <Card className="border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {Object.keys(rowSelection).length > 0 && (
                  <span>
                    {Object.keys(rowSelection).length} shop(s) selected
                  </span>
                )}
              </div>
              <DebouncedInput
                value={globalFilter ?? ''}
                placeholder="Search all columns..."
                onChange={(value) => setGlobalFilter(String(value))}
              />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <THead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <Th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <div
                              className={
                                header.column.getCanSort()
                                  ? 'cursor-pointer select-none flex items-center gap-1'
                                  : 'flex items-center'
                              }
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanSort() && (
                                <Sorter sort={header.column.getIsSorted()} />
                              )}
                            </div>
                          )}
                        </Th>
                      ))}
                    </Tr>
                  ))}
                </THead>
                <TBody>
                  {table.getRowModel().rows.map(row => (
                    <Tr
                      key={row.id}
                      className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        row.getIsSelected() ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      {row.getVisibleCells().map(cell => (
                        <Td key={cell.id} className="py-2 px-3 text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </TBody>
              </Table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
              <Pagination
                pageSize={table.getState().pagination.pageSize}
                currentPage={table.getState().pagination.pageIndex + 1}
                total={totalData}
                onChange={onPaginationChange}
              />
              <div className="min-w-[130px]">
                <Select
                  size="sm"
                  isSearchable={false}
                  value={pageSizeOptions.find(option => option.value === pageSize)}
                  options={pageSizeOptions}
                  onChange={(option) => onSelectChange(option?.value)}
                />
              </div>
            </div>

            {/* Submit button for table card */}
            <div className="flex justify-end mt-8">
              <Button
                variant="solid"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md"
                onClick={handleTableSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ShopTransfer