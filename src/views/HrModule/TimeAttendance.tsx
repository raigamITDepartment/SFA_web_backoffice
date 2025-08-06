import React, { useMemo, useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import { Form, FormItem } from '@/components/ui/Form'
import { Button, Input } from '@/components/ui'
import { useForm, Controller } from 'react-hook-form'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type {
  ColumnDef,
  FilterFn,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { FiFilter, FiSearch } from 'react-icons/fi'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import { toast, Alert, Dialog } from '@/components/ui'

const { DatePickerRange } = DatePicker
const { Tr, Th, Td, THead, TBody, Sorter } = Table

const pageSizeOptions = [
  { value: 10, label: '10 / page' },
  { value: 20, label: '20 / page' },
  { value: 30, label: '30 / page' },
  { value: 40, label: '40 / page' },
  { value: 50, label: '50 / page' },
]

interface TimeAttendanceRow {
  area: string
  territory: string
  range: string
  salesRep: string
  date: string
  checkInTime: string
  checkInDistance: number
  firstMadeCallTime: string
  firstPcTime: string
  timeGap1: string
  lastPcTime: string
  lastMadeCallTime: string
  checkOutTime: string
  timeGap2: string
  checkOutDistance: number
  madeCalls: number
  pc: number
  upc: number
  totalBookingValue: number
  morningStatus: string
  eveningStatus: string
  aseAsmComments: string
  rsmComments: string
  traineeRepName: string
  traineeRepStatus: string
}

const morningStatusOptions = [
  { label: 'Working by Motor Bike', value: 'Working by Motor Bike' },
  { label: 'On Leave', value: 'On Leave' },
  { label: 'Office Work', value: 'Office Work' },
]

const eveningStatusOptions = [
  { label: 'Completed All Visits', value: 'Completed All Visits' },
  { label: 'Incomplete Route', value: 'Incomplete Route' },
  { label: '-', value: '-' },
]

const mockData: TimeAttendanceRow[] = [
  {
    area: 'Sabaragamuwa',
    territory: 'Awissawella',
    range: 'C',
    salesRep: 'awissawellac',
    date: '2025-08-04',
    checkInTime: '07:43',
    checkInDistance: 57,
    firstMadeCallTime: '08:53',
    firstPcTime: '08:53',
    timeGap1: '-6 min',
    lastPcTime: '19:02',
    lastMadeCallTime: '19:02',
    checkOutTime: '16:36',
    timeGap2: '-144 min',
    checkOutDistance: 167,
    madeCalls: 27,
    pc: 27,
    upc: 0,
    totalBookingValue: 121415,
    morningStatus: 'Working by Motor Bike',
    eveningStatus: '-',
    aseAsmComments: 'ok(2025-08-04 21:37:49 - sabaragamuwac)',
    rsmComments: '-',
    traineeRepName: 'N/A',
    traineeRepStatus: 'N/A',
  },
  {
    area: 'Colombo',
    territory: 'Dehiwala',
    range: 'D',
    salesRep: 'dehiwalad',
    date: '2025-08-03',
    checkInTime: '08:10',
    checkInDistance: 45,
    firstMadeCallTime: '08:30',
    firstPcTime: '08:32',
    timeGap1: '22 min',
    lastPcTime: '17:45',
    lastMadeCallTime: '17:50',
    checkOutTime: '18:00',
    timeGap2: '15 min',
    checkOutDistance: 90,
    madeCalls: 30,
    pc: 28,
    upc: 2,
    totalBookingValue: 98450,
    morningStatus: 'Office Work',
    eveningStatus: 'Completed All Visits',
    aseAsmComments: 'Good performance',
    rsmComments: 'Well done',
    traineeRepName: 'N/A',
    traineeRepStatus: 'N/A',
  },
  {
    area: 'Galle',
    territory: 'Matara',
    range: 'S',
    salesRep: 'mataras',
    date: '2025-08-02',
    checkInTime: '09:00',
    checkInDistance: 72,
    firstMadeCallTime: '09:30',
    firstPcTime: '09:45',
    timeGap1: '45 min',
    lastPcTime: '16:10',
    lastMadeCallTime: '16:12',
    checkOutTime: '17:00',
    timeGap2: '50 min',
    checkOutDistance: 120,
    madeCalls: 20,
    pc: 19,
    upc: 1,
    totalBookingValue: 76820,
    morningStatus: 'On Leave',
    eveningStatus: 'Incomplete Route',
    aseAsmComments: '-',
    rsmComments: '-',
    traineeRepName: 'N/A',
    traineeRepStatus: 'N/A',
  },
]

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const TimeAttendance = () => {
  const { control, handleSubmit } = useForm()
  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pageSize, setPageSize] = useState(10)
  const [data, setData] = useState<TimeAttendanceRow[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    setData(mockData)
  }, [])

  const columns = useMemo<ColumnDef<TimeAttendanceRow>[]>(() => [
    { header: 'Area', accessorKey: 'area' },
    { header: 'Territory', accessorKey: 'territory' },
    { header: 'Range', accessorKey: 'range' },
    { header: 'Sales rep', accessorKey: 'salesRep' },
    { header: 'Date', accessorKey: 'date' },
    { header: 'Check In Time', accessorKey: 'checkInTime' },
    { header: 'Check In Distance(m)', accessorKey: 'checkInDistance' },
    { header: 'First Made Call Time', accessorKey: 'firstMadeCallTime' },
    { header: 'First PC Time', accessorKey: 'firstPcTime' },
    { header: 'First Call Time Gap', accessorKey: 'timeGap1' },
    { header: 'Last PC Time', accessorKey: 'lastPcTime' },
    { header: 'Last Made Call Time', accessorKey: 'lastMadeCallTime' },
    { header: 'Check Out Time', accessorKey: 'checkOutTime' },
    { header: 'Last Call Time Gap', accessorKey: 'timeGap2' },
    { header: 'Check Out Distance(m)', accessorKey: 'checkOutDistance' },
    { header: 'Made Calls', accessorKey: 'madeCalls' },
    { header: 'PC', accessorKey: 'pc' },
    { header: 'UPC', accessorKey: 'upc' },
    { header: 'Total Booking Value', accessorKey: 'totalBookingValue' },
    {
      header: 'Morning Status',
      accessorKey: 'morningStatus',
      cell: ({ row }) => {
        const currentValue = row.original.morningStatus
        return (
          <div className="min-w-[180px] w-full">
            <Select
              options={morningStatusOptions}
              value={morningStatusOptions.find(opt => opt.value === currentValue)}
              onChange={(selected) => {
                const updated = [...data]
                updated[row.index] = {
                  ...updated[row.index],
                  morningStatus: selected?.value || '',
                }
                setData(updated)
              }}
              placeholder="Select Status"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              className="z-[999]"
            />
          </div>
        )
      },
    },
    {
      header: 'Evening Status',
      accessorKey: 'eveningStatus',
      cell: ({ row }) => {
        const currentValue = row.original.eveningStatus
        return (
          <div className="min-w-[180px] w-full">
            <Select
              options={eveningStatusOptions}
              value={eveningStatusOptions.find(opt => opt.value === currentValue)}
              onChange={(selected) => {
                const updated = [...data]
                updated[row.index] = {
                  ...updated[row.index],
                  eveningStatus: selected?.value || '',
                }
                setData(updated)
              }}
              placeholder="Select Status"
              menuPortalTarget={document.body}
              styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              className="z-[999]"
            />
          </div>
        )
      },
    },
    {
      header: 'ASE/ASM Comments',
      accessorKey: 'aseAsmComments',
      cell: ({ row }) => {
        const currentValue = row.original.aseAsmComments
        return (
          <Input
            size='lg'
            value={currentValue}
            onChange={(e) => {
              const updated = [...data]
              updated[row.index] = {
                ...updated[row.index],
                aseAsmComments: e.target.value,
              }
              setData(updated)
            }}
            rows={2}
            className="text-xs w-full min-w-[200px]"
          />
        )
      },
    },
    {
      header: 'RSM Comments',
      accessorKey: 'rsmComments',
      cell: ({ row }) => {
        const currentValue = row.original.rsmComments
        return (
          <Input
            value={currentValue}
            onChange={(e) => {
              const updated = [...data]
              updated[row.index] = {
                ...updated[row.index],
                rsmComments: e.target.value,
              }
              setData(updated)
            }}
            rows={2}
            className="text-xs w-full min-w-[200px]"
          />
        )
      },
    },
    { header: 'Trainee Rep Name', accessorKey: 'traineeRepName' },
    { header: 'Trainee Rep Status', accessorKey: 'traineeRepStatus' },
  ], [data])

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
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

  const onSelectChange = (value = 10) => {
    const newSize = Number(value)
    setPageSize(newSize)
    table.setPageSize(newSize)
  }

  const areaOptions = [
    { label: 'Colombo', value: 'colombo' },
    { label: 'Galle', value: 'galle' },
    { label: 'Kandy', value: 'kandy' },
  ]

  const rangeOptions = [
    { label: 'C', value: 'c' },
    { label: 'D', value: 'd' },
    { label: 'S', value: 's' },
  ]

  const onSubmit = (data: any) => {
    console.log('Filter Data:', data)
  }

  const handleUpdate = () => {
    // Perform update logic here
    console.log('Updated data:', data)
    // Success toast is shown in dialog Confirm button
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="mb-6">Time Attendance</h3>
        <div className="flex items-center mb-6 gap-2 text-gray-700 dark:text-gray-200">
          <FiFilter className="text-xl" />
          <h2 className="text-lg font-semibold">Filter Criteria</h2>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormItem label="Select Area">
              <Controller
                name="area"
                control={control}
                render={({ field }) => (
                  <Select options={areaOptions} placeholder="Select Area" {...field} />
                )}
              />
            </FormItem>
            <FormItem label="Select Range">
              <Controller
                name="range"
                control={control}
                render={({ field }) => (
                  <Select options={rangeOptions} placeholder="Select Range" {...field} />
                )}
              />
            </FormItem>
            <FormItem label="Select Date Range">
              <Controller
                name="dateRange"
                control={control}
                render={({ field }) => (
                  <DatePickerRange placeholder="Date Range" {...field} />
                )}
              />
            </FormItem>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="solid">Submit</Button>
          </div>
        </Form>
      </Card>

      <Card>
        <div className="mb-6 mt-6 flex justify-end items-center">
          <div className="flex items-center gap-2">
            <FiSearch className="text-xl text-gray-500" />
            <Input
              className="w-64"
              size="sm"
              placeholder="Search..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="relative z-10 overflow-visible">
          <Table>
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                          onClick={header.column.getToggleSortingHandler()}
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
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td
                      key={cell.id}
                      className="text-xs whitespace-nowrap max-w-[250px] relative z-[20] overflow-visible"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Pagination
            currentPage={table.getState().pagination.pageIndex + 1}
            total={data.length}
            pageSize={table.getState().pagination.pageSize}
            onChange={onPaginationChange}
          />
          <div className="flex items-center gap-4">
            <div className="min-w-[130px]">
              <Select
                size="sm"
                isSearchable={false}
                value={pageSizeOptions.find((opt) => opt.value === pageSize)}
                options={pageSizeOptions}
                onChange={(option) => onSelectChange(option?.value)}
              />
            </div>
          </div>
        </div>
        <div className='mt-4 flex justify-end'>
          <Button variant="solid" onClick={() => setDialogOpen(true)}>
            Update
          </Button>
        </div>
      </Card>
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onRequestClose={() => setDialogOpen(false)}
      >
        <h5 className="mb-4">Confirm Update</h5>
        <p>Are you sure you want to update the attendance data?</p>
        <div className="text-right mt-6">
          <Button className="mr-2" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={() => {
              setDialogOpen(false)
              toast.push(
                <Alert
                  showIcon
                  type="success"
                  className="dark:bg-gray-700 w-64 sm:w-80 md:w-96"
                >
                  Attendance updated successfully!
                </Alert>,
                {
                  offsetX: 5,
                  offsetY: 100,
                  transitionType: 'fade',
                  block: false,
                  placement: 'top-end',
                }
              )
              handleUpdate()
            }}
          >
            Confirm
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default TimeAttendance