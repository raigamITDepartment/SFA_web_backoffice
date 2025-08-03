import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Table from '@/components/ui/Table';
import Pagination from '@/components/ui/Pagination';
import { FiEye } from 'react-icons/fi';
import DatePicker from '@/components/ui/DatePicker';

import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import type { ColumnDef, FilterFn, ColumnSort } from '@tanstack/react-table';
import type { InputHTMLAttributes } from 'react';
import dayjs from 'dayjs';

const { Tr, Th, Td, THead, TBody, Sorter } = Table;
const { DatePickerRange } = DatePicker;

interface Invoice {
  id: number;
  invoiceNo: string;
  invoiceType: 'Normal' | 'Agency';
  type: 'Actual' | 'Booking'; // used as Status
  agencyCode: string;
  routeCode: string;
  shopCode: string;
  customer: string;
  source: 'Web' | 'Mobile';
  bookingValue: number;
  marketReturnValue: number;
  goodReturnValue: number;
  freeIssue: number;
  discountPercentage: number;
  actualValue: number;
  bookingDate: string;
  actualDate: string;
}

interface DebouncedInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);
    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <Input
      size="sm"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const pageSizeOptions = [
  { value: 10, label: '10 / page' },
  { value: 20, label: '20 / page' },
  { value: 30, label: '30 / page' },
  { value: 40, label: '40 / page' },
  { value: 50, label: '50 / page' },
];

const typeOptions = [
  { value: '', label: 'All' },
  { value: 'Actual', label: 'Actual' },
  { value: 'Booking', label: 'Booking' },
];

const invoiceTypeOptions = [
  { value: '', label: 'All' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Agency', label: 'Agency' },
];

function ViewInvoices() {
  const distributorName = 'Example Distributor';
  const territory = 'Central';
  const agencyName = 'Example Agency';
  const navigate = useNavigate();

  // Data state
  const [data, setData] = useState<Invoice[]>([
    { id: 1, invoiceNo: 'INV-2023-001', invoiceType: 'Normal', type: 'Actual', agencyCode: 'AG001', routeCode: 'RT001', shopCode: 'SH001', customer: 'John Traders', source: 'Mobile', bookingValue: 1500, marketReturnValue: 100, goodReturnValue: 50, freeIssue: 0, discountPercentage: 5, actualValue: 1350, bookingDate: '2023-07-01', actualDate: '2023-07-02' },
    { id: 2, invoiceNo: 'INV-2023-002', invoiceType: 'Agency', type: 'Booking', agencyCode: 'AG002', routeCode: 'RT002', shopCode: 'SH002', customer: 'Green Mart', source: 'Web', bookingValue: 2300, marketReturnValue: 200, goodReturnValue: 100, freeIssue: 50, discountPercentage: 10, actualValue: 1950, bookingDate: '2023-07-01', actualDate: '2023-07-03' },
    { id: 3, invoiceNo: 'INV-2023-003', invoiceType: 'Agency', type: 'Actual', agencyCode: 'AG003', routeCode: 'RT003', shopCode: 'SH003', customer: 'Fresh Foods', source: 'Mobile', bookingValue: 1800, marketReturnValue: 150, goodReturnValue: 75, freeIssue: 25, discountPercentage: 8, actualValue: 1600, bookingDate: '2023-07-02', actualDate: '2023-07-04' },
    { id: 4, invoiceNo: 'INV-2023-004', invoiceType: 'Normal', type: 'Actual', agencyCode: 'AG001', routeCode: 'RT004', shopCode: 'SH004', customer: 'Mega Store', source: 'Web', bookingValue: 4200, marketReturnValue: 300, goodReturnValue: 120, freeIssue: 100, discountPercentage: 7, actualValue: 3680, bookingDate: '2023-07-03', actualDate: '2023-07-05' },
    { id: 5, invoiceNo: 'INV-2023-005', invoiceType: 'Agency', type: 'Booking', agencyCode: 'AG002', routeCode: 'RT005', shopCode: 'SH005', customer: 'Quick Buy', source: 'Mobile', bookingValue: 3100, marketReturnValue: 180, goodReturnValue: 90, freeIssue: 60, discountPercentage: 6, actualValue: 2770, bookingDate: '2023-07-04', actualDate: '2023-07-06' },
    { id: 6, invoiceNo: 'INV-2023-006', invoiceType: 'Agency', type: 'Actual', agencyCode: 'AG003', routeCode: 'RT006', shopCode: 'SH006', customer: 'City Grocers', source: 'Web', bookingValue: 1980, marketReturnValue: 120, goodReturnValue: 60, freeIssue: 30, discountPercentage: 8, actualValue: 1770, bookingDate: '2023-07-05', actualDate: '2023-07-07' },
    { id: 7, invoiceNo: 'INV-2023-007', invoiceType: 'Normal', type: 'Booking', agencyCode: 'AG001', routeCode: 'RT007', shopCode: 'SH007', customer: 'Corner Market', source: 'Mobile', bookingValue: 2750, marketReturnValue: 150, goodReturnValue: 75, freeIssue: 40, discountPercentage: 5, actualValue: 2485, bookingDate: '2023-07-06', actualDate: '2023-07-08' },
    { id: 8, invoiceNo: 'INV-2023-008', invoiceType: 'Normal', type: 'Actual', agencyCode: 'AG002', routeCode: 'RT008', shopCode: 'SH008', customer: 'Daily Needs', source: 'Web', bookingValue: 3600, marketReturnValue: 250, goodReturnValue: 125, freeIssue: 80, discountPercentage: 10, actualValue: 3145, bookingDate: '2023-07-06', actualDate: '2023-07-09' },
    { id: 9, invoiceNo: 'INV-2023-009', invoiceType: 'Agency', type: 'Booking', agencyCode: 'AG003', routeCode: 'RT009', shopCode: 'SH009', customer: 'Urban Mart', source: 'Mobile', bookingValue: 2200, marketReturnValue: 140, goodReturnValue: 70, freeIssue: 35, discountPercentage: 7, actualValue: 1955, bookingDate: '2023-07-07', actualDate: '2023-07-10' },
    { id: 10, invoiceNo: 'INV-2023-010', invoiceType: 'Normal', type: 'Actual', agencyCode: 'AG001', routeCode: 'RT010', shopCode: 'SH010', customer: 'Family Store', source: 'Web', bookingValue: 2900, marketReturnValue: 190, goodReturnValue: 95, freeIssue: 55, discountPercentage: 8, actualValue: 2560, bookingDate: '2023-07-08', actualDate: '2023-07-11' },
  ]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<ColumnSort[]>([{ id: 'bookingDate', desc: true }]);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesStatus = !statusFilter || item.type === statusFilter;
      const matchesInvoiceType = !invoiceTypeFilter || item.invoiceType === invoiceTypeFilter;
      const itemDate = new Date(item.bookingDate);
      const [from, to] = dateRange;
      const matchesDate = (!from || itemDate >= from) && (!to || itemDate <= to);
      return matchesStatus && matchesInvoiceType && matchesDate;
    });
  }, [data, statusFilter, invoiceTypeFilter, dateRange]);

  const handleView = (invoice: Invoice) => {
    navigate(`/invoice-details/${invoice.id}`);
  };

 

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace('₹', 'Rs. ');

  const columns = useMemo<ColumnDef<Invoice>[]>(() => [
    { header: 'Invoice No', accessorKey: 'invoiceNo' },
    {
      header: 'Invoice Type',
      accessorKey: 'invoiceType',
      cell: ({ getValue }) => {
        const type = getValue<'Normal' | 'Agency'>();
        const colorMap = {
          Normal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          Agency: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[type]}`}>
            {type}
          </span>
        );
      },
    },
    {
      header: 'Status',
      accessorKey: 'type',
      cell: ({ getValue }) => {
        const status = getValue<'Actual' | 'Booking'>();
        const colorMap = {
          Actual: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          Booking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[status]}`}>
            {status}
          </span>
        );
      },
    },
    { header: 'Agency Code', accessorKey: 'agencyCode' },
    { header: 'Route Code', accessorKey: 'routeCode' },
    { header: 'Shop Code', accessorKey: 'shopCode' },
    { header: 'Customer', accessorKey: 'customer' },
    {
      header: 'Source',
      accessorKey: 'source',
      cell: ({ getValue }) => {
        const source = getValue<'Web' | 'Mobile'>();
        return (
          <span
            className={`inline-flex items-center gap-x-1 px-2 py-1 rounded-full text-xs font-medium ${source === 'Web'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              }`}
          >
            <span>{source === 'Web' ? '🌐' : '📱'}</span>
            <span>{source}</span>
          </span>
        );
      },
    },
    {
      header: 'Booking Value',
      accessorKey: 'bookingValue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>,
    },
    {
      header: 'Market Return Value',
      accessorKey: 'marketReturnValue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>,
    },
    {
      header: 'Good Return Value',
      accessorKey: 'goodReturnValue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>,
    },
    {
      header: 'Free Issue',
      accessorKey: 'freeIssue',
      cell: ({ getValue }) => <div className="text-right">{formatCurrency(getValue<number>())}</div>,
    },
    {
      header: 'Discount %',
      accessorKey: 'discountPercentage',
      cell: ({ getValue }) => <div className="text-right">{getValue<number>()}%</div>,
    },
    {
      header: 'Actual Value',
      accessorKey: 'actualValue',
      cell: ({ getValue }) => (
        <div className="text-right font-medium">{formatCurrency(getValue<number>())}</div>
      ),
    },
    {
      header: 'Booking Date',
      accessorKey: 'bookingDate',
      cell: ({ getValue }) => dayjs(getValue<string>()).format('DD/MM/YYYY'),
      sortingFn: 'datetime',
    },
    {
      header: 'Actual Date',
      accessorKey: 'actualDate',
      cell: ({ getValue }) => {
        const date = getValue<string>();
        return date ? dayjs(date).format('DD/MM/YYYY') : 'N/A';
      },
      sortingFn: 'datetime',
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <FiEye
            onClick={() => handleView(row.original)}
            className="cursor-pointer text-blue-500 text-lg hover:text-blue-700 transition-colors"
          />
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter, sorting },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize } },
  });

  return (
    <div className="p-6 w-full mx-auto space-y-6">
      {/* 1st Card - Distributor Info */}
      <Card className="rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700 transition-all">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl w-16 h-16 flex items-center justify-center shadow-md border border-blue-200 dark:border-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{agencyName}</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">Distributor</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{distributorName}</div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-blue-100 dark:border-gray-700 shadow-sm">
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">Territory</div>
                  <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{territory}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <Select
                id="status-select"
                size="sm"
                placeholder="All"
                options={typeOptions}
                value={typeOptions.find(o => o.value === statusFilter)}
                onChange={o => setStatusFilter(o?.value ?? '')}
              />
            </div>
            {/* Invoice Type Filter */}
            <div>
              <label htmlFor="invoice-type-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Invoice Type
              </label>
              <Select
                id="invoice-type-select"
                size="sm"
                placeholder="All"
                options={invoiceTypeOptions}
                value={invoiceTypeOptions.find(o => o.value === invoiceTypeFilter)}
                onChange={o => setInvoiceTypeFilter(o?.value ?? '')}
              />
            </div>
            {/* Date Range Filter */}
            <div>
              <label htmlFor="date-range-picker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label>
              <DatePickerRange
                id="date-range-picker"
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select date range"
                clearable
                size="sm"
              />
            </div>
          </div>
         
        </div>
      </Card>


      {/* 3rd Card - Summary Counts */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border border-blue-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Productive Calls</div>
            <div className="mt-1 text-xl font-bold text-blue-600 dark:text-blue-400">0</div>
          </div>
          <div className="bg-orange-50 dark:bg-gray-700 p-4 rounded-lg border border-orange-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Unproductive Calls</div>
            <div className="mt-1 text-xl font-bold text-orange-600 dark:text-orange-400">0</div>
          </div>
          <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg border border-red-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Canceled Bills</div>
            <div className="mt-1 text-xl font-bold text-red-600 dark:text-red-400">0</div>
          </div>
          <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg border border-yellow-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Reversed Bills</div>
            <div className="mt-1 text-xl font-bold text-yellow-600 dark:text-yellow-400">0</div>
          </div>
          <div className="bg-purple-50 dark:bg-gray-700 p-4 rounded-lg border border-purple-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Cancel Bill Total</div>
            <div className="mt-1 text-xl font-bold text-purple-600 dark:text-purple-400">Rs.0</div>
          </div>
          <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg border border-green-100 dark:border-gray-600">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Day Total</div>
            <div className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">Rs.0</div>
          </div>
        </div>
      </Card>

      {/* 4th Card - Table */}
      <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span className="mr-2">Search:</span>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
              className="w-64"
            />
          </div>
        </div>

        <Table>
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    <div
                      className={header.column.getCanSort()
                        ? 'cursor-pointer select-none flex items-center gap-1'
                        : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <Sorter sort={header.column.getIsSorted()} />
                      )}
                    </div>
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody>
            {table.getRowModel().rows.map((row, index) => {
              const currentDate = dayjs(row.original.bookingDate).format('YYYY-MM-DD');
              const prevDate =
                index > 0
                  ? dayjs(table.getRowModel().rows[index - 1].original.bookingDate).format('YYYY-MM-DD')
                  : null;
              return (
                <React.Fragment key={row.id}>
                  {(index === 0 || currentDate !== prevDate) && (
                    <Tr className="bg-gray-100 dark:bg-gray-700 border-t-2 border-b-2 border-gray-200 dark:border-gray-600">
                      <Td colSpan={columns.length} className="text-center py-3 font-semibold">
                        {dayjs(currentDate).format('dddd, MMMM D, YYYY')}
                      </Td>
                    </Tr>
                  )}
                  <Tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                </React.Fragment>
              );
            })}
          </TBody>
        </Table>

        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <Pagination
            pageSize={table.getState().pagination.pageSize}
            currentPage={table.getState().pagination.pageIndex + 1}
            total={filteredData.length}
            onChange={(page) => table.setPageIndex(page - 1)}
          />
          <div className="min-w-[130px]">
            <Select
              size="sm"
              isSearchable={false}
              value={pageSizeOptions.find((option) => option.value === pageSize)}
              options={pageSizeOptions}
              onChange={(option) => {
                const size = option?.value ?? 10;
                setPageSize(size);
                table.setPageSize(size);
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ViewInvoices;
