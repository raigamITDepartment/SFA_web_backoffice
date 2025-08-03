import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, ColumnSort } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import DatePicker from '@/components/ui/DatePicker'
import Dialog from '@/components/ui/Dialog'
import { Button, toast, Alert } from '@/components/ui'
import { FaRegEdit } from 'react-icons/fa'
import { MdBlock } from 'react-icons/md'

const { Tr, Th, Td, THead, TBody, Sorter } = Table
const { DatePickerRange } = DatePicker

interface Invoice {
  id: number
  invoiceNo: string
  invoiceType?: string
  routeCode: string
  shopCode: string
  customer: string
  agencyCode: string
  value: number
  source?: 'Web' | 'Mobile'
  status: string
  date: string
}

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
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
    <Input
      size="sm"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const pageSizeOptions = [
  { value: 10, label: '10 / page' },
  { value: 20, label: '20 / page' },
  { value: 30, label: '30 / page' },
  { value: 40, label: '40 / page' },
  { value: 50, label: '50 / page' },
]

const statusOptions = [
  { value: 'Print', label: 'Print' },
  { value: 'Late Delivery', label: 'Late Delivery' },
]

export default function PrintBill() {
  const agencyName = "Example Agency"
  const distributorName = "Example Distributor"
  const territory = "Central"
  const navigate = useNavigate()

  const [data, setData] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNo: 'INV-2023-001',
      value: 1500.0,
      status: 'Print',
      date: '2023-07-01',
      invoiceType: 'Normal',
      source: 'Mobile',
      routeCode: 'R001',
      shopCode: 'S001',
      customer: 'John Traders',
      agencyCode: 'AG001',
    },
    {
      id: 2,
      invoiceNo: 'INV-2023-002',
      value: 2300.5,
      status: 'Print',
      date: '2023-07-03',
      invoiceType: 'Company',
      source: 'Web',
      routeCode: 'R002',
      shopCode: 'S002',
      customer: 'Green Mart',
      agencyCode: 'AG002',
    },
    {
      id: 3,
      invoiceNo: 'INV-2023-003',
      value: 1750.75,
      status: 'Print',
      date: '2023-07-05',
      invoiceType: 'Agency',
      source: 'Mobile',
      routeCode: 'R003',
      shopCode: 'S003',
      customer: 'Fresh Foods',
      agencyCode: 'AG003',
    },
    {
      id: 4,
      invoiceNo: 'INV-2023-004',
      value: 4200.0,
      status: 'Print',
      date: '2023-07-01',
      invoiceType: 'Normal',
      source: 'Web',
      routeCode: 'R001',
      shopCode: 'S004',
      customer: 'Mega Store',
      agencyCode: 'AG001',
    },
    {
      id: 5,
      invoiceNo: 'INV-2023-005',
      value: 3100.0,
      status: 'Print',
      date: '2023-07-04',
      invoiceType: 'Company',
      source: 'Mobile',
      routeCode: 'R004',
      shopCode: 'S005',
      customer: 'Quick Buy',
      agencyCode: 'AG002',
    },
    {
      id: 6,
      invoiceNo: 'INV-2023-006',
      value: 1980.25,
      status: 'Print',
      date: '2023-07-05',
      invoiceType: 'Agency',
      source: 'Mobile',
      routeCode: 'R002',
      shopCode: 'S006',
      customer: 'City Grocers',
      agencyCode: 'AG003',
    },
    {
      id: 7,
      invoiceNo: 'INV-2023-007',
      value: 2750.0,
      status: 'Print',
      date: '2023-07-06',
      invoiceType: 'Normal',
      source: 'Mobile',
      routeCode: 'R005',
      shopCode: 'S007',
      customer: 'Corner Market',
      agencyCode: 'AG001',
    },
    {
      id: 8,
      invoiceNo: 'INV-2023-008',
      value: 3600.9,
      status: 'Print',
      date: '2023-07-06',
      invoiceType: 'Company',
      source: 'Web',
      routeCode: 'R003',
      shopCode: 'S008',
      customer: 'Daily Needs',
      agencyCode: 'AG002',
    },
  ])

  const [sorting, setSorting] = useState<ColumnSort[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [pageSize, setPageSize] = useState(10)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [invoiceToCancel, setInvoiceToCancel] = useState<Invoice | null>(null)
  const [cancelRemark, setCancelRemark] = useState('')

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.date)
      const [from, to] = dateRange
      return (!from || itemDate >= from) && (!to || itemDate <= to)
    })
  }, [data, dateRange])

  const handleStatusChange = (invoiceId: number, newStatus: string) => {
    setData((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: newStatus } : inv
      )
    )
  }

  const handleEdit = (invoice: Invoice) => {
    navigate(`/EditBill/${invoice.id}`)
  }

  const handleSubmit = () => {
    setDialogIsOpen(true)
  }
  const handleDialogConfirm = () => {
    setDialogIsOpen(false)
    toast.push(
      <Alert showIcon type="success" className="dark:bg-gray-700 w-80">
        Invoice data submitted successfully
      </Alert>,
      { offsetX: 5, offsetY: 100, transitionType: 'fade', placement: 'top-end' }
    )
    console.log('Submitting invoice data:', data)
  }
  const handleDialogClose = () => setDialogIsOpen(false)

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    { header: 'Invoice Type', accessorKey: 'invoiceType' },
    { header: 'Agency Code', accessorKey: 'agencyCode' },
    { header: 'Route Code', accessorKey: 'routeCode' },
    { header: 'Shop Code', accessorKey: 'shopCode' },
    { header: 'Customer', accessorKey: 'customer' },
    {
      header: 'Value',
      accessorKey: 'value',
      cell: ({ getValue }) => (
        <div className="flex items-center justify-end font-semibold text-right pr-2">
          <span>Rs.</span>
          <span>
            {getValue<number>().toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      ),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: ({ getValue }) => {
        const dateStr = getValue<string>()
        return new Date(dateStr).toLocaleDateString()
      },
    },
    {
      header: 'Source',
      accessorKey: 'source',
      cell: ({ getValue }) => {
        const src = getValue<'Web' | 'Mobile'>()
        return (
          <span
            className={`inline-flex items-center gap-x-1 px-2 py-1 rounded-full text-xs font-medium ${src === 'Web'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}
          >
            <span>{src === 'Web' ? '🌐' : '📱'}</span>
            {src}
          </span>
        )
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Select
          size="sm"
          options={statusOptions}
          value={statusOptions.find((o) => o.value === row.original.status)}
          onChange={(opt) =>
            handleStatusChange(row.original.id, opt?.value || 'Print')
          }
          className="min-w-[120px]"
        />
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <FaRegEdit
            onClick={() => handleEdit(row.original)}
            className="cursor-pointer text-primary-deep text-lg hover:text-blue-700"
          />
          <MdBlock
            onClick={() => {
              setInvoiceToCancel(row.original)
              setCancelRemark('')
              setCancelDialogOpen(true)
            }}
            className="cursor-pointer text-red-600 text-lg hover:text-red-800"
            title="Cancel Invoice"
          />
        </div>
      ),
    },
  ], [])

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize } },
  })

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      <Card className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
        <div className="p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-16 h-16 flex items-center justify-center shadow-md border border-blue-200 dark:border-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{agencyName}</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Distributor</div>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{distributorName}</div>
              </div>
              <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Territory</div>
                <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{territory}</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Booking Invoice List</h3>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="mr-2">Search:</span>
            <DebouncedInput
              value={globalFilter}
              onChange={(v) => setGlobalFilter(String(v))}
              placeholder="Search all columns..."
              className="w-64"
            />
          </div>
          <div className="w-64">
            <DatePickerRange
              value={dateRange}
              onChange={(r) => setDateRange(r)}
              placeholder="Select date range"
              clearable
              size="sm"
            />
          </div>
        </div>

        <Table>
          <THead>
            {table.getHeaderGroups().map((hg) => (
              <Tr key={hg.id}>
                {hg.headers.map((header) => (
                  <Th key={header.id}>
                    <div
                      className={header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-1' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && <Sorter sort={header.column.getIsSorted()} />}
                    </div>
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>

          <TBody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                ))}
              </Tr>
            ))}
          </TBody>
        </Table>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            currentPage={table.getState().pagination.pageIndex + 1}
            total={filteredData.length}
            onChange={(p) => table.setPageIndex(p - 1)}
          />
          <div className="min-w-[130px]">
            <Select
              size="sm"
              isSearchable={false}
              value={pageSizeOptions.find((o) => o.value === pageSize)}
              options={pageSizeOptions}
              onChange={(opt) => {
                const s = opt?.value ?? 10
                setPageSize(s)
                table.setPageSize(s)
              }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button variant="solid" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 shadow-md" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </Card>

      {/* Submit Confirmation */}
      <Dialog isOpen={dialogIsOpen} onClose={handleDialogClose} onRequestClose={handleDialogClose}>
        <h5 className="mb-4">Confirm Submission</h5>
        <p>Are you sure you want to submit all invoice changes?</p>
        <div className="text-right mt-6 space-x-2">
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button variant="solid" onClick={handleDialogConfirm}>Confirm Submit</Button>
        </div>
      </Dialog>

      {/* Cancel Confirmation */}
      <Dialog isOpen={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} onRequestClose={() => setCancelDialogOpen(false)}>
        <h5 className="mb-4">Cancel Invoice</h5>
        <p className="mb-4">
          Are you sure you want to cancel invoice <b>{invoiceToCancel?.invoiceNo}</b>?
        </p>
        <div className="mb-4">
          <Input
            size="sm"
            placeholder="Enter cancel remark"
            value={cancelRemark}
            onChange={(e) => setCancelRemark(e.target.value)}
            className={cancelRemark.trim() === '' ? 'border-red-500' : ''}
          />
        </div>
        <div className="text-right space-x-2">
          <Button onClick={() => setCancelDialogOpen(false)}>Cancel</Button>
          <Button
            variant="solid"
            disabled={!cancelRemark.trim()}
            onClick={() => {
              if (!cancelRemark.trim()) {
                toast.push(
                  <Alert showIcon type="danger" className="dark:bg-gray-700 w-80">
                    Please enter a cancel remark.
                  </Alert>,
                  { offsetX: 5, offsetY: 100, transitionType: 'fade', placement: 'top-end' }
                )
                return
              }
              setData((prev) =>
                prev.map((inv) =>
                  inv.id === invoiceToCancel?.id ? { ...inv, status: 'Cancel' } : inv
                )
              )
              toast.push(
                <Alert showIcon type="danger" className="dark:bg-gray-700 w-80">
                  Invoice {invoiceToCancel?.invoiceNo} canceled. Remark: {cancelRemark}
                </Alert>,
                { offsetX: 5, offsetY: 100, transitionType: 'fade', placement: 'top-end' }
              )
              setCancelDialogOpen(false)
            }}
          >
            Confirm
          </Button>
        </div>
      </Dialog>

    </div>
  )
}
